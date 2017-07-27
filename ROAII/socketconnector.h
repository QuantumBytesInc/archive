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
 * @file    	socketconnector.h
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

#ifndef SOCKETCONNECTOR_H
#define SOCKETCONNECTOR_H

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
#include <QThread>
#include <QObject>
#include <QString>
#include <QVector>

/******************************************************************************/
/*                                                                            */
/*    Boost includes                                                          */
/*                                                                            */
/******************************************************************************/
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "tcpconnection.h"
#include "logger.h"
#include "constants.h"

/**
 * @brief Socket logic class for tcpconnection with work load managing.
 */
class SocketConnector : public QObject
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
         * @brief Socket for connections
         * @param io_service The boost io_service
         * @param _port The port
         * @param _type The socket type (read/write)
         * @param _socketId The socket id
         */
        SocketConnector(boost::asio::io_service& io_service, int _port, int _type, int _groupId, int _socketId);

        /**
         * @brief Send data over network, only for socket type read
         * @param _message The message to send
         */
        void sendData(QString _message);

        /**
         * @brief Check if socket is busy
         * @return The status of the socket
         */
        bool isBusy();

        /**
         * @brief Setup the socket
         */
        void setup();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Queued messages to process
         */
        QVector<QString> queue;

        /**
         * @brief The socket type
         */
        int type;

        /**
         * @brief The group
         */
        int group;

        /**
         * @brief The socket id
         */
        int id;

        /**
         * @brief Work total done
         */
        int workTotal;

        /**
         * @brief Errors total occured
         */
        int errorsTotal;

        /**
         * @brief State if socket is busy
         */
        bool busy;

        /**
         * @brief State if socket is ready
         */
        bool isReady;

        /**
         * @brief The current socket port
         */
        int port;

        /**
         * @brief The log file
         */
        Logger *log;

        /**
         * @brief Shared object for data sharing
         */
        SharedObject sharedObject;

        /**
         * @brief TCP acceptor
         */
        tcp::acceptor acceptor_;

        /**
         * @brief Pointer to sender socket
         */
        tcp_connection::pointer sender;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Start socket
         */
        void start_accept();

        /**
         * @brief Accept incoming connection
         * @param _newConnection Pointer to the connection
         * @param _error The error code
         */
        void handle_accept(tcp_connection::pointer _newConnection, const boost::system::error_code& _error);

        /**
         * @brief Start writing to socket
         * @param _message The message
         */
        void handle_write(QString _message);

    private slots:

        /**
         * @brief Report new message upstream
         * @param _message The message arrived
         */
        void slot_promoteNewMessage(QString _message);

        /**
         * @brief Reopen slot after message sending
         */
        void slot_readyForWork();

        /**
         * @brief Slot on read error
         * @param _error The error as string
         */
        void slot_readError(QString _error);

    signals:

        /**
         * @brief New messag arrived
         * @param _message The message
         */
        void signal_newMessage(QString _message, int _id);

        /**
         * @brief No work to do
         */
        void signal_ready();

        /**
         * @brief State of socket changed
         * @param _socketId The socket id
         * @param _socketDataChanged The state changed
         * @param _text The value to set
         */
        void signal_stateChanged(int _socketId, int _socketDataChanged, QString _text);

        /**
         * @brief Signal when message was sent
         */
        void signal_messageSent();
};

#endif // SOCKETCONNECTOR_H
