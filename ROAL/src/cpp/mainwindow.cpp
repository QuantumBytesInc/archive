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
 * \file    	mainwindow.cpp
 *
 * \note
 *
 * \version 	2.0
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
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/mainwindow.h"
#include "ui_mainwindow.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    Logging::addEntry(LOG_LEVEL_INF, "Creating main window", FUNCTION_NAME);

    ui->setupUi(this);

    torrent = NULL;
    httpManager = NULL;
    sound = NULL;
    jsonRequest = &JsonRequest::getInstance();

    // Center the widget
    this->setGeometry(QStyle::alignedRect(
                          Qt::LeftToRight,
                          Qt::AlignCenter,
                          this->size(),
                          qApp->desktop()->availableGeometry()
                          ));

    // Create the tray icon
    setupTray();

    // Translator
    translator = new QTranslator();

    // Set the current launcher version
    settings.setSetting("launcherVersion", QCoreApplication::applicationVersion());

    // Get path and split it to remove /launcher
    QString tmpPath = QApplication::applicationDirPath().replace('\\','/');

    QStringList realPathList = tmpPath.split("/");
    tmpPath = "";

#ifdef Q_OS_LINUX
    Logging::addEntry(LOG_LEVEL_INF, "Linux found", FUNCTION_NAME);
#ifdef DISTRO_BUILD
    tmpPath = QDir::homePath() + QString("/.local/share/roa/");
#else
    for(int i = 0; i < realPathList.size() - 2; i++)
    {
        tmpPath += realPathList.at(i) + "/";
    }

    if(!tmpPath.endsWith("/"))
    {
        tmpPath += "/";
    }
#endif
#else
    Logging::addEntry(LOG_LEVEL_INF, "Windows found", FUNCTION_NAME);

    for(int i = 0; i < realPathList.size() - 1; i++)
    {
        tmpPath += realPathList.at(i) + "/";
    }

    if(!tmpPath.endsWith("/"))
    {
        tmpPath += "/";
    }
#endif

    // Check language
    if(settings.getSetting("language") == "not_found")
    {
        Logging::addEntry(LOG_LEVEL_INF, "Language not found in settings, setting default to english", FUNCTION_NAME);
        settings.setSetting("language", "english");
    }

    Logging::addEntry(LOG_LEVEL_INF, "Set install location to " + tmpPath, FUNCTION_NAME);

    // Setting install loction
    settings.setSetting("installLocation", tmpPath);

    //Create all dirs, maybe one is missing
    QStringList dirs;
    dirs << tmpPath + "game"
         << tmpPath + "game/bin"
         << tmpPath + "game/data"
         << tmpPath + "game/lib"
         << tmpPath + "game/lib/host"
         << tmpPath + "game/data/logs"
         << tmpPath + "game/data/relics_of_annorath"
         << tmpPath + "game/data/configuration"
         << tmpPath + "launcher"
         << tmpPath + "launcher/downloads"
         << tmpPath + "launcher/sounds";

    // Create missing dirs
    for(int i = 0; i < dirs.size(); i++)
    {
        QDir dir(dirs.at(i));
        if(!dir.exists())
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Missing directory, creating: " + dirs.at(i), FUNCTION_NAME);
            QDir().mkpath(dirs.at(i));
        }
    }

    // Check if extraction failed
    //if(settings.getSetting("extracted") == "not_found" || settings.getSetting("extracted") == "false")
    //{
    //        QFile::remove(tmpPath + "game/data.tar.xz");
    //}

    // Remove window borders
    setWindowFlags(Qt::FramelessWindowHint);
    setAttribute(Qt::WA_TranslucentBackground, true);

    // Set window state as not moving
    moving = false;
    setMouseTracking(false);

    // Torrent is not done yet
    torrentDone = 0;

    // Hide the game start button
    this->ui->buttonPlay->setText(tr("Wait..."));
    this->ui->buttonPlay->setEnabled(0);

    // Style progressbar
    this->ui->progressBar->setStyleSheet("QProgressBar {"
                                         "  color: rgb(255, 199, 72);"
                                         "  border: 0px solid;"
                                         "  background-color: rgba(255, 255, 127, 40);"
                                         "  background-image: url(:);"
                                         "  font-family: \"Ubuntu\";"
                                         "  font-size: 14px;"
                                         "}"
                                         "QProgressBar::chunk {"
                                         "  color: rgb(255, 199, 72);"
                                         "background-color: rgba(42, 85, 0, 90);"
                                         "  width: 20px;"
                                         "  background-image: url(:);"
                                         "  font-family: \"Ubuntu\";"
                                         "  font-size: 14px;"
                                         "}");

    ui->comboLanguage->setStyleSheet("QComboBox {"
                                     " background-color: rgb(255, 255, 255, 200);"
                                     " border-width:1px;"
                                     " border-style:solid;"
                                     " border-radius:4px;"
                                     "  font-family: \"Ubuntu\";"
                                     "  font-size: 14px;"
                                     "}"
                                     "QComboBox:!editable:on, QComboBox::drop-down:editable:on, QComboBox:!editable:off, QComboBox::drop-down:editable:off, QAbstractItemView {"
                                     " background-color: rgba(255, 204, 0, 80);"
                                     " color: #000000;"
                                     " border-width:1px;"
                                     " border-style:solid;"
                                     " border-radius:4px;"
                                     "  font-family: \"Ubuntu\";"
                                     "  font-size: 14px;"
                                     "}");

    // Add languages
    ui->comboLanguage->addItem( "English", "english" );

    // Set links to open in external browser
    ui->textLogin->setOpenExternalLinks(true);

    // Hide widgets
    ui->widgetContent->raise();
    ui->widgetDownload->raise();
    ui->widgetFirstRun->raise();
    ui->widgetLogin->raise();
    ui->widgetSettings->raise();
    ui->widgetLinks->raise();

    // Set content
    ui->widgetContent->show();
    currentWidget = ui->widgetContent;

    // Hide the rest
    ui->widgetDownload->hide();
    ui->widgetFirstRun->hide();
    ui->widgetLogin->hide();
    ui->widgetSettings->hide();
    ui->progressBar->hide();

    // Set sound
    sound = new CustomSound();

    // Retranslate to the new language
    retranslate();

    // Start
    configurePath();

    //ConfigFile settings
    cfg = &ConfigFile::getInstance();
    cfg->setFileName(tmpPath + "param.tmp");

    Logging::addEntry(LOG_LEVEL_INF, "MainWindow created", FUNCTION_NAME);
}

