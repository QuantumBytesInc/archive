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
 * \brief       Logging NS
 *
 * \file    	logging.cpp
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

#ifndef LOGGING_H
#define LOGGING_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QString>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/logger.h"
#include "../h/constants.h"

#ifdef _MSC_VER // Visual Studio
    #define FUNCTION_NAME __FUNCTION__
#else
    #define FUNCTION_NAME __PRETTY_FUNCTION__
#endif

/**
 * @addtogroup Logging
 */
namespace Logging
{
    /**
     * @brief The log file
     */
    extern Logger *logFile;

    /**
     * @brief Init for the logging
     */
    extern void init(QString _installationPath);

    /**
     * @brief Shutdown for the logging
     */
    extern void shutdown();

    /**
     * @brief Add entry
     * @param _logLevel The log level
     * @param _message The message
     * @param _caller The calling function
     */
    extern void addEntry(int _logLevel, QString _message, QString _caller);
}


#endif // LOGGING_H

