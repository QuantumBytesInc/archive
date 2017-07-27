/**
 * \copyright   Copyright © 2014 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * \section LICENSE
 *
 *              This file is part of Relics of Annorath Launcher.
 *
 *              Relics of Annorath Launcher is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              Relics of Annorath Launcher is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with Relics of Annorath Launcher.  If not, see <http://www.gnu.org/licenses/>.
 *
 * \brief       JSON Request for data exchange.
 *
 * \file    	jsonrequest.h
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2014/10/05 23:10:00 GMT+1
 *
 */

#ifndef JSONREQUEST_H
#define JSONREQUEST_H

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
#include <QMutex>
#include <QTimer>
#include <iostream>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "constants_external.h"
#include "configfile.h"

class ConfigFile;

/**
 * \brief Windows process for threaded installation without locking
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
         * @brief getInstance Singelton implementation
         * @return
         */
        static JsonRequest& getInstance();

        /**
         * @brief Set data for json request
         * @param _json
         */
        void setRequestData(QString _json);

        /**
         * @brief setLogData for logging
         * @param _json
         */
        void setLogData(QString _json);

        QJsonObject getJsonObj() const;
        void setJsonObj(const QJsonObject &value);

private:

        /******************************************************************************/
        /*                                                                            */
        /*    Enums                                                                   */
        /*                                                                            */
        /******************************************************************************/

        enum Enum{
            STAGE_REQUEST,
            STAGE_LOGIN,
            STAGE_VERSION,
            STAGE_LOG_ANONYMOUS,
            STAGE_LOG
        };

        /******************************************************************************/
        /*                                                                            */
        /*    Members                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief cfg ConfigFile
         */
        ConfigFile *cfg;

        /**
         * @brief Constructor
         */
        JsonRequest();

        /**
         * @brief The network access manager
         */
        QNetworkAccessManager *networkManager;

        /**
         * @brief logManager to send logs
         */
        QNetworkAccessManager *logManager;

        /**
         * @brief SSL configuration
         */
        QSslConfiguration sslConfig;

        /**
         * @brief Trusted certificate list
         */
        QList<QSslCertificate> certificates;

        QNetworkRequest *request;

        QJsonObject jsonObjExt;

        QMutex mutex;

        bool setAuthorization;

        /**
         * @brief EnumStrings mapping
         */
        QString EnumStrings[5];

        /**
         * \brief A simply timer used for delay the checking
         */
        QTimer timer;
        
        /**
         * \brief Lock to protect against race condtion on token refresh
         */
        bool isLocked;

        /**
         * \brief A simply timer used for delay the checking
         */
        void getConfig();
        
        /**
         * @brief Send request to json backend
         * @param _url The target url
         * @param _json The json data
         * @param _authorization Is authenticated or not
         */
        void doRequest(QString _url, QString _json, bool _authorization);

        /******************************************************************************/
        /*                                                                            */
        /*    Methods                                                                 */
        /*                                                                            */
        /******************************************************************************/

        QString getTextForEnum( int enumVal );

    private slots:

        /******************************************************************************/
        /*                                                                            */
        /*    Public slots                                                            */
        /*                                                                            */
        /******************************************************************************/

        void slot_requestResponse(QNetworkReply* _reply);
        void slot_SSLError(QNetworkReply* _reply);
        void slot_timeout();
        void onSslErrors(QNetworkReply*_reply, const QList<QSslError> & list);
        void slot_doRequest(QString _url, QString _json, bool _authorization);

    signals:

        /******************************************************************************/
        /*                                                                            */
        /*    Signals                                                                 */
        /*                                                                            */
        /******************************************************************************/

        /**
         * @brief Signal on response received
         * @param _mode Return code
         * @param _data The data
         */
        void responseReceived(int _caller, int _action, int _returnCode, QString _data);

        /**
         * @brief responseReceivedForConfig
         * @param _caller
         * @param _action
         * @param _returnCode
         */
        void responseReceivedForConfig(int _caller, int _action, int _returnCode);

        /**
         * @brief signals network error
         */
        void error(int _caller, int _action, int _returnCode);
};

#endif // JSONREQUEST_H
