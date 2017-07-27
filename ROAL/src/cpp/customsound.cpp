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
 * \brief       Plays sound in the launcher.
 *
 * \file    	customsound.cpp
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
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/customsound.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/


CustomSound::CustomSound()
{
    // Read from file
    file = new QFile(":/sounds/launcher_bgmusic.ogg");
    file->open(QIODevice::ReadOnly);

    // Get binary
    blob = file->readAll();

    // Check if sound source is accesible
    if(!sound.openFromMemory(blob.data(), blob.size()))
    {
        Logging::addEntry(LOG_LEVEL_INF, "Sound file couldn't be opened", FUNCTION_NAME);
        QMessageBox::information(NULL,"Can't open sound file","Sound file couldn't be opened");
    }

    // Loop and set volume
    sound.setLoop(1);
    sound.setVolume(75);
}

CustomSound::~CustomSound()
{
    Logging::addEntry(LOG_LEVEL_INF, "Delete CustomSound instance", FUNCTION_NAME);

    // Stop sound playing
    sound.stop();
    file->close();

    if(file != NULL){
        delete file;
    }
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void CustomSound::play()
{
    Logging::addEntry(LOG_LEVEL_INF, "Playing sound", FUNCTION_NAME);
    sound.play();
}

void CustomSound::stop()
{
    Logging::addEntry(LOG_LEVEL_INF, "Stopping sound", FUNCTION_NAME);
    sound.stop();
}

void CustomSound::run()
{
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Events                                                                  */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/
