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
 * \file    	roapagewelcome.cpp
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
#include "../h/roapagewelcome.h"
#include "ui_roapagewelcome.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

ROAPageWelcome::ROAPageWelcome(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::ROAPageWelcome)
{

    translator = new QTranslator();

    ui->setupUi(this);

    ui->qcLanguage->setStyleSheet("QComboBox {"
                                  " background-color: rgb(255, 255, 255, 200);"
                                  " border-width:1px;"
                                  " border-style:solid;"
                                  " border-radius:4px;"
                                  "}"
                                  "QComboBox:!editable:on, QComboBox::drop-down:editable:on, QComboBox:!editable:off, QComboBox::drop-down:editable:off, QAbstractItemView {"
                                  " background-color: rgba(255, 204, 0, 80);"
                                  " color: #000000;"
                                  " border-width:1px;"
                                  " border-style:solid;"
                                  " border-radius:4px;"
                                  "}");

    // Add values to the boxes for language seleciton
    ui->qcLanguage->addItem( "English", "english" );
    ui->qcLanguage->addItem( "Español", "spanish" );
    ui->qcLanguage->addItem( "Deutsch", "german" );
    ui->qcLanguage->addItem( "Français", "french" );
    ui->qcLanguage->addItem( "Italiano", "italian" );
    ui->qcLanguage->addItem( "Polski", "polish" );
    ui->qcLanguage->addItem( "Português", "portuguese" );
    ui->qcLanguage->addItem( "Svenska", "swedish" );
    ui->qcLanguage->addItem( "ελληνικά", "greek" );
}

ROAPageWelcome::~ROAPageWelcome()
{
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

QString ROAPageWelcome::getLanguage()
{
    return language;
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void ROAPageWelcome::changeEvent(QEvent *_event)
{
    if (_event->type() == QEvent::LanguageChange)
    {
        ui->retranslateUi(this);
    }
    else
    {
        QWidget::changeEvent(_event);
    }
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void ROAPageWelcome::on_qcLanguage_currentIndexChanged(int _index)
{
    // Retranslate the whole ui while language changed
    QApplication::removeTranslator(translator);

    if(!translator->load(":/translations/roai_" + ui->qcLanguage->itemData(_index).toString()))
    {
        /// \todo Cleanup
        //qDebug() << "Language not found";
    }

    // Set language
    language = ui->qcLanguage->itemData(_index).toString();

    // Install translator
    QApplication::installTranslator(translator);

    // Retranslate gui
    ui->retranslateUi(this);

    // Send signal
    emit signal_languageChanged();
}