MainWindow::~MainWindow()
{
    Logging::addEntry(LOG_LEVEL_INF, "Deconstructor called", FUNCTION_NAME);

    if(torrent != NULL)
    {
        delete torrent;
    }

    if(mTray != NULL)
    {
        mTray->hide();
        delete mTray;
    }

    if(ui != NULL)
    {
        delete ui;
    }

    if(sound != NULL)
    {
        //delete sound; //This will crash everything
    }
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void MainWindow::configurePath()
{
    Logging::addEntry(LOG_LEVEL_INF, "Configuring path", FUNCTION_NAME);

    // Prepare http updater
    httpUpdater = new HttpUpdate(&settings);

    // Show the progress window
    httpUpdater->show();

    connect(httpUpdater, SIGNAL(updateChecked(bool, bool)), this, SLOT(slot_updateDone(bool, bool)));
}

void MainWindow::setupTray()
{
    Logging::addEntry(LOG_LEVEL_INF, "Preparing tray", FUNCTION_NAME);

    // Creat the tray object
    mTray = new QSystemTrayIcon();

    // Set the icon
    mTray->setIcon( QIcon(":/images/icon.png"));

    // Connect the actions
    minimizeAction = new QAction(tr("Restore"), this);
    connect(minimizeAction, SIGNAL(triggered()), this, SLOT(on_buttonMinimize_clicked()));

    quitAction = new QAction(tr("Quit"), this);
    connect(quitAction, SIGNAL(triggered()), this, SLOT(on_buttonClose_clicked()));

    // Add the menu
    trayMenu = new QMenu();
    trayMenu->addAction(minimizeAction);
    trayMenu->addAction(quitAction);

    // Set the menu
    mTray->setContextMenu(trayMenu);

    connect(mTray, SIGNAL(activated(QSystemTrayIcon::ActivationReason)), this, SLOT(slot_slotTrayActivated(QSystemTrayIcon::ActivationReason)));

    mTray->show();
}

void MainWindow::toggleVisibility()
{
    Logging::addEntry(LOG_LEVEL_INF, "Toggle window state", FUNCTION_NAME);

    // Check if main window is hidden
    if(isHidden())
    {
        Logging::addEntry(LOG_LEVEL_INF, "Show MainWindow", FUNCTION_NAME);

        // Show it
        show();

        // Check window state
        if(isMinimized())
        {
            if(isMaximized())
                showMaximized();
            else
                showNormal();
        }

        // Raise and activate it
        raise();
        activateWindow();

        // Unmute it
        if(!muted)
            sound->play();
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "Hide MainWindow", FUNCTION_NAME);

        // Hide everything and stop sound
        hide();

        // Mute it
        if(!muted)
            sound->stop();
    }
}

