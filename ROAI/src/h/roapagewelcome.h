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
 * \file    	roapagewelcome.h
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

#ifndef ROAPAGEWELCOME_H
#define ROAPAGEWELCOME_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QWidget>
#include <QTranslator>
#include <QApplication>
#include <QDesktopWidget>

namespace Ui
{
    class ROAPageWelcome;
}

/**
 * \brief The ROAPageWelcome class to show the welcome page
 */
class ROAPageWelcome : public QWidget
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
         * \brief Constuctor
         * \param The parent
         */
        explicit ROAPageWelcome(QWidget *parent = 0);

        /**
         * \brief Deconstructor
         */
        ~ROAPageWelcome();

        /**
         * @brief Get language
         * @return The language as string
         */
        QString getLanguage();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief The ui
         */
        Ui::ROAPageWelcome *ui;

        /**
         * \brief The translator
         */
        QTranslator *translator;

        /**
         * @brief Language
         */
        QString language;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/
        void changeEvent(QEvent*);

    private slots:

        /**
         * \brief Changes the language to the selected one
         * \param _index The language index
         */
        void on_qcLanguage_currentIndexChanged(int _index);

    signals:

        /**
         * @brief Signal when laguage was changed
         */
        void signal_languageChanged();
};

#endif // ROAPAGEWELCOME_H
