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
 * \file    	roapagecomponents.cpp
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
#include "../h/roapagecomponents.h"
#include "ui_roapagecomponents.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

ROAPageComponents::ROAPageComponents(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::ROAPageComponents)
{
    ui->setupUi(this);

#ifdef Q_OS_LINUX
    ui->cbMSVC->hide();
    ui->cbOAL->hide();
#endif
    ui->cbMenuEntry->setStyleSheet("QCheckBox::indicator::checked {image: url(:/images/checkbox_checked.png)} QCheckBox::indicator::unchecked {image: url(:/images/checkbox_unchecked.png)}");
    ui->cbDesktop->setStyleSheet("QCheckBox::indicator::checked {image: url(:/images/checkbox_checked.png)} QCheckBox::indicator::unchecked {image: url(:/images/checkbox_unchecked.png)}");
    ui->cbLauncher->setStyleSheet("QCheckBox::indicator::checked {image: url(:/images/checkbox_checked.png)} QCheckBox::indicator::unchecked {image: url(:/images/checkbox_unchecked.png)}");
    ui->cbMSVC->setStyleSheet("QCheckBox::indicator::checked {image: url(:/images/checkbox_checked.png)} QCheckBox::indicator::unchecked {image: url(:/images/checkbox_unchecked.png)}");
    ui->cbOAL->setStyleSheet("QCheckBox::indicator::checked {image: url(:/images/checkbox_checked.png)} QCheckBox::indicator::unchecked {image: url(:/images/checkbox_unchecked.png)}");

}

ROAPageComponents::~ROAPageComponents()
{
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void ROAPageComponents::retranslate()
{
    ui->retranslateUi(this);
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

QStringList ROAPageComponents::getSelectedComponents()
{
    // Create array
    QStringList list;

    list.append(QString::number(ui->cbLauncher->isChecked()));
    list.append(QString::number(ui->cbMSVC->isChecked()));
    list.append(QString::number(ui->cbOAL->isChecked()));
    list.append(QString::number(ui->cbMenuEntry->isChecked()));
    list.append(QString::number(ui->cbDesktop->isChecked()));

    return list;
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/