void MainWindow::retranslate()
{
    Logging::addEntry(LOG_LEVEL_INF, "Retranslate window", FUNCTION_NAME);

    // Retranslate the whole ui while language changed
    QApplication::removeTranslator(translator);

    // Get current language
    QString language = settings.getSetting("language");

    // Load translator
    translator->load(":/translations/roal_" + language);

    // Install translator
    QApplication::installTranslator(translator);

    // Retranslate gui
    ui->retranslateUi(this);

    /// \todo Check this
    this->setEnabled(true);
}

void MainWindow::startLauncher()
{
    // Check if we use http or bt
    if(QString(settings.getSetting("useTorrent")) == "false")
    {
        Logging::addEntry(LOG_LEVEL_INF, "Using HTTP", FUNCTION_NAME);

        httpManager = new HttpDownload(QString(settings.getSetting(QString("installLocation"))));

        // Time for http status updating
        connect(&timer, SIGNAL(timeout()), this , SLOT(slot_updateHttpStatus()));
        timer.start(100);
        slot_updateHttpStatus();
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "Using BT", FUNCTION_NAME);

        // Start the torrent
        torrent = new TorrentClient(&settings);

        // Time for torrent status updating
        connect(&timer, SIGNAL(timeout()), this , SLOT(slot_updateTorrentStatus()));
        timer.start(100);
    }

    // We need to update the token all 5 minutes
    timerUpdateToken = new QTimer(this);
    connect(timerUpdateToken, SIGNAL(timeout()), this, SLOT(slot_updateToken()));
    timerUpdateToken->start(60000);

}

void MainWindow::setDownloadMode(int _mode)
{
    Logging::addEntry(LOG_LEVEL_INF, "Setting download mode" , FUNCTION_NAME);

    // Set firstrun to true
    settings.setSetting("firstRun", "true");

    if(!_mode)
    {
        settings.setSetting("useTorrent", "true");
    }
    else
    {
        settings.setSetting("useTorrent", "false");
    }

    ui->widgetFirstRun->hide();
    ui->labelTitle->setText(tr("Login"));
    ui->widgetLogin->show();

    currentWidget = ui->widgetLogin;
    currentTitle = ui->labelTitle->text();

    startLauncher();
}

void MainWindow::setSettings()
{
    // Muted state
    if(settings.getSetting("launcherMuted") == "true")
    {
        Logging::addEntry(LOG_LEVEL_INF, "Setting launcher muted", FUNCTION_NAME);
        muted = true;
        this->ui->buttonMute->setStyleSheet("background-image: url(:/images/mute1.png);");
    }
    else
    {
        muted = false;
        this->ui->buttonMute->setStyleSheet("background-image: url(:/images/mute0.png);");
    }

    // Download method
    if(QString(settings.getSetting("useTorrent")) == "true")
    {
        ui->checkUseTorrent->setChecked(true);
    }
    else
    {
        ui->checkUseTorrent->setChecked(false);
    }

    // Username
    if(settings.getSetting("userName") != "not_found")
    {
        ui->lineUsername->setText(settings.getSetting("userName"));
    }

    // The rest
    ui->lineTorrentPort->setText(settings.getSetting("torPort"));
    ui->lineTorrentSpeed->setText(settings.getSetting("torULMax"));
    ui->comboLanguage->setCurrentIndex(ui->comboLanguage->findData(settings.getSetting(QString("language"))));
}

/******************************************************************************/
/*                                                                            */
/*    Events                                                                  */
/*                                                                            */
/******************************************************************************/

void MainWindow::mousePressEvent(QMouseEvent *event)
{
    // We move the window with the left button
    QMainWindow::mousePressEvent(event);
    if((event->button() == Qt::LeftButton)) {
        moving = true;
        offset = event->pos();
    }
}

