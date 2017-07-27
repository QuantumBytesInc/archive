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
 * @file    	interface.h
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

#ifndef INTERFACE_H
#define INTERFACE_H

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
#include <QMainWindow>
#include <QPushButton>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logger.h"
#include "interfacesettings.h"
#include "threadmanager.h"
#include "socketmanager.h"

/**
 * \addtogroup ui
 */
namespace Ui {
    class Interface;
}

/**
 * @brief The Interface class for managing everything
 */
class Interface : public QMainWindow
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
         * @brief Constructur
         * @param The parent
         */
        explicit Interface(QWidget *parent = 0);

        /**
         * @brief Deconstructur
         */
        ~Interface();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The class ui
         */
        Ui::Interface *ui;

        /**
         * @brief Log object
         */
        Logger *log;

        /**
         * @brief Configuration class
         */
        InterfaceSettings config;

        /**
         * @brief Pointer to thread manager
         */
        ThreadManager *threadManager;

        /**
         * @brief Pointer to socket manager
         */
        SocketManager *socketManager;

        /**
         * @brief Thread for socket manager
         */
        QThread *thread;

        /**
         * @brief Total requests send django
         */
        int requestsSent;

        /**
         * @brief Total requests received from django
         */
        int requestsReceived;

        /**
         * @brief Total requests sent to unigine
         */
        int requestsSocketSent;

        /**
         * @brief Total requets received from unigine
         */
        int requestsSocketReceived;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

    private slots:

        /**
         * @brief Slot on settings called
         */
        void on_actionConfiguration_triggered();

    public slots:

        /**
         * @brief Slot when thread has changed state
         * @param _threadId The thread id
         * @param _threadDataChanged The state chagend
         * @param _text The value to set
         */
        void slot_threadStatusChanged(int _threadId, int _threadDataChanged, QString _text);

        /**
         * @brief Slot when socket has changed state
         * @param _socketId The socket id
         * @param _socketDataChanged The data changed
         * @param _text The value to set
         */
        void slot_socketStatusChanged(int _socketId, int _socketDataChanged, QString _text);

        /**
         * @brief Slot when new message arrived
         * @param _message The message
         * @todo Send or receive?
         */
        void slot_newMessage(QString _message, int _id);

        /**
         * @brief Slot when message was send to django
         * @param _id The thread id
         * @param _data The data
         */
        void slot_sendMessage(int _id, QString _data);

        /**
         * @brief Slot when requests was sent
         */
        void slot_requestSent();

        /**
         * @brief Slot when message was sent
         */
        void slot_messageSent();
};

#endif // INTERFACE_H
