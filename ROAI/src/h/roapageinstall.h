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
 * \file    	roapageinstall.h
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

#ifndef ROAPAGEINSTALL_H
#define ROAPAGEINSTALL_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QWidget>
#include <QFileDialog>
#include <QApplication>
#include <QDesktopWidget>

namespace Ui
{
    class ROAPageInstall;
}

/**
 * \brief The ROAPageInstall class for selection the installation path
 */
class ROAPageInstall : public QWidget
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
        explicit ROAPageInstall(QWidget *parent = 0, QString _path = "none");

        /**
         * \brief Deconstructor
         */
        ~ROAPageInstall();

        /**
         * \brief Provides the installation path selected by the user
         * \return The installation path
         */
        QString getInstallPath();

        /**
         * @brief Retranslate the GUI
         */
        void retranslate();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/
        Ui::ROAPageInstall *ui;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

    private slots:

        /**
         * \brief Shows the select path dialog for installation path
         */
        void on_qbBrowse_clicked();

};

#endif // ROAPAGEINSTALL_H