void MainWindow::mouseMoveEvent(QMouseEvent *event)
{
    // The move event while mouse is pressed
    QMainWindow::mouseMoveEvent(event);
    if(moving)
        this->move(event->globalPos() - offset);
}

void MainWindow::mouseReleaseEvent(QMouseEvent *event)
{
    // The release event
    QMainWindow::mouseReleaseEvent(event);
    if(event->button() == Qt::LeftButton) {
        moving = false;
    }
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void MainWindow::slot_updateDone(bool updateStatus, bool updateState)
{
    // Check if update was successfully
    if(updateStatus)
    {
        // Set gui settings
        setSettings();

        // Show launcher window
        this->show();

        if(!muted)
        {
            // Play sound
            sound->play();
            sound->start();
        }

        if(QString(settings.getSetting("firstRun")) == "true")
        {
            Logging::addEntry(LOG_LEVEL_INF, "Launcher already configured" , FUNCTION_NAME);

            // Show login widget
            ui->labelTitle->setText(tr("Login"));
            ui->widgetLogin->show();
            currentWidget = ui->widgetLogin;
            currentTitle = ui->labelTitle->text();
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_INF, "First run of launcher detected" , FUNCTION_NAME);
            ui->labelTitle->setText(tr("First Run"));
            ui->widgetFirstRun->show();
            currentWidget = ui->widgetFirstRun;
            currentTitle = ui->labelTitle->text();
        }
        // Connect network
        connect(jsonRequest, SIGNAL(responseReceived(int, int, int, QString)), this, SLOT(slot_requestProcessed(int, int, int, QString)));
    }
    else
    {
        if(updateState)
        {
            // Close the appliaction for launcher update
            Logging::addEntry(LOG_LEVEL_INF, "Starting update" , FUNCTION_NAME);

            QApplication::quit();
        }
        else
        {
            //Display an error
            Logging::addEntry(LOG_LEVEL_ERR, "There was an update error, please restart the launcher" , FUNCTION_NAME);

            QMessageBox::warning(NULL,tr("Update error"), tr("There was an update error, please restart the launcher!"));
            QApplication::quit();
        }
    }

    httpUpdater->hide();
    delete httpUpdater;
}

void MainWindow::slot_updateHttpStatus()
{
    // Set http values in the gui
    ui->progressBar->setValue(httpManager->progress());

    // Check http status and decide what to display
    if(httpManager->getStatus() == "checking")
    {
        this->ui->progressBar->setFormat(QString(tr("Checking files, please be patient...")));
        this->ui->buttonPlay->setText(tr("Wait..."));
        ui->buttonSettings->setHidden(true);
    }
    else if(httpManager->getStatus() == "downloading")
    {
        // Calculate the hours and minutes
        int hours = (httpManager->getFullDownloadSize() - httpManager->getCurrentDownloadSize() ) * 1024 / (httpManager->networkSpeed() + 1) / 60 / 60;
        int minutes = ((httpManager->getFullDownloadSize() - httpManager->getCurrentDownloadSize() ) * 1024 / (httpManager->networkSpeed() + 1)) / 60 - (hours * 60);

        if(hours >= 1)
        {
            this->ui->progressBar->setFormat(QString(tr("Progress: %p% done") + tr(" - Files left: ") + QString::number(httpManager->getFilesLeft())));
        }
        else if ( minutes >= 1)
        {
            this->ui->progressBar->setFormat(QString(tr("Progress: %p% done") + tr(" - Files left: ") + QString::number(httpManager->getFilesLeft())));
        }
        else
        {
            this->ui->progressBar->setFormat(QString(tr("Progress: %p% done") + tr(" - Files left: ") + QString::number(httpManager->getFilesLeft())));
        }

        this->ui->buttonPlay->setText(tr("Wait..."));
        ui->buttonSettings->setHidden(false);
    }
    else if(httpManager->getStatus() == "extracting")
    {
        this->ui->progressBar->setFormat(QString(tr("Progress: %p% done - Extracting") + tr(" - Files left: ") + QString::number(httpManager->getFilesLeft())));
        this->ui->buttonPlay->setText(tr("Wait..."));
        ui->buttonSettings->setHidden(false);
    }
    else if(httpManager->getStatus() == "done")
    {
        // We are done, so check if extraction was successfully
        // It not, we already informed the user about this
        if(httpManager->getExtractionState())
        {
            // Set extraction to True
            settings.setSetting("extracted", "true");
        }

        this->ui->progressBar->setFormat(QString(tr("Progress: %p% done")));
        this->ui->buttonPlay->setText(tr("PLAY"));
        this->ui->buttonPlay->setEnabled(1);
        ui->buttonSettings->setHidden(false);
    }

    //ui->labelStatus->setText(tr("Downloading") );
}

