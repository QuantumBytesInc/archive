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
 * @brief       TCP connections for async read and write.
 *
 * @file    	tcpconnection.h
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

#ifndef TCPCONNECTION_H
#define TCPCONNECTION_H

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
#include "sharedobject.h"
#include "logger.h"


using boost::asio::ip::tcp;

/**
 * @brief TCP connection class for async read and write.
 */
class tcp_connection : public boost::enable_shared_from_this<tcp_connection>
{
    public:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        typedef boost::shared_ptr<tcp_connection> pointer;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Create pointer
         * @param _io_service The io_service
         * @return Pointer to new instance
         */
        static pointer create(boost::asio::io_service& _io_service)
        {
            return pointer(new tcp_connection(_io_service));
        }

        /**
         * @brief Get socket
         * @return The socket
         */
        tcp::socket& socket()
        {
            return socket_;
        }

        /**
         * @brief Start reading data
         * @param _object The shared object for data storing
         */
        void startReading(SharedObject* _object)
        {
            if(log != NULL)
            {
                log->addEntry(LOG_LEVEL_INF, "Starting async_read_until", __PRETTY_FUNCTION__);
            }

            // Set internal object
            object = _object;

            // Create buffer
            //if(_data != NULL)
            //    delete _data;
            _data = new boost::asio::streambuf();

            // Start async read
            boost::asio::async_read_until(socket_, *_data, "=[=_]", boost::bind(  &tcp_connection::handle_readDone, shared_from_this(), boost::asio::placeholders::error, boost::asio::placeholders::bytes_transferred));
        }

        /**
         * @brief Start writing data
         * @param _message The data to send
         * @param _object Shared object for state handling
         */
        void startWriting(QString _message, SharedObject* _object)
        {
            if(log != NULL)
            {
                log->addEntry(LOG_LEVEL_INF, "Starting async_write", __PRETTY_FUNCTION__);
            }
            // Set internal object
            object = _object;

            // Call this, else we have crashes after a while
            shared_from_this();

            // Start writing
            boost::asio::async_write(socket_, boost::asio::buffer(_message.toStdString()),
                                     boost::bind(&tcp_connection::handle_writeDone, shared_from_this(),
                                                 boost::asio::placeholders::error,
                                                 boost::asio::placeholders::bytes_transferred));
        }

        /**
         * @brief Set logger
         * @param _log The logger
         */
        void setLog(Logger *_log)
        {
            log = _log;
        }

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The socket
         */
        tcp::socket socket_;

        /**
         * @brief The message
         */
        std::string message_;

        /**
         * @brief The buffer
         */
        boost::asio::streambuf *_data;

        /**
         * @brief The data storage object
         */
        SharedObject* object;

        /**
         * @brief The logger
         */
        Logger *log;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Constructor
         * @param _io_service The io service
         */
        tcp_connection(boost::asio::io_service& _io_service)
            : socket_(_io_service)
        {
            log = NULL;
        }


        /**
         * @brief Handle on writing done
         * @param _error The error
         */
        void handle_writeDone(const boost::system::error_code& _error, size_t)
        {
            if(log != NULL)
            {
                if(!_error)
                {
                    log->addEntry(LOG_LEVEL_INF, "Message successfully sent", __PRETTY_FUNCTION__);
                }
                else
                {
                    log->addEntry(LOG_LEVEL_ERR, "Error on message send: " + QString(_error.message().c_str()), __PRETTY_FUNCTION__);
                }
            }

            object->sendSignalDone();
        }

        /**
         * @brief Handle on read done
         * @param _error The error
         */
        void handle_readDone(const boost::system::error_code& _error, size_t)
        {
            // Log
            if(log != NULL)
            {
                if(!_error)
                {
                    log->addEntry(LOG_LEVEL_INF, "Message successfully read", __PRETTY_FUNCTION__);
                }
                else
                {
                    log->addEntry(LOG_LEVEL_ERR, "Error on message send: " + QString(_error.message().c_str()), __PRETTY_FUNCTION__);
                }
            }

            // Save data
            object->setData(QString( boost::asio::buffer_cast<const char *> ( _data->data() )));

            delete _data;

            object->sendSignal();
        }

    signals:

        /**
         * @brief Signal on new message
         * @param _message The message
         */
        void signal_newMessage(QString _message);
};

#endif // TCPCONNECTION_H
