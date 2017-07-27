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

#ifndef LOGGINGQB_CPP
#define LOGGINGQB_CPP

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
#include "../h/logging.h"

/**
 * @addtogroup Logging
 */
namespace Logging
{
    Logger *logFile = NULL;

    void init(QString _installationPath)
    {
        logFile = new Logger(_installationPath + "installer.log");
    }

    void shutdown()
    {
        delete logFile;
        logFile = NULL;
    }

    void addEntry(int _logLevel, QString _message, QString _caller)
    {
        if(logFile != NULL)
            logFile->addEntry(_logLevel, _message, _caller);
    }
}

#endif // LOGGINGQB_CPP

