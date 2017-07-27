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
 * \file    	roamainwidget.cpp
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
#include "../h/roamainwidget.h"
#include "ui_roamainwidget.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

RoaMainWidget::RoaMainWidget(QString _path, QWidget *parent) :
    QWidget(parent),
    ui(new Ui::RoaMainWidget)
{
    // Set transparent
    this->setWindowFlags(Qt::FramelessWindowHint);
    this->setAttribute(Qt::WA_TranslucentBackground, true);

    // Setup the form
    ui->setupUi(this);

    // Translator
    translator = new QTranslator();

    // Add all pages
    welcome = new ROAPageWelcome(this);
    welcome->hide();

    // Connect language change signal
    connect(welcome,SIGNAL(signal_languageChanged()),this,SLOT(slot_languageChanged()));

    license = new ROAPageLicense(this);
    license->hide();

    components = new ROAPageComponents(this);
    components->hide();

    install = new ROAPageInstall(this, _path);
    install->hide();

    status = new ROAPageStatus(this);
    status->hide();

    finish = new ROAPageFinish(this);
    finish->hide();

    // Center the whole window
    QRect desktopRect = QApplication::desktop()->availableGeometry(this);
    QPoint center = desktopRect.center();

    this->move(center.x()-this->width()*0.5,  center.y()-this->height()*0.5);

    currentIndex = 0;

    changeContent(currentIndex);
}

RoaMainWidget::~RoaMainWidget()
{
    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

QString RoaMainWidget::getInstallPath()
{
     return install->getInstallPath();
}

QStringList RoaMainWidget::getSelectedComponents()
{
    return components->getSelectedComponents();
}

void RoaMainWidget::setNewStatus(int _value)
{
    status->setNewStatus(_value);
}

void RoaMainWidget::setNewLabelText(QString _text)
{
    status->setNewLabelText(_text);
}

void RoaMainWidget::setCustomContentId(int _id)
{
    hideContent(currentIndex);
    changeContent(_id);
    currentIndex = _id;
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void RoaMainWidget::changeContent(int _contentID)
{
    QString subTitle, desc;

    switch(_contentID)
    {
        // Welcome page
        case 0:

            // Move it
            welcome->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            welcome->show();

            // Set sub title and description
            subTitle = tr("Relics of Annorath Alpha");
            desc = tr("The wizard installs the Relics of Annorath Alpha with all dependencies.");

            // Set buttons
            ui->qpBack->hide();
            ui->qpNext->setText(tr("Next >"));

            break;

        case 1:

            // Move it
            license->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            license->show();

            // Set sub title and description
            subTitle = tr("Non-disclosure agreement");
            desc = tr("To install Relics of Annorath you have to accept the NDA:");

            // Set buttons
            ui->qpNext->setText(tr("Accept >"));
            ui->qpBack->show();

            break;

        case 2:

            // Move it
            components->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            components->show();

            // Set sub title and description
            subTitle = tr("Installation Components");
            desc = tr("Please select the components to install:");

            // Set buttons
            ui->qpNext->setText(tr("Next >"));

            break;

        case 3:

            // Move it
            install->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            install->show();

            // Set sub title and description
            subTitle = tr("Installation path");
            desc = tr("Please select the installation path:");

            break;

        case 4:

            // Move it
            status->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            status->show();

            // Set sub title and description
            subTitle = tr("Downloading and Installing...");
            desc = tr("Installing Relics of Annorath with all dependencies...");

            // Set buttons
            ui->qpNext->hide();
            ui->qpBack->hide();

            break;

        case 5:

            // Move it
            finish->move(ui->qwContent->pos().x(),ui->qwContent->pos().y());
            finish->show();

            // Set sub title and description
            subTitle = tr("Done!");
            desc = tr("Relics of Annorath installed successfully!");

            // Set buttons
            ui->qbCancel->setText(tr("Finish >"));

            break;

    }

    // Set strings
    ui->qlSubtitel->setText(subTitle);
    ui->qlDesc->setText(desc);
}

void RoaMainWidget::hideContent(int _contentID)
{
    switch(_contentID)
    {
        case 0:
            welcome->hide();
            break;
        case 1:
            license->hide();
            break;
        case 2:
            components->hide();
            break;
        case 3:
            install->hide();
            break;
        case 4:
            status->hide();
            break;
    }
}

QString RoaMainWidget::getLanguage()
{
    return welcome->getLanguage();
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void RoaMainWidget::on_qpBack_clicked()
{
    hideContent(currentIndex);
    currentIndex--;
    changeContent(currentIndex);
}

void RoaMainWidget::on_qpNext_clicked()
{
    hideContent(currentIndex);
    currentIndex++;
    changeContent(currentIndex);

    // Start installation
    if(currentIndex == 4)
    {
        emit readyToInstall();
    }
}

void RoaMainWidget::on_qbCancel_clicked()
{
    if(currentIndex != 5)
    {
        QApplication::exit();
    }
    else
    {
#ifdef Q_OS_WIN
        process = new WindowsProcess();
        process->setProcessEnvLauncher(install->getInstallPath() + "launcher/ROALauncher.exe",install->getInstallPath());
        process->run();
#endif

#ifdef Q_OS_LINUX
        // Set process
        QProcess launcher;

        // Star the process
        launcher.startDetached("sh", QStringList() << QString(install->getInstallPath() + "launcher/bin/ROALauncher.sh" ),install->getInstallPath() + "launcher/bin");
#endif
        QApplication::exit();
    }
}

void RoaMainWidget::slot_languageChanged()
{
    // Retranslate gui
    ui->retranslateUi(this);

    components-> retranslate();
    install->retranslate();

    // Set text again for translation
    changeContent(0);
}

/******************************************************************************/
/*                                                                            */
/*    Events                                                                  */
/*                                                                            */
/******************************************************************************/

void RoaMainWidget::mousePressEvent(QMouseEvent *event)
{
    // We move the window with the left button
    if((event->button() == Qt::LeftButton))
    {
        moving = true;
        offset = event->pos();
    }
}

void RoaMainWidget::mouseMoveEvent(QMouseEvent *event)
{
    // The move event while mouse is pressed
    if(moving)
        this->move(event->globalPos() - offset);
}

void RoaMainWidget::mouseReleaseEvent(QMouseEvent *event)
{
    // The release event
    if(event->button() == Qt::LeftButton) {
        moving = false;
    }
}