void MainWindow::slot_updateTorrentStatus()
{
    // Set torrent values in the gui
    ui->progressBar->setValue(torrent->getProgress());

    // Check torrent status and decide what to display
    if(torrent->getStatus() == "Prepare" || torrent->getStatus() == "Checking files" || torrent->getStatus() == "Connecting" || torrent->getStatus() == "Allocating")
    {
        this->ui->progressBar->setFormat(QString(tr("Progress: %p% done - Preparing")));
    }
    else
    {
        // Calculate the hours and minutes
        int hours = (torrent->getSize() - torrent->getSizeDownloaded() ) * 1024 / (torrent->getDownloadRate() + 1) / 60 / 60;
        int minutes = ((torrent->getSize() - torrent->getSizeDownloaded() ) * 1024 / (torrent->getDownloadRate() + 1)) / 60 - (hours * 60);

        // Decide what to display
        if(hours >= 10)
        {
            this->ui->progressBar->setFormat(QString(tr("%p% - Calculating")));
        }
        else if(hours >= 1)
        {
            this->ui->progressBar->setFormat(QString(tr("%p% - ETA: ") + QString::number(hours) +
                                                     tr(" h and ") + QString::number(minutes) +
                                                     tr(" m - ") + QString::number(torrent->getDownloadRate()) + tr(" kB/s") +
                                                     tr(" - seeders: ") + QString::number(torrent->getSeederCount())));
        }
        else if ( minutes >= 1)
        {
            this->ui->progressBar->setFormat(QString(tr("%p% - ETA: ") + QString::number(minutes) +
                                                     tr(" minutes - ") + QString::number(torrent->getDownloadRate()) + tr(" kB/s") +
                                                     tr(" - seeders: ") + QString::number(torrent->getSeederCount())));
        }
        else if ( torrent->getProgress() == 100 )
        {
            this->ui->progressBar->setFormat(QString(tr("%p% ")));

            this->ui->buttonPlay->setText(tr("PLAY"));
            this->ui->buttonPlay->setEnabled(1);

            // While we are seeding the text is a bit different
            if(!torrentDone)
            {
                torrentDone = 1;
            }

            // Set binaries to executable in linux
#ifdef Q_OS_LINUX
            QFile::setPermissions(settings.getSetting("installLocation") + "game/bin/roa_x64",QFile::ExeUser | QFile::ExeGroup | QFile::ExeOwner | QFile::WriteUser | QFile::WriteGroup | QFile::WriteOwner | QFile::ReadGroup | QFile::ReadOwner | QFile::ReadUser);
            QFile::setPermissions(settings.getSetting("installLocation") + "game/lib/host/CoherentUI_Host",QFile::ExeUser | QFile::ExeGroup | QFile::ExeOwner | QFile::WriteUser | QFile::WriteGroup | QFile::WriteOwner | QFile::ReadGroup | QFile::ReadOwner | QFile::ReadUser);
            QFile::setPermissions(settings.getSetting("installLocation") + "game/lib/host/CoherentUI_Host.bin",QFile::ExeUser | QFile::ExeGroup | QFile::ExeOwner | QFile::WriteUser | QFile::WriteGroup | QFile::WriteOwner | QFile::ReadGroup | QFile::ReadOwner | QFile::ReadUser);
#endif
        }
        else
        {
            this->ui->progressBar->setFormat(QString(tr("Progress: %p% done - ETA: ") + tr("Some seconds left...")));
        }
    }
}

void MainWindow::on_buttonForum_clicked()
{
    QDesktopServices::openUrl(QUrl("https://forum.annorath-game.com/"));
}

void MainWindow::on_buttonNews_clicked()
{
    QDesktopServices::openUrl(QUrl("https://portal.annorath-game.com/#!news"));
}

