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
 * \brief       Handels the update process for the Installer and related files
 *
 * \file    	roainstaller.h
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

#ifndef ROAINSTALLER_H
#define ROAINSTALLER_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QObject>
#include <QSettings>
#include <QtNetwork/QNetworkAccessManager>
#include <QtNetwork/QSslConfiguration>
#include <QtNetwork/QNetworkRequest>
#include <QtNetwork/QNetworkReply>
#include <QtNetwork/QSslError>
#include <QStandardPaths>
#include <QFile>
#include <QMessageBox>
#include <QFileDialog>


/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/

#include "../h/roamainwidget.h"
#include "../h/logging.h"

#ifdef Q_OS_WIN
#include "../h/windowsprocess.h"
#include "winnls.h"
#include "shobjidl.h"
#include "objbase.h"
#include "objidl.h"
#include "shlguid.h"
#endif


/**
 * \brief Installer logic for the Relics of Annorath Launcher and game files
 */
class ROAInstaller : public QObject
{
        Q_OBJECT
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
         * \brief Constructor
         * \param parent The parent
         */
        explicit ROAInstaller(QObject *parent = 0);

        /**
         * \brief Deconstuctor
         */
        ~ROAInstaller();

        /**
         * \brief Start the installation process
         */
        void install();

        /**
         * \brief Start the verify process
         */
        void verify();

        /**
         * \brief Start the repair process
         */
        void repair();

        /**
         * \brief Start the update process
         */
        void update();

        /**
         * \brief Start the uninstall process
         */
        void uninstall();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief Network manager for downloading files
         */
        QNetworkAccessManager manager;

        /**
         * \brief SSL config for custom CAs
         */
        QSslConfiguration sslConfig;

        /**
         * \brief Custom CAs
         */
        QList<QSslCertificate> certificates;

        /**
         * \brief Request for downloading
         */
        QNetworkRequest request;

        /**
         * \brief Installation path
         */
        QString installationPath;

        /**
         * \brief File list to download
         */
        QStringList fileList;

        /**
         * \brief MD5 of files for verifying
         * \todo This has no use atm
         */
        QStringList fileListMD5;

        /**
         * \brief List of selected components to install
         */
        QStringList componentsSelected;

        /**
         * \brief The user settings
         */
        QSettings *userSettings;

        /**
         * \brief Installation mode
         */
        QString installationMode;

        /**
         * \brief Old installation path
         */
        QString installPathOld;

#ifdef Q_OS_WIN
        /**
         * @brief Windows process instance
         */
        WindowsProcess *thread;

        /**
         * @brief Path to process binary
         */
        QStringList processPaths;

        /**
         * @brief Process arguments
         */
        QStringList processArgs;
#endif

        /**
         * \brief Main windows
         */
        RoaMainWidget *mainWidget;

        /**
         * \brief Current page index
         */
        int curPage;

        /**
         * \brief Current download phase (0 init, 1 file download)
         */
        int downloadPhase;

        /**
         * \brief Files left to download
         */
        qint32 filesLeft;

        /**
         * \brief Block mode, if a condition is to bad some actions are disabled (no installPath = we can't verify anything)
         */
        bool blockMode;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief Remove a dir with all its content
         *
         * \param _dir The directory to remove
         */
        bool removeDirWithContent(QString _dir);

        /**
         * \brief Remove no longer needed files from previous releases
         */
        void cleanupObsoletFiles();

        /**
         * \brief Check if neded dirs are existing, if not create them
         */
        void checkDirectories();

        /**
         * \brief Get file list from remote server
         */
        void getRemoteFileList();

        /**
         * \brief Install optional components and create shortcuts
         */
        void installOptionalComponents();

        /**
         * \brief Prepare the download
         */
        void prepareDownload();

        /**
         * \brief Download the next file in queue
         */
        void getNextFile();

        /**
         * \brief Check file with md5
         */
        bool checkFileWithHash(QString _file, QString _hash);

#ifdef Q_OS_LINUX
        /**
         * \brief Create linux shortcuts
         * \param _path The path where the shortcut is created
         * \param _binaryName Name of the binary
         * \param _display Should icon be visible or not
         */
        void createLinuxShortcut(QString _path, QString _binaryName, bool _display);
#endif

#ifdef Q_OS_WIN32
        /**
         * \brief Create windows shortcuts
         * \param _path The path where the shortcut is created
         */
        void createWindowsShortcuts(QString _path);

        /**
         * @brief Start process
         */
        void startProcess();
#endif

    private slots:

        /**
         * \brief Saves the file when download finished
         * \param reply The data of the downloaded file
         */
        void slot_downloadFinished(QNetworkReply *reply);

        /**
         * \brief Checks for SSL errors
         * \param reply The reply
         * \param errors Error list
         */
        void slot_getSSLError(QNetworkReply* reply, const QList<QSslError> &errors);

        /**
         * \brief Start installation process
         */
        void startInstallation();

#ifdef Q_OS_WIN32
        /**
         * @brief Slot when process is done
         */
        void slot_processDone();
#endif

};

#endif // ROAINSTALLER_H
