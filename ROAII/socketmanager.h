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
 * @file    	socketmanager.h
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

#ifndef SOCKETMANAGER_H
#define SOCKETMANAGER_H

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
#include <QObject>
#include <QMap>
#include <QVector>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "tcpconnection.h"
#include "socketconnector.h"
#include "constants.h"
#include "logger.h"

/**
 * @brief The socket manager for managing socketconnectors.
 */
class SocketManager : public QObject
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
         * @brief Constructor
         * @param _portAmount Amount of workers aka ports
         */
        SocketManager(int _portAmount, int _portStart);

        /**
         * @brief Send data to remote
         * @param _message The xml message
         */
        void sendData(int _id, QString _message);

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Map with all sending sockets
         */
        QMap<int, SocketConnector*> senderSockets;

        /**
         * @brief Map with all receving sockets
         */
        QMap<int, SocketConnector*> receiverSockets;

        /**
         * @brief Boost io services for TCP/IP stack
         */
        boost::asio::io_service io_service;

        /**
         * @brief Log object
         */
        Logger *log;

        /**
         * @brief Port amounts
         */
        int portAmount;

        /**
         * @brief Starting port
         */
        int portStart;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Setup all ports and start listening
         * @return True if went fine, else false
         */
        bool setup();

        /**
         * @brief Create sending ports
         * @param _groupId The group id (snd and rec are always in a group)
         * @param _port The port
         * @param _socketId The socket id
         */
        void createSenderPorts(int _groupId, int _port, int _socketId);

        /**
         * @brief Create receiving ports
         * @param _groupId The group id (snd and rec are always in a group)
         * @param _port The port
         * @param _socketId The socket id
         */
        void createReceiverPorts(int _groupId, int _port, int _socketId);

    private slots:

        /**
         * @brief Triggered if new message was received
         * @param _message
         */
        void slot_newMessageReceived(QString _message, int _id);

        /**
         * @brief Slot when instance was moved to thread
         */
        void slot_process();

        /**
         * @brief slot_setStateChanged
         * @param _socketId
         * @param _socketDataId
         * @param _text
         */
        void slot_setStateChanged(int _socketId, int _socketDataId, QString _text);

        /**
         * @brief Slot on sent message
         */
        void slot_messageSent();

    signals:

        /**
         * @brief Signal on new message
         * @param _message The message
         * @param _id The socket id for propagating
         */
        void signal_newMessage(QString _message, int _id);

        /**
         * @brief State of socket changed
         * @param _socketId The socket id
         * @param _socketDataChanged The state changed
         * @param _text The value to set
         */
        void signal_socketChanged(int _socketId, int _socketDataChanged, QString _text);

        /**
         * @brief Signal on message sent
         */
        void signal_messageSent();
};

#endif // SOCKETMANAGER_H