void MainWindow::slot_slotTrayActivated(QSystemTrayIcon::ActivationReason reason)
{
    // Toggle the tray icon
    if (reason == QSystemTrayIcon::Trigger)
        toggleVisibility();
}

void MainWindow::on_buttonMinimize_clicked()
{
    // We send the window to tray when minimized
    toggleVisibility();
}

void MainWindow::on_buttonClose_clicked()
{
    // Quit the application
    QApplication::exit();
}

void MainWindow::on_buttonMute_clicked()
{
    Logging::addEntry(LOG_LEVEL_INF, "Toggle muted mode" , FUNCTION_NAME);

    switch(muted)
    {
        case true:
            sound->play();
            muted = false;
            this->ui->buttonMute->setStyleSheet("background-image: url(:/images/mute0.png);");
            settings.setSetting("launcherMuted", "false");
            break;
        case false:
            sound->stop();
            muted = true;
            this->ui->buttonMute->setStyleSheet("background-image: url(:/images/mute1.png);");
            settings.setSetting("launcherMuted", "true");
            break;
    }
}

void MainWindow::on_buttonPlay_clicked()
{
    //set UserToken to ConfigFile
    cfg->setToken(userToken);

    Logging::addEntry(LOG_LEVEL_INF, "Starting game process", FUNCTION_NAME);

    // Disconnect
    timerUpdateToken->stop();

    // Create process
    gameProcess = new Game();

    // Set arguments
    gameProcess->setProcessEnv(settings.getSetting(QString("installLocation")), "param.tmp");

    // Connect process
    connect(gameProcess, SIGNAL(finished()),SLOT(slot_processClosed()));

    //Writing JSON ConfigFile
    cfg->writeToFile();

    // Start game
    gameProcess->start();

    // Hide and mute launcher
    toggleVisibility();
}

void MainWindow::slot_error(QProcess::ProcessError _error)
{
    if(_error == QProcess::FailedToStart)
    {
        QMessageBox::warning(this,"","Start failed");
    }
    if(_error == QProcess::Crashed)
    {
        QMessageBox::warning(this,"","crashed failed");
    }
    if(_error == QProcess::Timedout)
    {
        QMessageBox::warning(this,"","time failed");
    }
    if(_error == QProcess::WriteError)
    {
        QMessageBox::warning(this,"","wr failed");
    }
    if(_error == QProcess::ReadError)
    {
        QMessageBox::warning(this,"","re failed");
    }
    if(_error == QProcess::UnknownError)
    {
        QMessageBox::warning(this,"","un failed");
    }
}

void MainWindow::slot_processClosed()
{
    delete gameProcess;
    toggleVisibility();
    slot_updateToken();
    timerUpdateToken->start();
}

void MainWindow::on_buttonHTTP_clicked()
{
    setDownloadMode(1);
}

void MainWindow::on_buttonTorrent_clicked()
{
    setDownloadMode(0);
}

void MainWindow::on_buttonLogin_clicked()
{
    Logging::addEntry(LOG_LEVEL_INF, "Login triggered", FUNCTION_NAME);

    if(!ui->lineUsername->text().isEmpty() && !ui->linePassword->text().isEmpty())
    {
        Logging::addEntry(LOG_LEVEL_INF, "Credentials provided", FUNCTION_NAME);

        // Save username
        settings.setSetting("userName", ui->lineUsername->text());

        ui->buttonLogin->setText(tr("Pending..."));
        ui->buttonLogin->setEnabled(false);

        // Register interface on backend
        jsonRequest->setRequestData(QString("{\"CALLER\":" + QString::number(GUI::Caller::AUTHENTICATION) + "," +
                                           "\"ACTION\":" + QString::number(GUI::Action::AUTHENTICATION_LOGIN) + "," +
                                           "\"DATA\":{\"USERNAME\":\"" + ui->lineUsername->text() + "\"," +
                                           "\"PASSWORD\":\"" + ui->linePassword->text() + "\"}}"));
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "No credentials found", FUNCTION_NAME);
    }
}

