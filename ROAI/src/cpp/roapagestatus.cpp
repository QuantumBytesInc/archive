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
 * \file    	roapagestatus.cpp
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

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/roapagestatus.h"
#include "ui_roapagestatus.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/
ROAPageStatus::ROAPageStatus(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::ROAPageStatus)
{
    ui->setupUi(this);
    ui->qpStatus->setValue(0);

    // Style progressbar
    this->ui->qpStatus->setStyleSheet("QProgressBar {"
                                      "  color: rgb(216, 216, 216);"
                                      "  border: 0px solid;"
                                      "  background-color: rgba(255, 255, 127, 40);"
                                      "  border-width:1px;"
                                      "  border-style:solid;"
                                      "  border-radius:6px;"
                                      "  font-size: 28px;"
                                      "  font-family: \"Ubuntu\";"
                                      "}"
                                      "QProgressBar::chunk {"
                                      "  color: rgb(216, 216, 216);"
                                      "  background-color: rgba(42, 85, 0, 90);"
                                      "  width: 20px;"
                                      "  font-size: 28px;"
                                      "  font-family: \"Ubuntu\";"
                                      "}");
}

ROAPageStatus::~ROAPageStatus()
{
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void ROAPageStatus::setNewStatus(int _value)
{
    ui->qpStatus->setValue(_value);
}

void ROAPageStatus::setNewLabelText(QString _text)
{
    ui->qlDownload->setText(_text);
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/
