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
 * \brief       The main launcher window for everything
 *
 * \file    	mainwindow.h
 *
 * \note
 *
 * \version 	2.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2011/04/10 19:00:00 GMT+1
 *              2012/11/30 23:10:00 GMT+1
 *
 */

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QMainWindow>
#include <QTimer>
#include <QSystemTrayIcon>
#include <QMenu>
#include <QDesktopServices>
#include <QMouseEvent>
#include <QAction>
#include <QTranslator>
#include <QProcessEnvironment>
#include <QDesktopWidget>
#include <QMap>
#include <QDesktopWidget>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "torrentclient.h"
#include "httpupdate.h"
#include "settings.h"
#include "httpdownload.h"
#include "customsound.h"
#include "aboutlauncher.h"
#include "constants.h"
#include "logging.h"
#include "game.h"
#include "jsonrequest.h"
#include "constants_external.h"
#include "configfile.h"

/**
 * \addtogroup Ui
 */
namespace Ui
{
    class MainWindow;
}

/**
 * \brief Class for the main launcher window
 */
class MainWindow : public QMainWindow
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
        explicit MainWindow(QWidget *parent = 0);

        /**
         * \brief Deconstructor
         */
        ~MainWindow();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief The sound source for background sound
         */
        CustomSound *sound;

        /**
         * \brief The UI-File
         */
        Ui::MainWindow *ui;

        /**
         * \brief Manage the whole torrent stuff
         */
        TorrentClient *torrent;

        /**
         * \brief Offset for window placing
         */
        QPoint offset;

        /**
         * \brief Provides a nice looking tray
         * \todo Broken for GNOME 3
         */
        QSystemTrayIcon *mTray;

        /**
         * \brief The menu for the tray icon
         */
        QMenu *trayMenu;

        /**
         * \brief Quit action for the tray menu
         */
        QAction *quitAction;

        /**
         * \brief Minimize/Maximize action for the tray menu
         */
        QAction *minimizeAction;

        /**
         * \brief The http update checker
         */
        HttpUpdate *httpUpdater;

        /**
         * \brief The settings object
         */
        Settings settings;

        /**
         * \brief Application translator
         */
        QTranslator *translator;

        /**
         * \brief Timer for periodically update torrent status
         */
        QTimer timer;

        /**
         * \brief HTTP download manager
         */
        HttpDownload *httpManager;

        /**
         * @brief Game process
         */
        Game *gameProcess;

        /**
         * @brief Current displayed widget
         */
        QWidget *currentWidget;

        /**
         * @brief Current displayed widget title
         */
        QString currentTitle;

        /**
         * @brief User token for authentication
         */
        QString userToken;

        /**
         * @brief JSON request object for backend communication
         */
        JsonRequest *jsonRequest;

        /**
         * @brief Timer for token updates
         */
        QTimer *timerUpdateToken;

        /**
         * \brief Flag for checking if window is moved
         */
        bool moving;

        /**
         * \brief Flag for checking if launcher is muted
         */
        bool muted;

        /**
         * \brief Flag for checking if torrent is paused
         */
        bool pause;

        /**
         * \brief torrentDone
         */
        bool torrentDone;

        /**
         * @brief cfg ConfigFile
         */
        ConfigFile *cfg;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief Setup for the tray icon
         */
        void setupTray();

        /**
         * \brief Toggle the windows visibility
         */
        void toggleVisibility();

        /**
         * \brief Configures the current path (takes the dir where the binary is located)
         */
        void configurePath();

        /**
         * \brief Retranslate the complate application
         */
        void retranslate();

        /**
         * @brief Start launcher
         */
        void startLauncher();

        /**
         * @brief Check if configuration needs update
         * @todo Add migration code here
         */
        void refreshConfiguration();

        void setDownloadMode(int _mode);

        QString setGameConfiguration();

        void setSettings();



        /******************************************************************************/
        /*                                                                            */
        /*    Events                                                                  */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief Overwrite for the mousePressEvent to move the window
         * \param event Mouse event
         */
        void mousePressEvent(QMouseEvent *event);

        /**
         * \brief Overwrite for the mouseMoveEvent to move the window
         * \param event Mouse event
         */
        void mouseMoveEvent(QMouseEvent *event);

        /**
         * \brief Overwrite for the mouseReleaseEvent to move the window
         * \param event Mouse event
         */
        void mouseReleaseEvent(QMouseEvent *event);

    private slots:

        /**
         * \brief Display the news in the webview
         */
        void on_buttonNews_clicked();

        /**
         * \brief Open the forum in the default browser
         */
        void on_buttonForum_clicked();

        /**
         * \brief Get newst state about the torrent download
         */
        void slot_updateTorrentStatus();

        /**
         * \brief Get newst state about the http download
         */
        void slot_updateHttpStatus();

        /**
         * \brief Hide/Unhide the launcher
         * \param reason The activation reason
         */
        void slot_slotTrayActivated(QSystemTrayIcon::ActivationReason reason);

        /**
         * \brief Update state after checking in external class
         * \param updateStatus The update status returned
         * \param updateState The update state returned
         */
        void slot_updateDone(bool updateStatus, bool updateState);

        /**
         * \brief Minimize the main window
         */
        void on_buttonMinimize_clicked();

        /**
         * \brief Close the launcher
         */
        void on_buttonClose_clicked();

        /**
         * \brief Mute the launcher
         */
        void on_buttonMute_clicked();

        /**
         * \brief Start Relics of Annorath
         */
        void on_buttonPlay_clicked();

        /**
         * @brief Process error
         * @param _error The error
         */
        void slot_error(QProcess::ProcessError _error);

        /**
         * @brief Game process done
         */
        void slot_processClosed();
        void on_buttonHTTP_clicked();
        void on_buttonTorrent_clicked();
        void on_buttonLogin_clicked();
        void on_linePassword_returnPressed();
        void on_buttonTwitter_clicked();
        void on_buttonSettings_clicked();
        void on_buttonSave_clicked();
        void on_buttonCancel_clicked();
        void slot_requestProcessed(int _caller, int _action, int _returnCode, QString _data);
        void slot_updateToken();
        void on_buttonFAQ_clicked();
        void on_buttonAbout_clicked();
        void on_buttonFacebook_clicked();
        void on_buttonGoogle_clicked();
        void on_buttonYoutube_clicked();
};

#endif // MAINWINDOW_H
