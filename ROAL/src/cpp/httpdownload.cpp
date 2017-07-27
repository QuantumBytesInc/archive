/**
 * \copyright
 *              Copyright © 2011 Manuel Gysin
 *              Copyright © 2012 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * \section LICENSE
 *
 *              This file is part of Relics of Annorath Launcher.
 *
 *              Relics of Annorath Launcher is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              Relics of Annorath Launcher is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with Relics of Annorath Launcher.  If not, see <http://www.gnu.org/licenses/>.
 *
 * \brief       The http download part, used for downloading game files over http.
 *
 * \file    	httpdownload.h
 *
 * \note
 *
 * \version 	3.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2011/04/10 19:00:00 GMT+1
 *              2012/11/30 23:10:00 GMT+1
 *              2013/11/24 19:00:00 GMT+1
 *
 */

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/httpdownload.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

HttpDownload::HttpDownload(QString _path)
{
    Logging::addEntry(LOG_LEVEL_INF, "Preparing HTTP download", FUNCTION_NAME);

    installationPath = _path;
    downloadPhase = 0;
    totalSizeDownload = 0;
    totalSizeDownloadedCurrent = 0;
    totalSizeDownloaded = 0;
    speed = 0;
    extractionState = false;
    status = "checking";
    archive = new FileDecompression();

    getRemoteFileList();
}

HttpDownload::~HttpDownload()
{
    Logging::addEntry(LOG_LEVEL_INF, "Delete HttpDownload", FUNCTION_NAME);
}

int HttpDownload::progress()
{
    int value;

    if(status == "downloading" || status == "extracting")
        value = float(totalSizeDownloaded + totalSizeDownloadedCurrent) / float(totalSizeDownload + 0.1) * 100;
    else if(status == "done")
        value = 100;
    else
        value = 0;

    return value;
}

double HttpDownload::networkSpeed()
{
    return speed;
}

qint64 HttpDownload::getFullDownloadSize()
{
    return totalSizeDownload / 1024 / 1024;
}

qint64 HttpDownload::getCurrentDownloadSize()
{
    return (totalSizeDownloaded + totalSizeDownloadedCurrent) / 1024 / 1024;
}

QString HttpDownload::getStatus()
{
    return status;
}

int HttpDownload::getFilesLeft()
{
    return filesLeft;
}

