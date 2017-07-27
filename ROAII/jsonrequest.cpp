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
 * @file    	jsonrequest.cpp
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
#include "jsonrequest.h"
#include "logger.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

JsonRequest::JsonRequest(int _threadId, QString _url)
{
    // Set id and url
    threadId = _threadId;
    url = QUrl(_url);

    // Create log file
    log = new Logger(QString("ThreadWorker_" + QString::number(threadId)));
    log->addEntry(LOG_LEVEL_INF, "Creating worker", __PRETTY_FUNCTION__);

    // Init values
    totalWorkDone = 0;
    errors = 0;
    isBusy = false;

    // Create network manager
    networkManager = new QNetworkAccessManager();

    // Connect NetworkManager
    QObject::connect(networkManager, SIGNAL(finished(QNetworkReply*)), this, SLOT(slot_requestResponse(QNetworkReply*)));
    QObject::connect(networkManager,SIGNAL(sslErrors(QNetworkReply*,QList<QSslError>)), this, SLOT(slot_SSLError(QNetworkReply*)));
    networkManager->setNetworkAccessible(QNetworkAccessManager::Accessible);
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void JsonRequest::prepare()
{
    log->addEntry(LOG_LEVEL_INF,"Preparing worker", __PRETTY_FUNCTION__);

    // Set SSL
    certificates.append(QSslCertificate::fromPath(":/certs/class2.pem"));
    certificates.append(QSslCertificate::fromPath(":/certs/ca.pem"));

    sslConfig.defaultConfiguration();
    sslConfig.setCaCertificates(certificates);

    // Init values
    emit stateChanged(threadId, THREAD_STATE_OPEN, QString::number(work.size()));
    emit stateChanged(threadId, THREAD_STATE_PROCESSED, QString::number(0));
    emit stateChanged(threadId, THREAD_STATE_ERRORS, QString::number(0));
    emit stateChanged(threadId, THREAD_STATE_STATE, "Ready");
    emit stateChanged(threadId, THREAD_STATE_ID, QString::number(threadId));
}

void JsonRequest::setRequestData(QString _json, int _id)
{
    if(!isBusy)
    {
        log->addEntry(LOG_LEVEL_INF, "Socket is free, sending: " + _json, __PRETTY_FUNCTION__);

        emit stateChanged(threadId, THREAD_STATE_STATE, "Sending request");

        // Start timer
        timer.start();

        // Set busy
        isBusy = true;

        // Set work id
        currentId = _id;

        // Prepare
        QByteArray jsonString = _json.toStdString().c_str();
        QByteArray postDataSize = QByteArray::number(jsonString.size());

        // Create request
        request = new QNetworkRequest(url);
        request->setRawHeader("User-Agent", "Custom ROA Launcher");
        request->setRawHeader("X-Custom-User-Agent", "Custom ROA Launcher 1.0");
        request->setRawHeader("Content-Type", "application/json; charset=UTF-8");
        request->setRawHeader("Content-Length", postDataSize);
        request->setRawHeader("X-Requested-With", "XMLHttpRequest");

        // Set SSL
        request->setSslConfiguration(sslConfig);

        // Post request
        networkManager->post(*request, jsonString);

        emit signal_requestSent();
    }
    else
    {
        log->addEntry(LOG_LEVEL_INF, "Socket is not free, queuing: " + _json, __PRETTY_FUNCTION__);
        work.append(qMakePair(_json, _id));
    }

    emit stateChanged(threadId, THREAD_STATE_OPEN, QString::number(work.size()));
}

int JsonRequest::getWorkQueue()
{
    return work.size();
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*    Slots                                                                   */
/*                                                                            */
/******************************************************************************/

void JsonRequest::slot_requestResponse(QNetworkReply* _reply)
{
    emit stateChanged(threadId, THREAD_STATE_STATE, "Receving request");

    log->addEntry(LOG_LEVEL_INF, "Response received", __PRETTY_FUNCTION__);

    // Check for error
    if(_reply->error() == QNetworkReply::NoError)
    {
        log->addEntry(LOG_LEVEL_INF, "No errors found", __PRETTY_FUNCTION__);

        totalWorkDone++;
        emit stateChanged(threadId, THREAD_STATE_PROCESSED, QString::number(totalWorkDone));

        // Convert answer to json
        QString data = _reply->readAll();
        QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());
        QJsonObject jsonObj = jsonResponse.object();

        log->addEntry(LOG_LEVEL_INF, "Answer is: " + data, __PRETTY_FUNCTION__);

        // Check json
        if(jsonObj["DATA"].type() != QJsonValue::Undefined)
        {
            //jsonResponse = QJsonDocument::fromJson(jsonObj["content"].toString().toStdString().c_str());
            emit responseReceived(currentId, QJsonDocument(jsonObj).toJson(QJsonDocument::Compact));
        }
        else
        {
            log->addEntry(LOG_LEVEL_ERR, "Invalid json: " + jsonResponse.toVariant().toString(), __PRETTY_FUNCTION__);

            errors++;
            emit stateChanged(threadId, THREAD_STATE_ERRORS, QString::number(errors));
        }
    }
    else
    {
        log->addEntry(LOG_LEVEL_ERR, "Network error: " + _reply->errorString(), __PRETTY_FUNCTION__);

        errors++;
        emit stateChanged(threadId, THREAD_STATE_ERRORS, QString::number(errors));
    }

    // Cleanup
    _reply = NULL;
    if(_reply == NULL)
        delete _reply;
    request = NULL;
    if(_reply == NULL)
        delete request;

    // Check for future work
    if(work.size() > 0)
    {
        log->addEntry(LOG_LEVEL_INF, "More work to do, setting next one", __PRETTY_FUNCTION__);

        isBusy = false;
        setRequestData(work.first().first, work.first().second);
        work.removeFirst();
    }
    else
    {
        log->addEntry(LOG_LEVEL_INF, "All work done, gonna play", __PRETTY_FUNCTION__);

        isBusy = false;
        work.clear();
        emit stateChanged(threadId, THREAD_STATE_STATE, "Ready");
    }

    emit stateChanged(threadId, THREAD_STATE_OPEN, QString::number(work.size()));

    log->addEntry(LOG_LEVEL_INF, "Time used for request: " + QString::number(timer.elapsed()), __PRETTY_FUNCTION__);
}

void JsonRequest::slot_SSLError(QNetworkReply *_reply)
{
    log->addEntry(LOG_LEVEL_ERR, "SSL error occured: " + _reply->errorString(), __PRETTY_FUNCTION__);
    _reply->ignoreSslErrors();
}
