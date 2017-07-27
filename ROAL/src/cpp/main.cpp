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
 * \brief       The world famous main
 *
 * \file    	main.cpp
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
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#define WIN32_LEAN_AND_MEAN

#include <QApplication>
#include <QtGui>
#include <QFontDatabase>
#include "../external/singleapplication.h"

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/logging.h"
#include "../h/mainwindow.h"
#include "../h/systeminformation.h"
#include <iostream>


/**
 * \brief The main loop-
 *
 * The main class of the appliaction.
 *
 * \param[in] argc Count of arguments.
 * \param[in] *argv Array with the arguments.
 *
 * \return Returns QAppliaction state.
 *
*/
int main(int argc, char *argv[])
{
    // Set appliaction properties
    QApplication::setApplicationName("Relics of Annorath Launcher");
    QApplication::setOrganizationName("QuantumBytes Inc.");

    // Create the QAppliaction object
    SingleApplication a(argc, argv);

    //a.setApplicationName("Relics of Annorath Launcher");
    //a.setApplicationDisplayName("Relics of Annorath Launcher"); // This seems to have no affect yet, wait for qt5 realese version

    a.setApplicationVersion(ROA_LAUNCHER_VERSION); // Do not fuck this up, it is used for application update process

    a.setOrganizationName("QuantumBytes inc.");
    a.setOrganizationDomain("quantum-bytes.com");

    // Start logging
    SystemInformation s;
    Logging::init();
    Logging::addEntry(LOG_LEVEL_INF, "Launcher started", FUNCTION_NAME );

    // Add custom font
    QFontDatabase::addApplicationFont(":/font/Ubuntu-B.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-BI.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-C.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-L.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-LI.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-M.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-MI.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-R.ttf");
    QFontDatabase::addApplicationFont(":/font/Ubuntu-RI.ttf");

    Logging::addEntry(LOG_LEVEL_INF, "Fonts added", FUNCTION_NAME );

    // Create the MainWindow
    MainWindow w;

    // Activate window
    QApplication::setActiveWindow(&w);

    //std::cout << "debugging informationen" << std::endl;
    //std::cout << s.getSystemInformation().toStdString() << std::endl;

    return a.exec();
}

