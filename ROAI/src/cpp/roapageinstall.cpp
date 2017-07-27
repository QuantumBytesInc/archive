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
 * \file    	roapageinstall.cpp
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
#include "../h/roapageinstall.h"
#include "ui_roapageinstall.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/
ROAPageInstall::ROAPageInstall(QWidget *parent, QString _path) :
    QWidget(parent),
    ui(new Ui::ROAPageInstall)
{
    ui->setupUi(this);
    if(_path != "none")
    {
        ui->qlPath->setText(_path);
    }
    else
    {
#ifdef Q_OS_LINUX
        ui->qlPath->setText(QDir::homePath() + "/Relics of Annorath");
#endif
#ifdef Q_OS_WIN32
        ui->qlPath->setText(QString(getenv("PROGRAMFILES")) + "\\Relics of Annorath");
#endif
    }
}

ROAPageInstall::~ROAPageInstall()
{
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

QString ROAPageInstall::getInstallPath()
{
    QString path = ui->qlPath->text();

    if(!path.endsWith("/"))
    {
        path += "/";
    }

    return path;
}

void ROAPageInstall::retranslate()
{
    ui->retranslateUi(this);
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

void ROAPageInstall::on_qbBrowse_clicked()
{   
    // Get installation path
    QString path = (QFileDialog::getExistingDirectory(this, tr("Open Directory"),
                                                      ui->qlPath->text(),
                                                      QFileDialog::ShowDirsOnly
                                                             | QFileDialog::DontResolveSymlinks));
    // Check if path is empty
    if(path != "")
    {
        ui->qlPath->setText(path + "/Relics of Annorath");
    }
}