void MainWindow::slot_requestProcessed(int _caller, int _action, int _returnCode, QString _data)
{
    Logging::addEntry(LOG_LEVEL_INF, "Get request response", FUNCTION_NAME);

    if((_caller = GUI::Caller::AUTHENTICATION && _action == GUI::Action::AUTHENTICATION_LOGIN))
    {
        if(_returnCode == GUI::Results::AUTHENTICATION_LOGIN_SUCCESSFULLY)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Login credentials successfully validated: " + _data, FUNCTION_NAME);

            // Show next widet
            ui->widgetLogin->hide();
            ui->widgetDownload->show();
            ui->progressBar->show();

            ui->labelTitle->setText(("Information"));
            currentWidget = ui->widgetDownload;
            currentTitle = ui->labelTitle->text();

            // Remove password from memory
            ui->linePassword->setText("");

            // Set token
            userToken = _data;

            jsonRequest->setRequestData(QString("{\"CALLER\":" + QString::number(GUI::Caller::ACCOUNT) + "," +
                                               "\"ACTION\":" + QString::number(GUI::Action::ACCOUNT_SETTINGS_GET) + "," +
                                               "\"DATA\":{\"TINY\":true}}"));

            startLauncher();
        }
        else if(_returnCode == GUI::Results::AUTHENTICATION_LOGIN_FAILED_WRONG_USER_OR_PASSWORD)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Invalid login credentials found", FUNCTION_NAME);

            // Invalid login data
            ui->textError->setText(tr("Wrong username or password!"));
            ui->buttonLogin->setText(tr("Login"));
            ui->buttonLogin->setEnabled(true);
            ui->linePassword->setText("");
        }
        else if(_returnCode == GUI::Results::AUTHENTICATION_LOGIN_FAILED_BRUTE_FORCE_ATTEMPT)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Account is locked", FUNCTION_NAME);

            // Invalid login data
            ui->textError->setText(tr("Account is locked, please recover your password!"));
            ui->buttonLogin->setText(tr("Login"));
            ui->buttonLogin->setEnabled(true);
        }
        else if(_returnCode == GUI::Results::AUTHENTICATION_LOGIN_FAILED_USER_NOT_ACTIVE)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Account is not active", FUNCTION_NAME);

            // Invalid login data
            ui->textError->setText(tr("Account is not active!"));
            ui->buttonLogin->setText(tr("Login"));
            ui->buttonLogin->setEnabled(true);
        }
        else if(_returnCode == GUI::Results::AUTHENTICATION_LOGIN_FAILED_MAINTENANCE ||
                _returnCode == GUI::Results::AUTHENTICATION_LOGIN_FAILED_SERVER_DOWN)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Server down / Maintenace", FUNCTION_NAME);

            // Invalid login data
            ui->textError->setText(tr("Server down or maintance!"));
            ui->buttonLogin->setText(tr("Login"));
            ui->buttonLogin->setEnabled(true);
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_INF, "Technical problem", FUNCTION_NAME);

            // Invalid login data
            ui->textError->setText(tr("Techical problem, please contact support!"));
            ui->buttonLogin->setText(tr("Login"));
            ui->buttonLogin->setEnabled(true);
        }
    }
    else if((_caller = GUI::Caller::AUTHENTICATION && _action == GUI::Action::AUTHENTICATION_TOKEN_REFRESH))
    {
        Logging::addEntry(LOG_LEVEL_INF, "New token refresh response received", FUNCTION_NAME);

        if(_returnCode == GUI::Results::AUTHENTICATION_TOKEN_REFRESH_SUCCESSFULLY)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Recevied new token successfully: " + _data, FUNCTION_NAME);

            userToken = _data;
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Token update error", FUNCTION_NAME);
            QMessageBox::warning(this, tr("Token error"), tr("There was a token error, please contact the support!"));
        }
    }
    else if((_caller = GUI::Caller::ACCOUNT && _action == GUI::Action::ACCOUNT_SETTINGS_GET))
    {
        Logging::addEntry(LOG_LEVEL_INF, "Settings were received", FUNCTION_NAME);

        if(_returnCode == GUI::Results::AUTHENTICATION_TOKEN_REFRESH_SUCCESSFULLY)
        {
            Logging::addEntry(LOG_LEVEL_INF, "Settings were received successfully", FUNCTION_NAME);
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Settings get error", FUNCTION_NAME);
            QMessageBox::warning(this, tr("Settings error"), tr("There was a setting error, please contact the support!"));
        }
    }
}

void MainWindow::on_linePassword_returnPressed()
{
    on_buttonLogin_clicked();
}

