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
 * \file    	customsound.h
 *
 * \note
 *
 * \version 	3.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2011/04/10 19:00:00 GMT+1
 *              2012/11/30 23:10:00 GMT+1
 *              2013/11/24 23:10:00 GMT+1
 *
 */

#ifndef CUSTOMSOUND_H
#define CUSTOMSOUND_H

/******************************************************************************/
/*                                                                            */
/*    C/C++ includes                                                          */
/*                                                                            */
/******************************************************************************/
#include <SFML/Audio.hpp>
#include <boost/current_function.hpp>

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QString>
#include <QMessageBox>
#include <QThread>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logging.h"

/**
 * @brief Class for sound playing
 */
class CustomSound : public QThread
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
         * @brief Constructor
         * @param _path Path to sound file
         */
        CustomSound();

        /**
         * @brief Deconstructor
         */
        ~CustomSound();

        /**
         * @brief Run thread
         */
        void run();

        /**
         * @brief Start playing
         */
        void play();

        /**
         * @brief Stop playing
         */
        void stop();

    private:
        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/
        /**
         * @brief Sound object
         */
        sf::Music sound;

        /**
         * @brief File for reading resources
         */
        QFile *file;

        /**
         * @brief Binray data for reading
         */
        QByteArray blob;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/
};

#endif // CUSTOMSOUND_H
