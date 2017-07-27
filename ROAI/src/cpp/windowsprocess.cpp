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
 * \file    	windowsprocess.cpp
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

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/windowsprocess.h"

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
void WindowsProcess::setProcessEnv(QString _path, QString _args)
{
    installationPath = _path;
    args = _args;
    env = "";
    mode = 0;
}

void WindowsProcess::setProcessEnvLauncher(QString _path, QString _env)
{
    installationPath = _path;
    env = _env + "launcher/";
    mode = 1;
}


void WindowsProcess::run()
{
#ifdef Q_OS_WIN
    if(mode != 0)
    {
        QString qPath = getenv("PATH");
        qPath += QString(";" + env + "launcher/bin");
        qPath += QString(";" + env + "launcher/lib");

        qPath.replace('/','\\');

        LPCWSTR path = reinterpret_cast<const wchar_t *>(qPath.utf16());
        LPCWSTR envVal = reinterpret_cast<const wchar_t *>(QString("PATH").utf16());
        LPCWSTR lpDir = reinterpret_cast<const wchar_t *>(env.utf16());

        SetEnvironmentVariable(envVal,path);

        //ShellExecute(0, 0, reinterpret_cast<const WCHAR*>(installationPath.utf16()), 0, 0, SW_NORMAL);
        SHELLEXECUTEINFO shExInfo = {0};
        shExInfo.cbSize = sizeof(shExInfo);
        shExInfo.fMask = SEE_MASK_NOCLOSEPROCESS;
        shExInfo.hwnd = 0;
        shExInfo.lpVerb = NULL;
        shExInfo.lpFile = reinterpret_cast<const WCHAR*>(installationPath.utf16());
        shExInfo.lpParameters = NULL;
        shExInfo.lpDirectory = lpDir;
        shExInfo.nShow = SW_SHOW;
        shExInfo.hInstApp = 0;

        ShellExecuteEx(&shExInfo);

        //WaitForSingleObject(shExInfo.hProcess, INFINITE);
        //CloseHandle(shExInfo.hProcess);
        //CloseHandle(shExInfo.hThread);

    }
    else
    {
        SHELLEXECUTEINFO ShExecInfo = {0};
        ShExecInfo.cbSize = sizeof(SHELLEXECUTEINFO);
        ShExecInfo.fMask = SEE_MASK_NOCLOSEPROCESS;
        ShExecInfo.hwnd = NULL;
        ShExecInfo.lpVerb = NULL;
        ShExecInfo.lpFile = reinterpret_cast<const WCHAR*>(installationPath.utf16());
        ShExecInfo.lpParameters = reinterpret_cast<const WCHAR*>(args.utf16());
        ShExecInfo.lpDirectory = NULL;
        ShExecInfo.nShow = SW_HIDE;
        ShExecInfo.hInstApp = NULL;
        ShellExecuteEx(&ShExecInfo);

        WaitForSingleObject(ShExecInfo.hProcess,INFINITE);
    }
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