void MainWindow::on_buttonTwitter_clicked()
{
    QDesktopServices::openUrl(QString("https://twitter.com/AnnorathGame"));
}

void MainWindow::on_buttonSettings_clicked()
{
    // Hide current widget
    currentWidget->hide();

    // Show settings
    ui->labelTitle->setText(tr("Settings"));
    ui->widgetSettings->show();

    setSettings();
}

void MainWindow::on_buttonSave_clicked()
{
    // Save settings
    if(ui->lineTorrentPort->text().toInt() > 65535 || ui->lineTorrentPort->text().toInt() < 1500)
    {
        QMessageBox::warning(this, tr("Wrong port number"), tr("Port must be between 1500 and 65534! Port was not saved."));
    }
    else
    {
        settings.setSetting("torPort", ui->lineTorrentPort->text());
    }

    if(ui->lineTorrentSpeed->text().toInt() < 0)
    {
        QMessageBox::warning(this, tr("Wrong upload speed"), tr("Only positiv numbers allowed! Upload speed not saved."));
    }
    else
    {
        settings.setSetting("torULMax", ui->lineTorrentSpeed->text());
    }

    settings.setSetting("language", ui->comboLanguage->itemData(ui->comboLanguage->currentIndex()).toString());

    // Fuck name for it, but yeah to late to change... So we have to think reversed...
    QString oldValue = settings.getSetting("useTorrent");

    if(ui->checkUseTorrent->isChecked())
    {
        settings.setSetting("useTorrent", "true");
    }
    else
    {
        settings.setSetting("useTorrent", "false");
    }

    if(oldValue != settings.getSetting("useTorrent"))
    {
        // Disconnect signal
        timer.disconnect();

        if(!ui->checkUseTorrent->isChecked() && torrent != NULL)
        {
            // Cleanup old download method
            delete torrent;
            torrent = NULL;

            // Add new download method
            httpManager = new HttpDownload(QString(settings.getSetting(QString("installLocation"))));
            connect(&timer, SIGNAL(timeout()), this , SLOT(slot_updateHttpStatus()));
                    timer.start(100);
                    slot_updateHttpStatus();
        }
        else if(ui->checkUseTorrent->isChecked() && httpManager != NULL)
        {
            // Cleanup old download method
            delete httpManager;
            httpManager = NULL;

            // Add new download method
            torrent = new TorrentClient(&settings);
            connect(&timer, SIGNAL(timeout()), this , SLOT(slot_updateTorrentStatus()));
        }

        // If torrent is not null, apply changes
        if(torrent != NULL)
        {
            torrent->applySettings();
        }
    }

    // Hide widget
    ui->widgetSettings->hide();

    // Retranslate
    retranslate();

    // Restore current widget
    currentWidget->show();
    ui->labelTitle->setText(currentTitle);

    // Set gui settings
    setSettings();
}

void MainWindow::on_buttonCancel_clicked()
{
    // Hide widget
    ui->widgetSettings->hide();

    // Restore current widget
    currentWidget->show();
    ui->labelTitle->setText(currentTitle);
}

void MainWindow::slot_updateToken()
{
    Logging::addEntry(LOG_LEVEL_INF, "Requesting new token", FUNCTION_NAME);

    jsonRequest->setRequestData(QString("{\"CALLER\":" + QString::number(GUI::Caller::AUTHENTICATION) + "," +
                                       "\"ACTION\":" + QString::number(GUI::Action::AUTHENTICATION_TOKEN_REFRESH) + "," +
                                       "\"DATA\":{}}"));

}

void MainWindow::on_buttonFAQ_clicked()
{
    QDesktopServices::openUrl(QString("https://portal.annorath-game.com/#!faq"));
}

void MainWindow::on_buttonAbout_clicked()
{
    QDesktopServices::openUrl(QString("https://portal.annorath-game.com/#!faq.var.26"));
}

void MainWindow::on_buttonFacebook_clicked()
{
    QDesktopServices::openUrl(QString("https://www.facebook.com/annorath"));
}

void MainWindow::on_buttonGoogle_clicked()
{
    QDesktopServices::openUrl(QString("https://plus.google.com/+Annorath-Game/posts"));
}

void MainWindow::on_buttonYoutube_clicked()
{
    QDesktopServices::openUrl(QString("https://www.youtube.com/user/RelicsOfAnnorath"));
}
