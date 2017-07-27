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
 * \file    	roapagecomponents.h
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

#ifndef ROAPAGECOMPONENTS_H
#define ROAPAGECOMPONENTS_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QWidget>
#include <QApplication>
#include <QDesktopWidget>

namespace Ui
{
    class ROAPageComponents;
}

/**
 * \brief The ROAPageComponents class for component selection
 */
class ROAPageComponents : public QWidget
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
        explicit ROAPageComponents(QWidget *parent = 0);

        /**
         * \brief Deconstructor
         */
        ~ROAPageComponents();

        /**
         * \brief Get the selected components for installation
         * \return List with components to install
         */
        QStringList getSelectedComponents();

        /**
         * @brief Retranslate the gui
         */
        void retranslate();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief The ui
         */
        Ui::ROAPageComponents *ui;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

};

#endif // ROAPAGECOMPONENTS_H
