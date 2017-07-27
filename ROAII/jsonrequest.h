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
 * @brief       Class for handling HTTP related requests, does a json-post-request
 *
 * @file    	jsonrequest.h
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

#ifndef JSONREQUEST_H
#define JSONREQUEST_H

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
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QtNetwork>
#include <QMessageBox>
#include <QVector>
#include <QPair>
#include <QTimer>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logger.h"

/**
 * @brief HTTP wrapper for json-requets to django backend.
 */
class JsonRequest : public QObject
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
        JsonRequest(int _threadId, QString _url);

        /**
         * @brief Prepare json request
         */
        void prepare();

        /**
         * @brief Set data for json request
         * @param _json
         */
        void setRequestData(QString _json, int _id);

        /**
         * @brief Current work queue
         * @return Amount of waiting work
         */
        int getWorkQueue();

    private:

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief The network access manager
         */
        QNetworkAccessManager *networkManager;

        /**
         * @brief SSL configuration
         */
        QSslConfiguration sslConfig;

        /**
         * @brief Trusted certificate list
         */
        QList<QSslCertificate> certificates;

        /**
         * @brief The request
         */
        QNetworkRequest *request;

        /**
         * @brief Request url
         */
        QUrl url;

        /**
         * @brief Timer for performance measurements
         */
        QElapsedTimer timer;

        /**
         * @brief The log file
         */
        Logger *log;

        /**
         * @brief Queued messages to process
         */
        QVector<QPair<QString, int> > work;

        /**
         * @brief The current work id
         */
        int threadId;

        /**
         * @brief Total requests processed
         */
        int totalWorkDone;

        /**
         * @brief Total errors
         */
        int errors;

        /**
         * @brief Is busy flag
         */
        bool isBusy;

        /**
         * @brief The worker id
         */
        int currentId;

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

    private slots:

        /**
         * @brief Slot when response was received
         * @param _reply The reply data
         */
        void slot_requestResponse(QNetworkReply* _reply);

        /**
         * @brief Slot when ssl error occured
         * @param _reply The reply data
         */
        void slot_SSLError(QNetworkReply* _reply);

    signals:

        /**
         * @brief Signal on response received
         * @param _mode Return code
         * @param _data The data
         */
        void responseReceived(int _socketId, QString _data);

        /**
         * @brief Signal on state changed
         * @param _threadId The thread id
         * @param _threadDataChanged The thread data id
         * @param _text The text
         */
        void stateChanged(int _threadId, int _threadDataChanged, QString _text);

        /**
         * @brief Signal on request was sent
         */
        void signal_requestSent();
};

#endif // JSONREQUEST_H
