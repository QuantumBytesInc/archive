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
 * \brief       Handels the update process for the launcher and related files
 *
 * \file    	httpupdate.h
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
#include "../h/httpupdate.h"
#include "ui_httpupdate.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

HttpUpdate::HttpUpdate(Settings *_settings, QWidget *parent) :
    QWidget(parent),
    ui(new Ui::HttpUpdate)
{
    Logging::addEntry(LOG_LEVEL_INF, "Starting HTTP update", FUNCTION_NAME);

    // Create the GUI
    ui->setupUi(this);
    jsonRequest = &JsonRequest::getInstance();

    // Center the widget
    this->setGeometry(QStyle::alignedRect(
                          Qt::LeftToRight,
                          Qt::AlignCenter,
                          this->size(),
                          qApp->desktop()->availableGeometry()
                          ));

    // Remove window borders
    setWindowFlags(Qt::FramelessWindowHint);
    setAttribute(Qt::WA_TranslucentBackground, true);

    // Create the settings object
    settings = _settings;

    // Add certificates
    certificates.append(QSslCertificate::fromPath(":/certs/class2.pem"));
    certificates.append(QSslCertificate::fromPath(":/certs/ca.pem"));

    // Set ssl config
    sslConfig.defaultConfiguration();
    sslConfig.setCaCertificates(certificates);

    request.setSslConfiguration(sslConfig);

    // Connect manager
    connect(&manager, SIGNAL(sslErrors(QNetworkReply*, const QList<QSslError>&)),this, SLOT(slot_getSSLError(QNetworkReply*, const QList<QSslError>&)));

    // Connect json
    connect(jsonRequest, SIGNAL(responseReceived(int, int, int, QString)), this, SLOT(slot_checkVersion(int, int, int, QString)));

    // Retranslate
    ui->retranslateUi(this);

    // Start and Connect the timer
    connect(&timer, SIGNAL(timeout()), this , SLOT(slot_startCheck()));
    timer.start(2000);
}

