/**
 * @copyright
 *              Copyright © 2011 Manuel Gysin
 *              Copyright © 2012 QuantumBytes inc.
 *              Copyright © 2014 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * @section LICENSE
 *
 *              This file is part of QuantumBytes Interface.
 *
 *              QuantumBytes Interface is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              QuantumBytes Interface is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with QuantumBytes Interface.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @brief       Class for handling HTTP related requests, does a json-post-request
 *
 * @file    	jsonrequest.cpp
 *
 * @note
 *
 * @version 	3.0
 *
 * @author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * @date        2014/11/03 19:00:00 GMT+1
 *
 */

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include <logger.h>

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

Logger::Logger(QString _logFileName)
{
    // Check if folder exists
    if(!QDir(QCoreApplication::applicationDirPath() + "/log/").exists())
    {
        QDir().mkdir(QCoreApplication::applicationDirPath() + "/log");
    }

    // Open log file
    file = new QFile(QString(QCoreApplication::applicationDirPath() + "/log/" + _logFileName));
    file->open(QIODevice::WriteOnly | QIODevice::Text);

    // Create stream
    stream = new QTextStream(file);

    // Set file count to one
    fileCount = 1;

    // Set log name
    logName = _logFileName;

    // Add start entry
    addEntry(LOG_LEVEL_INF, "Started", __PRETTY_FUNCTION__);

    timer.start();
}

Logger::~Logger()
{
    // Save
    stream->flush();
    file->flush();

    // Close
    file->close();
    delete stream;
    delete file;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void Logger::addEntry(int _logLevel, QString _text, QString _function)
{
    // Check if we need to rotate
    rotate();

    // Add prefix
    QString prefix = "";

    // Check for log level
    switch(_logLevel)
    {
        case LOG_LEVEL_ERR:
            prefix = "ERR";
            break;
        case LOG_LEVEL_WRN:
            prefix = "WRN";
            break;
        case LOG_LEVEL_INF:
            prefix = "INF";
            break;
        case LOG_LEVEL_TRC:
            prefix = "TRC";
            break;
    }

    // Stream to log
    do
    {
        if(stream != NULL)
        {
            stream->operator<<(QDateTime::currentDateTime().toString(Qt::ISODate) +
                               " [" + prefix + "] " +
                               " [" + _function + "] " +
                               _text + "\n");
        }
    }while(stream == NULL);

    // Flush
    /// @note Workaround to fix random crash on high load
    if(timer.elapsed() > qint64(500))
    {
        stream->flush();
        file->flush();
        timer.start();
    }
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void Logger::rotate()
{
    // Rotate file after 50mb of data
    if(file->size() > qint64(52428800))
    {
        // Move file to a new one
        stream->flush();
        file->flush();

        file->close();

        file = NULL;
        stream = NULL;

        if(file == NULL)
            delete file;
        if(stream == NULL)
            delete stream;

        QFile::copy(QCoreApplication::applicationDirPath() + "/log/" + logName, QCoreApplication::applicationDirPath() + "/log/" + logName + "." + QString::number(fileCount));

        file = new QFile(QString(QCoreApplication::applicationDirPath() + "/log/" + logName));
        file->open(QIODevice::WriteOnly | QIODevice::Text);

        // Increase file count
        fileCount++;

        stream = new QTextStream(file);
    }
}
