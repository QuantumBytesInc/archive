/**
 * \copyright   Copyright © 2012 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * \section LICENSE
 *
 *              This file is part of Relics of Annorath Installer.
 *
 *              Relics of Annorath Installer is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              Relics of Annorath Installer is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with Relics of Annorath Installer.  If not, see <http://www.gnu.org/licenses/>.
 *
 * \brief       Windows process threaded for non-blocking gui
 *
 * \file    	windowsprocess.h
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2012/12/01 23:10:00 GMT+1
 *
 */

#ifndef WINDOWSPROCESS_H
#define WINDOWSPROCESS_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QThread>
#include <QString>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#ifdef Q_OS_WIN
#include <Windows.h>
#endif

/**
 * \brief Windows process for threaded installation without locking
 */
class WindowsProcess : public QThread
{
    public:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Set process environment
         * @param _path The process path
         * @param _args The process arguments
         */
        void setProcessEnv(QString _path, QString _args);

        /**
         * @brief Set process environment for launcher
         * @param _path The path to launcher
         * @param _env The environment path
         */
        void setProcessEnvLauncher(QString _path, QString _env);

        /**
         * @brief Run the thread
         */
        void run();

        /**
         * @brief Get result of the process
         * @return The result
         */
        bool getResult();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Process result
         */
        bool result;

        /**
         * @brief Launcher installation path
         */
        QString installationPath;

        /**
         * @brief Process arguments
         */
        QString args;

        /**
         * @brief Launcher environment
         */
        QString env;

        /**
         * @brief Process mode
         */
        int mode;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/
};

#endif // WINDOWSPROCESS_H
