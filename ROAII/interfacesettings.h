/**
 * @copyright
 *              Copyright © 2011 Manuel Gysin
 *              Copyright © 2012 QuantumBytes inc.
 *              Copyright © 2014 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * @section LICENSE
 *
 *              This file is part of QuantumBytes Interface.
 *
 *              QuantumBytes Interface is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              QuantumBytes Interface is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with QuantumBytes Interface.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @brief       Settings class for managing the interface settings.
 *
 * @file    	interfacesettings.h
 *
 * @note
 *
 * @version 	3.0
 *
 * @author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * @date        2014/11/03 19:00:00 GMT+1
 *
 */

#ifndef INTERFACESETTINGS_H
#define INTERFACESETTINGS_H

/******************************************************************************/
/*                                                                            */
/*    C/C++ includes                                                          */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QDialog>
#include <QSettings>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logger.h"

/**
 * @addtogroup ui
 */
namespace Ui
{
    class InterfaceSettings;
}

/**
 * @brief The settings class
 */
class InterfaceSettings : public QDialog
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
         * @brief Constructor
         * @param The parent
         */
        explicit InterfaceSettings(QWidget *parent = 0);

        /**
         * @brief Deconstructor
         */
        ~InterfaceSettings();

        /**
         * @brief Get specific setting
         * @param _key The setting key
         * @return The setting value as string
         */
        QString getSetting(QString _key);

        /**
         * @brief Set logger
         * @param _logger The current logger
         */
        void setLogger(Logger *_logger);

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The ui
         */
        Ui::InterfaceSettings *ui;

        /**
         * @brief The internal setting class
         */
        QSettings *settings;

        /**
         * @brief Logger instance
         */
        Logger *logger;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

    private slots:

        /**
         * @brief Save settings
         */
        void on_buttonBox_accepted();
};

#endif // INTERFACESETTINGS_H
