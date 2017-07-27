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
 * \brief       Handels the gui for displaying
 *
 * \file    	roamainwidget.h
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

#ifndef ROAMAINWIDGET_H
#define ROAMAINWIDGET_H

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QWidget>
#include <QMouseEvent>
#include <QMainWindow>
#include <QProcess>
#include <QMessageBox>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/roapagecomponents.h"
#include "../h/roapagefinish.h"
#include "../h/roapageinstall.h"
#include "../h/roapagelicense.h"
#include "../h/roapagestatus.h"
#include "../h/roapagewelcome.h"

#ifdef Q_OS_WIN
#include "../h/windowsprocess.h"
#endif

namespace Ui {
    class RoaMainWidget;
}

/**
 * \brief The RoaMainWidget class for the gui handling
 */
class RoaMainWidget : public QWidget
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
        explicit RoaMainWidget(QString _path, QWidget *parent = 0);

        /**
         * \brief Deconstructor
         */
        ~RoaMainWidget();

        /**
         * \brief Get the installation path where all files are located
         * \return The installation path ending wish "/"
         */
        QString getInstallPath();

        /**
         * \brief Get the selected components selected during installation
         * \return List with the selected components
         */
        QStringList getSelectedComponents();

        /**
         * \brief Set stauts on status page
         * \param _status The status code
         */
        void setNewStatus(int _status);

        /**
         * \brief Set new label text for status
         * \param _text The status text
         */
        void setNewLabelText(QString _text);

        /**
         * \brief Set custom page with id
         * \param _id The id of the page to display
         */
        void setCustomContentId(int _id);

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

#ifdef Q_OS_WIN
        /**
         * @brief Windows process
         */
        WindowsProcess *process;
#endif

        /**
         * \brief The ui element
         */
        Ui::RoaMainWidget *ui;

        /**
         * \brief Welcome page
         */
        ROAPageWelcome *welcome;

        /**
         * \brief License page
         */
        ROAPageLicense *license;

        /**
         * \brief Components page
         */
        ROAPageComponents *components;

        /**
         * \brief Install page
         */
        ROAPageInstall *install;

        /**
         * \brief Status page
         */
        ROAPageStatus *status;

        /**
         * \brief Finish page
         */
        ROAPageFinish *finish;

        /**
         * \brief Current page index
         */
        int currentIndex;

        /**
         * \brief Flag to check if the winow is moved
         */
        bool moving;

        /**
         * \brief The offset for placing the window centred
         */
        QPoint offset;

        /**
         * \brief Application translator
         */
        QTranslator *translator;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * \brief Set new content page
         * \param _contentID The page id
         */
        void changeContent(int _contentID);

        /**
         * \brief Hide old content page
         * \param _contentID The content page to hide
         */
        void hideContent(int _contentID);

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
         * \brief Slot when back button was clicked, show previouse page
         */
        void on_qpBack_clicked();

        /**
         * \brief Slot when next button was clicked, show next page
         */
        void on_qpNext_clicked();

        /**
         * \brief Slot when cancel button was clicked, close the installer
         */
        void on_qbCancel_clicked();

        /**
         * \brief Slot when language was changed
         */
        void slot_languageChanged();

    signals:

        /**
         * \brief Signal for installation phase reached
         */
        void readyToInstall();
};

#endif // ROAMAINWIDGET_H
