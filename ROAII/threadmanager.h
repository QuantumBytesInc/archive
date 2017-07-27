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
 * @brief       Thread manager for http requets.
 *
 * @file    	threadmanager.h
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

#ifndef THREADMANAGER_H
#define THREADMANAGER_H

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
#include <QString>
#include <QMap>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "jsonrequest.h"


/**
 * @brief Managing all http requests and communication between interface instance.
 */
class ThreadManager : public QObject
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
         * @param _threadAmount Amount of the working threads
         */
        ThreadManager(int _threadAmount, QString _url);

        /**
         * @brief Start thread manager
         */
        void start();

        /**
         * @brief Set work
         * @param _message The message to process
         */
        void setWork(QString _message, int _id);

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The url for the request
         */
        QString url;

        /**
         * @brief All threads for status access
         */
        QMap<int, JsonRequest*> requests;

        /**
         * @brief Thread amount
         */
        int threadAmount;

        /**
         * @brief Queue size of the last jsonrequest instance
         */
        int size;

        /**
         * @brief Log object
         */
        Logger *log;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Set up the async sockets for sending and receving
         */
        void setSockets();

        /**
         * @brief Set up the threads for the work
         */
        void setThreads(int _threadId);

    private slots:

        /**
         * @brief Slot on state changed
         * @param _threadId The thread id
         * @param _threadDataId The thread data id
         * @param _text The data to set
         */
        void slot_setStateChanged(int _threadId, int _threadDataId, QString _text);

        /**
         * @brief Slot on response received
         * @param _threadId The thread id
         * @param _message The message
         */
        void slot_propagateResponse(int _threadId, QString _message);

        /**
         * @brief Slot on request sent
         */
        void slot_requestSent();


    signals:

        /**
         * @brief Signal on thread change
         * @param _threadId The thread id
         * @param _threadDataChanged The changed data id
         * @param _text The data to set
         */
        void signal_threadChanged(int _threadId, int _threadDataChanged, QString _text);

        /**
         * @brief Signal on work done
         * @param _threadId The thread id
         * @param _message The message
         */
        void signal_workDone(int _threadId, QString _message);

        /**
         * @brief Signal on request sent
         */
        void signal_requestSent();

};

#endif // THREADMANAGER_H
