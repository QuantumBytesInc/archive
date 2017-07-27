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
 * @file    	interfacesettings.cpp
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

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "interfacesettings.h"
#include "ui_interfacesettings.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

InterfaceSettings::InterfaceSettings(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::InterfaceSettings)
{
    settings = new QSettings();

    if(settings->value("firstRun", 1).toInt())
    {
        settings->setValue("startPortDjango", 14001);
        settings->setValue("startPortUnigine", 24001);
        settings->setValue("threads", 6);
        settings->setValue("dataHost", "https://127.0.0.1");
        settings->setValue("firstRun", 0);
    }

    ui->setupUi(this);

    ui->le_dataHost->setText(settings->value("dataHost").toString());
    ui->le_startPortDjango->setText(settings->value("startPortDjango").toString());
    ui->le_startPortUnigine->setText(settings->value("startPortUnigine").toString());
    ui->le_threads->setText(settings->value("threads").toString());
}

InterfaceSettings::~InterfaceSettings()
{
    logger->addEntry(LOG_LEVEL_INF,"Deconstructing settings", __PRETTY_FUNCTION__);

    delete settings;
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

QString InterfaceSettings::getSetting(QString _key)
{
    return settings->value(_key, -1).toString();
}

void InterfaceSettings::setLogger(Logger *_logger)
{
    logger = _logger;
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void InterfaceSettings::on_buttonBox_accepted()
{
    logger->addEntry(LOG_LEVEL_INF,"Saving settings", __PRETTY_FUNCTION__);

    settings->setValue("startPortUnigine", ui->le_startPortUnigine->text().toInt());
    settings->setValue("startPortDjango", ui->le_startPortDjango->text().toInt());
    settings->setValue("threads", ui->le_threads->text().toInt());
    settings->setValue("dataHost", ui->le_dataHost->text());
}