HttpUpdate::~HttpUpdate()
{
    Logging::addEntry(LOG_LEVEL_INF, "Delete HttpUpdate", FUNCTION_NAME);
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void HttpUpdate::downloadInstaller()
{
    Logging::addEntry(LOG_LEVEL_INF, "Download installer", FUNCTION_NAME);

    // Download the installer file from the remote server
#ifdef Q_OS_WIN32
    request.setUrl(QUrl(QString(HTTP_URL_CONTENT_DATA) + QString("roainstaller_windows_x64.exe")));
#endif

#ifdef Q_OS_LINUX
    request.setUrl(QUrl(QString(HTTP_URL_CONTENT_DATA) + QString("roainstaller_linux_x64")));
#endif

    connect(&manager, SIGNAL(finished(QNetworkReply*)),this, SLOT(slot_startInstaller(QNetworkReply*)));
    manager.get(request);
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void HttpUpdate::slot_startCheck()
{
    Logging::addEntry(LOG_LEVEL_INF, "Start version checking", FUNCTION_NAME);

    // Stop the timer we started in the constructor
    timer.stop();

    // Download the version file from the remote server
    jsonRequest->setRequestData(QString("{\"CALLER\":" + QString::number(GUI::Caller::LAUNCHER) + "," +
                                       "\"ACTION\":" + QString::number(GUI::Action::LAUNCHER_VERSION_CHECK) + "," +
                                       "\"DATA\":{}}"));

    manager.get(request);
}

void HttpUpdate::slot_checkVersion(int _caller, int _action, int _returnCode, QString _data)
{
    Logging::addEntry(LOG_LEVEL_INF, "Current version on server is " + _data + " (local: " + QCoreApplication::applicationVersion() + ")" , FUNCTION_NAME);
    Logging::addEntry(LOG_LEVEL_TRC, "Caller/Action/ReturnCode" + QString::number(_caller) + "/" + QString::number(_action) + "/" + QString::number(_returnCode), FUNCTION_NAME);

    // Set remote version
    remoteVersion = _data;

    // Check with our version
    if(QCoreApplication::applicationVersion() == remoteVersion)
    {
        Logging::addEntry(LOG_LEVEL_INF, "Newest version already installed", FUNCTION_NAME);

        ui->label->setText(tr("No launcher updates found"));
        emit updateChecked(true, false);
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "New version available", FUNCTION_NAME);

#ifdef BUILD_CUSTOM
        QMessageBox::critical(this, "New version available", "Please contact the package maintainer for an updated launcher version.", QMessageBox::Close);
        QApplication::quit();
#elif DISTRO_BUILD
        QMessageBox::critical(this, "New version available", "Please update the launcher using your package manager.", QMessageBox::Close);
        QApplication::quit();
#else
        ui->label->setText(tr("Downloading new launcher"));
        downloadInstaller();
#endif
    }
}

void HttpUpdate::slot_startInstaller(QNetworkReply *reply)
{
    // Disconnect signal
    disconnect(&manager, SIGNAL(finished(QNetworkReply*)),this, SLOT(slot_startInstaller(QNetworkReply*))); /// \warning This is essential, else wrong data is read later!

    if(reply->error() == QNetworkReply::NoError)
    {
        ui->label->setText(tr("Saving new launcher"));

        // Check if the folder exists
        if(!QDir(settings->getSetting("installLocation") + "launcher/downloads").exists())
        {
            Logging::addEntry(LOG_LEVEL_WRN, "Missing downloads folder, creating it", FUNCTION_NAME);
            QDir().mkdir(settings->getSetting("installLocation") + "launcher/downloads");
        }

        // Open the file to write to
#ifdef Q_OS_WIN32
        QFile file(settings->getSetting("installLocation") + "launcher/downloads/installer.exe");
#endif

#ifdef Q_OS_LINUX
        QFile file(settings->getSetting("installLocation") + "launcher/downloads/installer");
#endif

        if(file.open(QIODevice::WriteOnly))
        {
            // Open a stream to write into the file
            QDataStream stream(&file);

            // Get the size of the torrent
            int size = reply->size();

            // Get the data of the torrent
            QByteArray temp = reply->readAll();

            // Write the file
            stream.writeRawData(temp, size);

            // Set permissions
            file.setPermissions(QFile::ExeUser | QFile::ExeGroup | QFile::ExeOwner | QFile::WriteUser | QFile::WriteGroup | QFile::WriteOwner | QFile::ReadGroup | QFile::ReadOwner | QFile::ReadUser);

            // Close the file
            file.close();

            Logging::addEntry(LOG_LEVEL_INF, "Installer sucessfully saved", FUNCTION_NAME);

#ifdef Q_OS_WIN
            SHELLEXECUTEINFO ShExecInfo = {0};
            ShExecInfo.cbSize = sizeof(SHELLEXECUTEINFO);
            ShExecInfo.fMask = SEE_MASK_NOCLOSEPROCESS;
            ShExecInfo.hwnd = NULL;
            ShExecInfo.lpVerb = NULL;
            ShExecInfo.lpFile = reinterpret_cast<const WCHAR*>(QString(settings->getSetting(QString("installLocation")) + "launcher/downloads/installer.exe").utf16());
            ShExecInfo.lpParameters = reinterpret_cast<const WCHAR*>(QString(" update").utf16());
            ShExecInfo.lpDirectory = NULL;
            ShExecInfo.nShow = SW_SHOWNORMAL;
            ShExecInfo.hInstApp = NULL;
            ShellExecuteEx(&ShExecInfo);
            WaitForSingleObject(ShExecInfo.hProcess,0);

            //ShellExecute(0, 0,  reinterpret_cast<const WCHAR*>(QString(settings->getSetting("installLocation") + "launcher/downloads/installer.exe").utf16()), reinterpret_cast<const WCHAR*>(QString(" update").utf16()), NULL, SW_SHOWNORMAL);
            emit updateChecked(false, true);
#endif

#ifdef Q_OS_LINUX
            // When process is done, send signal for QApplicationExit and new start of the launcher
            connect(&installer, SIGNAL(started()),this, SLOT(slot_installerFinished()));

            // While the client is a linux os, we can simply overwrite stuff and restart the launcher
            installer.start(settings->getSetting("installLocation") + "launcher/downloads/installer", QStringList("update"));
#endif
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Installer could not be saved", FUNCTION_NAME);
            ui->label->setText("Installer could not be saved!");
            emit updateChecked(false, false);
        }
    }
    // If error, we stop everything
    else
    {
        Logging::addEntry(LOG_LEVEL_ERR, reply->errorString(), FUNCTION_NAME);

        // Print error in the widget
        ui->label->setText(reply->errorString()+ " !");

        // Send the singla that we are done here, but something goes horrible wrong
        emit updateChecked(false, false);
    }
}

void HttpUpdate::slot_getSSLError(QNetworkReply* reply, const QList<QSslError> &errors)
{
    // We only take the first error
    QSslError sqlError = errors.first();

    if(sqlError.error() != QSslError::NoError )
    {
        //reply->ignoreSslErrors();
        Logging::addEntry(LOG_LEVEL_ERR, reply->errorString(), FUNCTION_NAME);
        ui->label->setText(reply->errorString());
    }
}

void HttpUpdate::slot_installerFinished()
{
    Logging::addEntry(LOG_LEVEL_INF, "Close application", FUNCTION_NAME);
    QApplication::quit();
}
