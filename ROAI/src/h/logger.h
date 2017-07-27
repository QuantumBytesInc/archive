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
 * \file    	logger.h
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

#ifndef LOGGER_H
#define LOGGER_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QString>
#include <QFile>
#include <QApplication>
#include <QTextStream>
#include <QDateTime>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "constants.h"


/**
 * @brief The Logger class
 */
class Logger
{
    public:
        /**
         * @brief Constructor
         * @param _logFileName The name of the log file
         */
        Logger(QString _logFileName);

        /**
          * @brief Deconstructor
          */
        ~Logger();

        /**
         * @brief Add entry to log file
         * @param _logLevel The log file
         * @param _text The text to log
         */
        void addEntry(int _logLevel, QString _text, QString _function);

    private:

        /**
         * @brief The log file
         */
        QFile *file;

        /**
         * @brief Rotate log files
         */
        void rotate();

        /**
         * @brief Current log files
         */
        int fileCount;

        /**
         * @brief The log file name
         */
        QString logName;

        /**
         * @brief Text stream to write into log file
         */
        QTextStream *stream;
};


#endif // LOGGER_H

