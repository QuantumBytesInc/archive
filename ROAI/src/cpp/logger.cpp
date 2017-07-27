/**
 * \copyright
 *              Copyright © 2013 QuantumBytes inc.
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
 * \brief       Logger
 *
 * \file    	logger.cpp
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2013/09/22 19:00:00 GMT+1
 *
 */


/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/logger.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

Logger::Logger(QString _logFileName)
{
    // Open log file
    file = new QFile(_logFileName);
    file->open(QIODevice::WriteOnly | QIODevice::Text);

    stream = new QTextStream(file);

    // Set file count to one
    fileCount = 1;

    // Set log name
    logName = _logFileName;
}

Logger::~Logger()
{
    // Cleanup
    delete stream;
    file->close();

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

    stream->operator<<(QDateTime::currentDateTime().toString() +
                       " [" + prefix + "] " +
                       " [" + _function + "] " +
                       _text + "\n");
    stream->flush();
    file->flush();
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
        file->close();
        QFile::copy(QCoreApplication::applicationDirPath() + "/log/" + logName, QCoreApplication::applicationDirPath() + "/log/" + logName + "." + fileCount);
        file->open(QIODevice::WriteOnly | QIODevice::Text);

        // Increase file count
        fileCount++;
    }
}
