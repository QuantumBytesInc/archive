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
 * @brief       Manager for socketconnector instances.
 *
 * @file    	socketmanager.cpp
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
#include "socketmanager.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

SocketManager::SocketManager(int _portAmount, int _portStart)
{
    log = new Logger("SocketManager");
    log->addEntry(LOG_LEVEL_INF,"Starting socket manager", __PRETTY_FUNCTION__);

    portAmount = _portAmount;
    portStart = _portStart;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void SocketManager::sendData(int _id, QString _message)
{
    log->addEntry(LOG_LEVEL_INF,"Sending message: " + QString::number(_id), __PRETTY_FUNCTION__);

    senderSockets.value(_id)->sendData(_message+ "=[=_]");
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

bool SocketManager::setup()
{
    int port = portStart;
    int lastSockedId = 0;

    for(int i = 1; i <= portAmount; i++)
    {
        port++;
        lastSockedId++;

        log->addEntry(LOG_LEVEL_INF,"Starting receving socket - Port: " + QString::number(port) + " ID: " + QString::number(lastSockedId), __PRETTY_FUNCTION__);
        createReceiverPorts(i,port,lastSockedId);

        port++;
        lastSockedId++;

        log->addEntry(LOG_LEVEL_INF,"Starting sending socket - Port: " + QString::number(port) + " ID: " + QString::number(lastSockedId), __PRETTY_FUNCTION__);
        createSenderPorts(i,port,lastSockedId);
    }

    try
     {
        log->addEntry(LOG_LEVEL_INF,"Starting io_service", __PRETTY_FUNCTION__);

        io_service.run();
        return true;
     }
     catch (std::exception& e)
     {
        log->addEntry(LOG_LEVEL_ERR,"Error on io_service run: " + QString(e.what()), __PRETTY_FUNCTION__);

        return false;
     }
}

void SocketManager::createReceiverPorts(int _groupId, int _port, int _socketId)
{
    // Create socket
    SocketConnector *socket;
    socket = new SocketConnector(io_service, _port, SOCKET_TYPE_READER, _groupId, _socketId );

    // Connect signal
    connect(socket,SIGNAL(signal_newMessage(QString, int)),this,SLOT(slot_newMessageReceived(QString, int)));
    connect(socket,SIGNAL(signal_stateChanged(int,int,QString)),this,SLOT(slot_setStateChanged(int,int,QString)));

    socket->setup();

    // Append to list
    receiverSockets.insert(_groupId, socket);
}

void SocketManager::createSenderPorts(int _groupId, int _port, int _socketId)
{

    SocketConnector *socket = new SocketConnector(io_service, _port, SOCKET_TYPE_SENDER, _groupId, _socketId );

    // Connect signal
    connect(socket,SIGNAL(signal_stateChanged(int,int,QString)),this,SLOT(slot_setStateChanged(int,int,QString)));
    connect(socket,SIGNAL(signal_messageSent()),this,SLOT(slot_messageSent()));

    socket->setup();

    // Append to list
    senderSockets.insert(_groupId, socket);
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void SocketManager::slot_newMessageReceived(QString _message, int _id)
{
    emit signal_newMessage(_message, _id);
}

void SocketManager::slot_process()
{
   setup();
}

void SocketManager::slot_setStateChanged(int _socketId, int _socketDataId, QString _text)
{
    emit signal_socketChanged(_socketId, _socketDataId, _text);
}

void SocketManager::slot_messageSent()
{
    emit signal_messageSent();
}
