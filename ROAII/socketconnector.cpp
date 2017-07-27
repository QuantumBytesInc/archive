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
 * @brief       Socket class for managing read and write over tcpconnection class.
 *
 * @file    	socketconnector.cpp
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
#include "socketconnector.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

SocketConnector::SocketConnector(boost::asio::io_service &io_service, int _port, int _type, int _groupId, int _socketId) : acceptor_(io_service, tcp::endpoint(tcp::v4(), _port))
{
    // Set type, group and id
    type = _type;
    group = _groupId;
    id = _socketId;
    port = _port;

    // Set worktotal, errorsTotal
    workTotal = 0;
    errorsTotal = 0;

    // Connect signals
    connect(&sharedObject,SIGNAL(signal_newMessage(QString)),this,SLOT(slot_promoteNewMessage(QString)));
    connect(&sharedObject,SIGNAL(signal_sendingDone()),this,SLOT(slot_readyForWork()));
    //connect(&sharedObject,SIGNAL(signal_readError(QString)),this,SLOT(slot_readyForWork()));

    // Wait for work
    busy = false;
    isReady = false;

    // Create log file
    log = new Logger(QString("SocketConnector" + QString::number(id)));
    log->addEntry(LOG_LEVEL_INF, "Creating socket", __PRETTY_FUNCTION__);
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void SocketConnector::setup()
{    
    // Send signal for gui
    emit signal_stateChanged(id, SOCKET_STATE_STATE, "Initializing");
    emit signal_stateChanged(id, SOCKET_STATE_GROUP, QString::number(group));
    emit signal_stateChanged(id, SOCKET_STATE_PORT, QString::number(port));

    if(type == SOCKET_TYPE_READER)
    {
        log->addEntry(LOG_LEVEL_INF, "Setting up socket (receiver)", __PRETTY_FUNCTION__);
        emit signal_stateChanged(id, SOCKET_STATE_TYPE, "Receiver");
    }
    else
    {
        log->addEntry(LOG_LEVEL_INF, "Setting up socket (sender)", __PRETTY_FUNCTION__);
        emit signal_stateChanged(id, SOCKET_STATE_TYPE, "Sender");
    }

    emit signal_stateChanged(id, SOCKET_STATE_PROCESSED, QString::number(workTotal));
    emit signal_stateChanged(id, SOCKET_STATE_ERRORS, QString::number(errorsTotal));

    // Start accepting connections
    start_accept();
}

void SocketConnector::sendData(QString _message)
{
    if(!busy)
    {
        // Set busy state
        busy = true;

        // Start sending
        if(isReady)
        {
            log->addEntry(LOG_LEVEL_INF, "Start sending message: " + _message, __PRETTY_FUNCTION__);
            sender->startWriting(_message, &sharedObject);
        }
        else
        {
            log->addEntry(LOG_LEVEL_INF, "Socket not ready", __PRETTY_FUNCTION__);
            //message = _message;
            queue.append(_message);
        }

        // Send signal for gui
        emit signal_stateChanged(id, SOCKET_STATE_STATE, "Writing");
    }
    else
    {
        log->addEntry(LOG_LEVEL_INF, "Socket is busy", __PRETTY_FUNCTION__);
        queue.append(_message);
    }
}

bool SocketConnector::isBusy()
{
    return busy;
}


/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

void SocketConnector::start_accept()
{
    log->addEntry(LOG_LEVEL_INF, "Switch socket to listening", __PRETTY_FUNCTION__);

    // Create new pointer to connection
    tcp_connection::pointer new_connection = tcp_connection::create(acceptor_.get_io_service());
    new_connection->setLog(log);

    // Wait for async connection
    acceptor_.async_accept(new_connection->socket(), boost::bind(&SocketConnector::handle_accept, this, new_connection, boost::asio::placeholders::error));

    // Send signal for gui
    emit signal_stateChanged(id, SOCKET_STATE_STATE, "Listening");
}

void SocketConnector::handle_accept(tcp_connection::pointer _newConnection, const boost::system::error_code& _error)
{
    log->addEntry(LOG_LEVEL_INF, "Socket is now conncted", __PRETTY_FUNCTION__);

    // Send signal for gui
    emit signal_stateChanged(id, SOCKET_STATE_STATE, "Connected");

    // Check for error
    if (!_error)
    {
        // Increment worktotal
        workTotal++;

        // Check for type
        if(type == SOCKET_TYPE_READER)
        {
            log->addEntry(LOG_LEVEL_INF, "Prepare for next message receving", __PRETTY_FUNCTION__);

            // Start listening
            _newConnection->startReading(&sharedObject);
            start_accept();
        }
        // Write
        else
        {
            log->addEntry(LOG_LEVEL_INF, "Prepare for next message sending", __PRETTY_FUNCTION__);

            // Create new connection
            sender = _newConnection;

            isReady = true;

            if(busy)
            {
                // Remove busy state
                //sender->write(message, &sharedObject);
                busy = false;

                if(queue.size() > 0)
                {
                    sendData(queue.first());
                    queue.removeFirst();
                }
                else if(queue.size() == 0)
                {
                    queue.clear();
                }
            }
        }

        // Send signal for gui
        emit signal_stateChanged(id, SOCKET_STATE_PROCESSED, QString::number(workTotal));
    }
    else
    {
        log->addEntry(LOG_LEVEL_ERR, "Error occured, reset socket", __PRETTY_FUNCTION__);

        // Increment errors
        errorsTotal++;

        // Check for type
        if(type == SOCKET_TYPE_READER)
        {
            // Start new socket
            start_accept();
        }
        // Write
        else
        {
            // Create new connection
            sender = _newConnection;

            if(busy)
            {
                // Remove busy state
                emit signal_ready();
            }
        }

        // Send signal for gui
        emit signal_stateChanged(id, SOCKET_STATE_ERRORS, QString::number(errorsTotal));
    }
}

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void SocketConnector::slot_promoteNewMessage(QString _message)
{
    log->addEntry(LOG_LEVEL_INF, "Promoting new message to main thread", __PRETTY_FUNCTION__);

    // Send message upstream
    emit signal_newMessage(_message, group);
}

void SocketConnector::slot_readyForWork()
{
    log->addEntry(LOG_LEVEL_INF, "Ready for new work", __PRETTY_FUNCTION__);

    // Remove busy flag
    //busy = false;
    isReady = false;

    // Open connection
    start_accept();

    emit signal_messageSent();
}

void SocketConnector::slot_readError(QString _error)
{
    log->addEntry(LOG_LEVEL_ERR, "Bloody error", __PRETTY_FUNCTION__);

    // Open connection
    //start_accept();

    //emit signal_stateChanged(id, SOCKET_STATE_ERROR_LAST, _error);
}
