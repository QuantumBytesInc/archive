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
 * @brief       Shared object for data holding.
 *
 * @file    	sharedobject.h
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

#ifndef SHAREDOBJECT_H
#define SHAREDOBJECT_H

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
#include <QString>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logger.h"


/**
 * @brief Shared object for saving data and event handling on TCP-Socket base.
 */
class SharedObject : public QObject
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
         */
        SharedObject()
        {
        }

        /**
         * @brief Set data
         * @param _data The data
         */
        void setData(QString _data)
        {
            data = _data;
        }

        /**
         * @brief Send signal for new message
         */
        void sendSignal()
        {
            emit signal_newMessage(data);
        }

        /**
         * @brief Send signal for write done
         */
        void sendSignalDone()
        {
            emit signal_sendingDone();
        }

        /**
         * @brief Send signal read error
         * @param _error
         */
        void sendReadError(QString _error)
        {
            emit signal_readError(_error);
        }

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The data
         */
        QString data;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

    signals:

        /**
         * @brief Signal new message received
         * @param _message  The message
         */
        void signal_newMessage(QString _message);

        /**
         * @brief Signal writing done
         */
        void signal_sendingDone();

        /**
         * @brief Signal read error
         * @param _error
         */
        void signal_readError(QString _error);
};

#endif // SHAREDOBJECT_H
