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
 * \brief       The bit torrent protocol implemenation for downloading the needed application data.
 *
 * \file    	torrentclient.cpp
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
#include "../h/torrentclient.h"


// Set namespace to libtorrent
using namespace libtorrent;

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

TorrentClient::TorrentClient(Settings *_settings)
{  
    Logging::addEntry(LOG_LEVEL_INF, "Creating torrent client", FUNCTION_NAME);

    // Add settings
    settings = _settings;

    // Error code
    error_code ec;

    sesSettings.download_rate_limit = 0;
    sesSettings.upload_rate_limit = settings->getSetting("torULMax").toInt() * 1024;
    sesSettings.connections_limit = 250; // We let this hardcoded

    // Create session and set settings
    ses = new session();
    ses->set_settings(sesSettings);

    ses->listen_on(std::make_pair(settings->getSetting("torPort").toInt(), settings->getSetting("torPort").toInt() + 8 ), ec);

    // Check for error
    if (ec)
    {
        QMessageBox::critical(0, QObject::tr("Error on setting the port"), QString::fromStdString(ec.message()));
        Logging::addEntry(LOG_LEVEL_ERR, "Error on setting port: " + QString::fromStdString(ec.message()), FUNCTION_NAME);
    }

    /// \todo Add upnp and natpmp
    add_torrent_params p;

    // Get the path
    QString path = settings->getSetting("installLocation");

    // Set path
    p.save_path = path.toUtf8().constData();
    //path = path + "launcher/downloads/roa.torrent";

    // Set url
#ifdef BUILD_CUSTOM
    p.url = std::string(HTTP_URL_CONTENT_DATA) + "game_custom.torrent";
#else
    p.url = std::string(HTTP_URL_CONTENT_DATA) + "game.torrent";
#endif

    // Check for error
    if (ec)
    {
        QMessageBox::critical(0, QObject::tr("Error on preparing torrent"), QString::fromStdString(ec.message()));
        Logging::addEntry(LOG_LEVEL_ERR, "Torrent could not be created: " + QString::fromStdString(ec.message()), FUNCTION_NAME);
    }

    torrentHandler = ses->add_torrent(p, ec);

    // Check for errors
    if (ec)
    {
        QMessageBox::critical(0, QObject::tr("Error on adding torrent"), QString::fromStdString(ec.message()));
        Logging::addEntry(LOG_LEVEL_ERR, "Torrent could not be added: " + QString::fromStdString(ec.message()), FUNCTION_NAME);
    }

    torrentStatus = torrentHandler.status();
}

TorrentClient::~TorrentClient()
{
    Logging::addEntry(LOG_LEVEL_INF, "Deleting torrent client", FUNCTION_NAME);

    torrentHandler.save_resume_data();
    //ses.save_state();
    delete ses;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

int TorrentClient::getDownloadRate()
{
    updateStats();
    return torrentStatus.download_rate/1024;
}

int TorrentClient::getUploadRate()
{
    updateStats();
    return torrentStatus.upload_rate/1024;
}

int TorrentClient::getProgress()
{
    updateStats();

    int value = float(torrentStatus.total_wanted_done + 1) / float( torrentStatus.total_wanted ) * 100;

    return value;
}

void TorrentClient::toggleStatus()
{
    if(ses->is_paused())
    {
        Logging::addEntry(LOG_LEVEL_INF, "Resume torrent download", FUNCTION_NAME);
        ses->resume();
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "Pause torrent download", FUNCTION_NAME);
        ses->pause();
    }
}

void TorrentClient::applySettings()
{
    Logging::addEntry(LOG_LEVEL_INF, "Applying torrent settings", FUNCTION_NAME);

    // Error code
    error_code ec;

    session_settings sesSettingsTemp = ses->settings();

    sesSettingsTemp.upload_rate_limit = settings->getSetting("torULMax").toInt() * 1024;

    ses->listen_on(std::make_pair(settings->getSetting("torPort").toInt(), settings->getSetting("torPort").toInt() + 8 ), ec);

    // Check for error
    if (ec)
    {
        QMessageBox::critical(0, QObject::tr("Error on setting the port"), QString::fromStdString(ec.message()));
        Logging::addEntry(LOG_LEVEL_ERR, "Error on setting port: " + QString::fromStdString(ec.message()), FUNCTION_NAME);
    }

    ses->set_settings(sesSettingsTemp);
}

int TorrentClient::getSize()
{
    return torrentStatus.total_wanted / 1024 / 1024;
}

int TorrentClient::getSizeDownloaded()
{
    return torrentStatus.total_wanted_done / 1024 / 1024;
}

QString TorrentClient::getStatus()
{
    switch( torrentStatus.state )
    {
        case 0:
            return QObject::tr("Prepare");
        case 1:
            return QObject::tr("Checking files");
        case 2:
            return QObject::tr("Connecting");
        case 3:
            return QObject::tr("Downloading");
        case 4:
            return QObject::tr("Finished");
        case 5:
            return QObject::tr("Seeding");
        case 6:
            return QObject::tr("Allocating");
        case 7:
            return QObject::tr("Checking files");
        default:
            return QObject::tr("Bug found, please report!");
    }
}

int TorrentClient::getSeederCount()
{
    return torrentStatus.list_seeds;
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void TorrentClient::updateStats()
{
    status = ses->status();
    torrentStatus = torrentHandler.status();
}
