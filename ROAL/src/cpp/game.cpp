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
 * \brief       Game process threaded for non-blocking gui
 *
 * \file    	game.cpp
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2013/12/07 23:10:00 GMT+1
 *
 */

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/game.h"
#include "../h/logging.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/
void Game::setProcessEnv(QString _path, QString _pathToConfig)
{
    installationPath = _path;
    pathToConfig = installationPath + _pathToConfig;
}

void Game::run()
{
#ifdef Q_OS_WIN
    QString windowsPath = getenv("PATH");
    windowsPath += QString(";" + installationPath + "game/bin");
    windowsPath += QString(";" + installationPath + "game/lib");

    windowsPath.replace('/','\\');

    LPCWSTR path = reinterpret_cast<const wchar_t *>(windowsPath.utf16());
    LPCWSTR envVal = reinterpret_cast<const wchar_t *>(QString("PATH").utf16());

    SetEnvironmentVariable(envVal, path);
    QString binaryPath = installationPath + "game/bin/roa_x64.exe";

    binaryPath = binaryPath.replace('/','\\');

    Logging::addEntry(LOG_LEVEL_INF, "Game path: " + binaryPath, FUNCTION_NAME);
    Logging::addEntry(LOG_LEVEL_INF, "Config: " + pathToConfig, FUNCTION_NAME);

    SHELLEXECUTEINFO ShExecInfo = {0};
    ShExecInfo.cbSize = sizeof(SHELLEXECUTEINFO);
    ShExecInfo.fMask = SEE_MASK_NOCLOSEPROCESS;
    ShExecInfo.hwnd = NULL;
    ShExecInfo.lpVerb = NULL;
    ShExecInfo.lpFile = reinterpret_cast<const WCHAR*>(binaryPath.utf16());
    ShExecInfo.lpParameters = reinterpret_cast<const WCHAR*>(pathToConfig.utf16());
    ShExecInfo.lpDirectory = NULL;
    ShExecInfo.nShow = SW_SHOWNORMAL;
    ShExecInfo.hInstApp = NULL;
    ShellExecuteEx(&ShExecInfo);

    WaitForSingleObject(ShExecInfo.hProcess,INFINITE);
#endif

#ifdef Q_OS_LINUX
    // Get the current env
    QProcessEnvironment env = QProcessEnvironment::systemEnvironment();

    // Add roa to the ld path
    env.insert("LD_LIBRARY_PATH", installationPath + "game/lib");
    env.insert("MESA_GL_VERSION_OVERRIDE", "4.0FC");
    env.insert("MESA_GL_VERSION_OVERRIDE", "400");

    // Set the new env
    QProcess game;
    game.setProcessEnvironment(env);

    // Params
    QStringList params;
    params.append(pathToConfig);
    params.append("param.tmp");

    // Star the process
    game.start(installationPath + "game/bin/roa_x64", params);
    game.waitForFinished(-1);
#endif
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/