bool HttpDownload::getExtractionState()
{
    return extractionState;
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void HttpDownload::getRemoteFileList()
{
    Logging::addEntry(LOG_LEVEL_INF, "Get file list from server", FUNCTION_NAME);

    // Prepare downloading over ssl
    certificates.append(QSslCertificate::fromPath(":/certs/class2.pem"));
    certificates.append(QSslCertificate::fromPath(":/certs/ca.pem"));

    sslConfig.defaultConfiguration();
    sslConfig.setCaCertificates(certificates);

    request.setSslConfiguration(sslConfig);

    connect(&manager, SIGNAL(finished(QNetworkReply*)),this, SLOT(slot_downloadFinished(QNetworkReply*)));
    connect(&manager, SIGNAL(sslErrors(QNetworkReply*, const QList<QSslError>&)),this, SLOT(slot_getSSLError(QNetworkReply*, const QList<QSslError>&)));

    request.setUrl(QUrl(QString(HTTP_URL_CONTENT_DATA) + QString("game.txt")));

    // Start download
    manager.get(request);
}

void HttpDownload::prepareDownload()
{
    Logging::addEntry(LOG_LEVEL_INF, "Preparing files to download", FUNCTION_NAME);

    // Open file and read it
#ifdef BUILD_CUSTOM
    QFile file(installationPath + "launcher/downloads/files_game_custom.txt");
#else
    QFile file(installationPath + "launcher/downloads/files_game.txt");
#endif
    if (file.open(QIODevice::ReadOnly))
    {
        QTextStream in(&file);

        while ( !in.atEnd() )
        {
            QStringList tmp = QString(in.readLine()).split(";");

            // Check if we got valid input
            if(tmp.size() == 3)
            {
                // Save values
                fileList.append(tmp.at(0));
                fileListMD5.append(tmp.at(1));
                fileListSize.append(tmp.at(2));
                //totalSizeDownload += tmp.at(2).toInt();
            }
        }
    }

    checkFilesWithHash();

    // Close file
    file.close();
}

void HttpDownload::checkFilesWithHash()
{
    Logging::addEntry(LOG_LEVEL_INF, "Checking file hash in new thread", FUNCTION_NAME);

    thread = new FileValidationThread();
    thread->setData(installationPath, &fileList, &fileListMD5, &fileListSize);

    connect(thread, SIGNAL(finished()),SLOT(slot_verificationDone()));

    thread->start();
}

void HttpDownload::getNextFile()
{
    if(filesLeft > 0)
    {
        Logging::addEntry(LOG_LEVEL_INF, "Download file", FUNCTION_NAME);

        // Set URL and start download
        request.setUrl(QUrl(QString(HTTP_URL_CONTENT_DATA) + QString(fileList.at(filesLeft-1))));

        // Start request
        currentDownload = manager.get(request);

        // Connect reply for measuring the speed
        connect(currentDownload, SIGNAL(downloadProgress(qint64,qint64)),SLOT(downloadProgress(qint64,qint64)));

        // Star the timeer
        downloadTime.start();

        // Set next file
        filesLeft -= 1;
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "All files downloaded", FUNCTION_NAME);

        status = "done";
    }
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void HttpDownload::slot_downloadFinished(QNetworkReply *reply)
{
    /**
     * @brief The file name
     */
    QString fileName;

    /**
     * @brief Flag for extraction
     */
    bool needsExtraction = false;

    // Check in which download phase we are
    switch(downloadPhase)
    {
        case 0:
            fileName = "launcher/downloads/files_game.txt";
            break;
        case 1:
            fileName =  fileList.at(filesLeft);
            break;
    }

    Logging::addEntry(LOG_LEVEL_INF, "Savinge file: " + fileName, FUNCTION_NAME);

    // Open the file to write to
    QFile file(installationPath + fileName);

    if(file.open(QIODevice::WriteOnly))
    {
        // Open a stream to write into the file
        QDataStream stream(&file);

        // Get the size of the file
        qint64 size = reply->size();

        // Add size to status int for displaying
        totalSizeDownloadedCurrent = qint64(0);
        totalSizeDownloaded += qint64(size);

        // Get the data of the file
        QByteArray temp = reply->read(size); // Note: ReadAll will crash 32 bit builds!

        // Write the file
        stream.writeRawData(temp, size);

        // Set exe permissions
        file.setPermissions(QFile::ExeUser | QFile::ExeGroup | QFile::ExeOwner | QFile::WriteUser | QFile::WriteGroup | QFile::WriteOwner | QFile::ReadGroup | QFile::ReadOwner | QFile::ReadUser);

        // Close the file
        file.close();

        // Check if it is an archive
        if(fileName.endsWith("xz"))
        {
            Logging::addEntry(LOG_LEVEL_INF, "Found archive, starting extracting", FUNCTION_NAME);

            // Get folder structure
            QStringList extractFolders = fileName.split("/");
            QString extractFolder;

            for(int i = 0; i < extractFolders.size()-1; i++)
            {
                extractFolder += extractFolders.at(i) + "/";
            }

            // Create sub folder to extract into
            QString targetFolder = extractFolders.last().split(".").at(0);
            QDir().mkdir(installationPath + extractFolder + targetFolder);

            // Create instance of archiver
            archive->setFile(extractFolders.last(), installationPath + extractFolder, targetFolder);

            // Connect as start as thread
            connect(archive, SIGNAL(extraction_done(bool)),SLOT(slot_extractionDone(bool)));
            archive->start();

            // Set flag and status
            needsExtraction = true;
            status = "extracting";
        }
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_ERR, "File could not be opened", FUNCTION_NAME);
    }

    // If phase 0 take future steps
    if(!needsExtraction)
    {
        switch(downloadPhase)
        {
            case 0:
                prepareDownload();
                downloadPhase = 1;
                break;
            case 1:
                getNextFile();
                break;
        }
    }
}

void HttpDownload::downloadProgress(qint64 bytesReceived, qint64 bytesTotal)
{
    Logging::addEntry(LOG_LEVEL_TRC, "Current download size: " + QString::number(bytesTotal), FUNCTION_NAME);

    // calculate the download speed
    speed = bytesReceived * 1000.0 / downloadTime.elapsed() / 1024;
    totalSizeDownloadedCurrent = bytesReceived;
}


void HttpDownload::slot_getSSLError(QNetworkReply* reply, const QList<QSslError> &errors)
{
    QSslError sslError = errors.first();

    if(sslError.error() == 11)
    {
        Logging::addEntry(LOG_LEVEL_INF, "SSL error: " + sslError.errorString(), FUNCTION_NAME);
        Logging::addEntry(LOG_LEVEL_INF, "Reply error: " + reply->errorString(), FUNCTION_NAME);
    }
}

void HttpDownload::slot_verificationDone()
{
    // Calculate remaing files
    filesLeft = fileList.size();

    for(int i = 0; i < fileListSize.size(); i++)
    {
        totalSizeDownload += fileListSize.at(i).toInt();
    }

    // Set status
    status = "downloading";

    // Get the next file
    getNextFile();
}

void HttpDownload::slot_extractionDone(bool _extractionState)
{
    // Check extraction state
    if(!_extractionState)
    {
        QMessageBox::information(0, "Extraction error!", "There was an error while extracting, please contact the support!");
    }
    else
    {
        extractionState = true;
    }

    // Set status
    status = "downloading";

    // Continue with downloading
    getNextFile();
}
