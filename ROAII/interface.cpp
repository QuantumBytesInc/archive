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
 * @brief       Main class for work managing and coordination.
 *
 * @file    	interface.cpp
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
#include "interface.h"
#include "ui_interface.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

Interface::Interface(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::Interface)
{
    // Start logging
    log = new Logger("InterfaceReloaded");
    log->addEntry(LOG_LEVEL_INF,"Starting interface", __PRETTY_FUNCTION__);

    // Setup logger for settings
    config.setLogger(log);

    // Set stats to zero
    requestsReceived = 1;
    requestsSent = 1;
    requestsSocketReceived = 1;
    requestsSocketSent = 1;

    // Show gui
    ui->setupUi(this);

    // Prepare view
    ui->threads->verticalHeader()->setVisible(false);
    ui->threads->setRowCount(config.getSetting("threads").toInt());
    ui->sockets->verticalHeader()->setVisible(false);
    ui->sockets->setRowCount(config.getSetting("threads").toInt()*2);

    // Fill tables
    for(int i = 0; i <= ui->threads->columnCount(); i++)
    {
        ui->threads->setColumnWidth(i, ui->threads->width()/ui->threads->columnCount()-2);

        for(int ii = 0; ii <= ui->threads->rowCount(); ii++)
        {
            if(i != THREAD_STATE_DETAILS)
            {
                QTableWidgetItem *item = new QTableWidgetItem();
                ui->threads->setItem(ii,i,item);
            }
        }
    }

    for(int i = 0; i <= ui->sockets->columnCount(); i++)
    {
        ui->sockets->setColumnWidth(i, ui->threads->width()/ui->sockets->columnCount()-2);

        for(int ii = 0; ii <= ui->sockets->rowCount(); ii++)
        {
            QTableWidgetItem *item = new QTableWidgetItem();
            ui->sockets->setItem(ii,i,item);
        }
    }

    // Create manager
    threadManager = new ThreadManager(config.getSetting("threads").toInt(), config.getSetting("dataHost"));

    // Connect signals
    connect(threadManager, SIGNAL(signal_threadChanged(int, int, QString)),this, SLOT(slot_threadStatusChanged(int, int, QString)));
    connect(threadManager, SIGNAL(signal_workDone(int, QString)),this, SLOT(slot_sendMessage(int, QString)));
    connect(threadManager, SIGNAL(signal_requestSent()),this, SLOT(slot_requestSent()));

    // Start manager
    threadManager->start();

    // Create socket manager
    socketManager = new SocketManager(config.getSetting("threads").toInt(), config.getSetting("startPortUnigine").toInt());

    // Connect for signal
    connect(socketManager,SIGNAL(signal_newMessage(QString, int)),this,SLOT(slot_newMessage(QString, int)));
    connect(socketManager,SIGNAL(signal_socketChanged(int,int,QString)),this,SLOT(slot_socketStatusChanged(int,int,QString)));
    connect(socketManager, SIGNAL(signal_messageSent()),this, SLOT(slot_messageSent()));

    // Create thread and move sockets into it
    thread = new QThread();
    socketManager->moveToThread(thread);

    // Connect signal and start
    connect(thread, SIGNAL(started()), socketManager, SLOT(slot_process()));
    thread->start();
}

Interface::~Interface()
{
    log->addEntry(LOG_LEVEL_INF,"Stopping interface", __PRETTY_FUNCTION__);

    delete ui;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

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

void Interface::on_actionConfiguration_triggered()
{
    config.show();
}

void Interface::slot_threadStatusChanged(int _threadId, int _threadDataChanged, QString _text)
{
    ui->threads->item(_threadId-1,_threadDataChanged)->setText(_text);
}

void Interface::slot_socketStatusChanged(int _socketId, int _socketDataChanged, QString _text)
{
    ui->sockets->item(_socketId-1,_socketDataChanged)->setText(_text);
}

void Interface::slot_newMessage(QString _message, int _id)
{
    log->addEntry(LOG_LEVEL_INF, "Setting work to thread manager", __PRETTY_FUNCTION__);

    threadManager->setWork(_message, _id);
    ui->labelRequetsSocketReceived->setText(QString::number(requestsReceived++));
}

void Interface::slot_sendMessage(int _id, QString _data)
{
    log->addEntry(LOG_LEVEL_INF, "Send message to socket manager: " + QString::number(_id), __PRETTY_FUNCTION__);

    socketManager->sendData(_id, _data);
    ui->labelRequestsReceived->setText(QString::number(requestsSocketReceived++));
}

void Interface::slot_messageSent()
{
    ui->labelRequestsSocketSent->setText(QString::number(requestsSocketSent++));
}

void Interface::slot_requestSent()
{
    ui->labelRequestsSent->setText(QString::number(requestsSent++));
}
