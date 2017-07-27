/**
 * \copyright   Copyright © 2014 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * \section LICENSE
 *
 *              This file is part of Relics of Annorath Installer.
 *
 *              Relics of Annorath Installer is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              Relics of Annorath Installer is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with Relics of Annorath Installer.  If not, see <http://www.gnu.org/licenses/>.
 *
 * \brief       JSON Request for data exchange.
 *
 * \file    	jsonrequest.cpp
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

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/jsonrequest.h"
#include "../h/logging.h"

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

JsonRequest::JsonRequest()
{
    networkManager = new QNetworkAccessManager();
    logManager = new QNetworkAccessManager();

    // Connect NetworkManager
    QObject::connect(networkManager, SIGNAL(finished(QNetworkReply*)), this, SLOT(slot_requestResponse(QNetworkReply*)));
    QObject::connect(networkManager,SIGNAL(sslErrors(QNetworkReply*,QList<QSslError>)), this, SLOT(slot_SSLError(QNetworkReply*)));
    //QObject::connect(networkManager, SIGNAL(sslErrors(QNetworkReply*, const QList<QSslError> & )), SLOT(onSslErrors(QNetworkReply*, const QList<QSslError> & )));
    QObject::connect(&timer, SIGNAL(timeout()), this , SLOT(slot_timeout()));
    // Set SSL
    certificates.append(QSslCertificate::fromPath(":/certs/class2.pem"));
    certificates.append(QSslCertificate::fromPath(":/certs/ca.pem"));

    sslConfig.defaultConfiguration();
    sslConfig.setCaCertificates(certificates);

    cfg = NULL;
    
    isLocked = false;

    EnumStrings[0] = QString("request/");
    EnumStrings[1] = QString("login/");
    EnumStrings[2] = QString("launcher/");
    EnumStrings[3] = QString("log_anonymous/");
    EnumStrings[4] = QString("log/");

    setAuthorization = false;
}

void JsonRequest::getConfig()
{
    cfg = &ConfigFile::getInstance();
}

QString JsonRequest::getTextForEnum(int enumVal)
{
    return EnumStrings[enumVal];
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

JsonRequest &JsonRequest::getInstance()
{
    static JsonRequest instance;
    return instance;
}

void JsonRequest::setRequestData(QString _json)
{   
    if(cfg == NULL){
        getConfig();
    }
    
    // Create request
    QJsonDocument doc = QJsonDocument::fromJson(_json.toUtf8());
    QJsonObject jsonObject = doc.object();
    
    QString requestURL = QString(HTTP_JSON_URL);

    // Version check, public
    if((jsonObject["ACTION"] == GUI::Action::LAUNCHER_VERSION_CHECK && 
        jsonObject["CALLER"] == GUI::Caller::LAUNCHER))
    {
        requestURL += getTextForEnum(JsonRequest::STAGE_VERSION);
    }

    // Authenticated requests
    if((cfg->getToken() != "" || cfg->getToken() != NULL) ||
            (jsonObject["ACTION"] == GUI::Action::AUTHENTICATION_TOKEN_REFRESH &&
             jsonObject["CALLER"] == GUI::Caller::AUTHENTICATION))
    {
        requestURL += getTextForEnum(JsonRequest::STAGE_REQUEST);
    }
    
    // Authentication, public
    if(jsonObject["ACTION"] == GUI::Action::AUTHENTICATION_LOGIN &&
        jsonObject["CALLER"] == GUI::Caller::AUTHENTICATION)
    {
        requestURL += getTextForEnum(JsonRequest::STAGE_LOGIN);
    }

    // Lock if we refresh token
    if(jsonObject["ACTION"] == GUI::Action::AUTHENTICATION_TOKEN_REFRESH &&
        jsonObject["CALLER"] == GUI::Caller::AUTHENTICATION)
    {
        isLocked = true;
        doRequest(requestURL, _json, setAuthorization);
    }
    else
    {
        if(isLocked)
        {
            QTimer::singleShot(500, this, SLOT(slot_doRequest(_url, _json, _authorization)));
        }
        else
        {
            doRequest(requestURL, _json, setAuthorization);
        }
    }
}

void JsonRequest::doRequest(QString _url, QString _json, bool _authorization)
{   
    // Set default header
    QByteArray jsonString =  _json.toStdString().c_str();
    request = new QNetworkRequest(_url);
    request->setRawHeader("User-Agent", "Custom ROA Launcher");
    request->setRawHeader("X-Custom-User-Agent", "Custom ROA Launcher 1.0");
    request->setRawHeader("Content-Type", "application/json");
    request->setRawHeader("Content-Length", QByteArray::number(jsonString.size()));
    request->setRawHeader("X-Requested-With", "XMLHttpRequest");
    
    if(_authorization)
    {
        request->setRawHeader("Authorization", QString(QString("Token ") + cfg->getToken()).toStdString().c_str());
    }
    
    // Set SSL
    request->setSslConfiguration(sslConfig);
    
    // Send
    networkManager->post(*request, jsonString);
}


void JsonRequest::setLogData(QString _json)
{
    bool setAuthorization = false;
    
    if(cfg == NULL){
        getConfig();
    }
    
    // Create request
    QJsonDocument doc = QJsonDocument::fromJson(_json.toUtf8());
    QJsonObject jsonObject = doc.object();

    if((jsonObject["LOGGING"].type() != QJsonValue::Undefined) && jsonObject["LOGGING"].toBool())
    {
        QString requestURL = QString(HTTP_JSON_URL);
        
        if(cfg->getToken() != "" || cfg->getToken() != NULL)
        {
            requestURL += getTextForEnum(JsonRequest::STAGE_LOG);
            setAuthorization = true;
        } else
        {
            requestURL += getTextForEnum(JsonRequest::STAGE_LOG_ANONYMOUS);
        }
        
        if(isLocked)
        {
            QTimer::singleShot(500, this, SLOT(slot_doRequest(requestURL, _json, setAuthorization)));
        }
        else
        {
            doRequest(requestURL, _json, setAuthorization);
        }
    }
}

QJsonObject JsonRequest::getJsonObj() const
{
    return jsonObjExt;
}

void JsonRequest::setJsonObj(const QJsonObject &value)
{
    jsonObjExt = value;
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
    //std::cout << _reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt() << std::endl;
    // Check for error
    if(_reply->error() == QNetworkReply::NoError)
    {
        QString data = QString(_reply->readAll());
        if(!(data == "{\"ERROR\":-1}")){
            Logging::addEntry(LOG_LEVEL_INF, "Response received", FUNCTION_NAME);
            Logging::addEntry(LOG_LEVEL_INF, "Data is: " + data, FUNCTION_NAME);
            Logging::addEntry(LOG_LEVEL_INF, "No errors found", FUNCTION_NAME);
        }
        // Convert answer to json
        QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());
        QJsonObject jsonObj = jsonResponse.object();

        //QJsonDocument doc(jsonObj);
        //QString jsonString = doc.toJson(QJsonDocument::Indented);

        //std::cout << jsonString.toStdString() << std::endl;

        // Check json

        if(jsonObj["ERROR"].type() != QJsonValue::Undefined &&
                jsonObj["CODE"].type() != QJsonValue::Undefined &&
                jsonObj["CALLER"].type() != QJsonValue::Undefined &&
                jsonObj["ACTION"].type() != QJsonValue::Undefined &&
                jsonObj["DATA"].type() != QJsonValue::Undefined)
        {
            // Validate for login answer
            if(jsonObj["CALLER"].toInt() == GUI::Caller::AUTHENTICATION &&
                    jsonObj["ACTION"].toInt() == GUI::Action::AUTHENTICATION_LOGIN)
            {
                // Successfully
                if(jsonObj["ERROR"].toInt() == -1 && jsonObj["CODE"].toInt() == GUI::Results::AUTHENTICATION_LOGIN_SUCCESSFULLY)
                {
                    // Get real data and set hash
                    QJsonObject result = jsonObj["DATA"].toObject();

                    if(result["TOKEN"].type() != QJsonValue::Undefined)
                    {
                        Logging::addEntry(LOG_LEVEL_INF, "Login successfully ", FUNCTION_NAME);
                        setAuthorization = true;
                        cfg->setToken(result["TOKEN"].toString());

                        emit responseReceived(jsonObj["CALLER"].toInt(),
                                jsonObj["ACTION"].toInt(),
                                GUI::Results::AUTHENTICATION_LOGIN_SUCCESSFULLY, result["TOKEN"].toString());
                    }
                    else
                    {
                        Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);
                    }
                }
                // Error
                else
                {
                    Logging::addEntry(LOG_LEVEL_INF, "Invalid login credentials found", FUNCTION_NAME);
                    emit responseReceived(jsonObj["CALLER"].toInt(),
                            jsonObj["ACTION"].toInt(),
                            jsonObj["CODE"].toInt(), "");
                }
            }
            // Validate for refresh answer
            else if(jsonObj["CALLER"].toInt() == GUI::Caller::AUTHENTICATION &&
                    jsonObj["ACTION"].toInt() == GUI::Action::AUTHENTICATION_TOKEN_REFRESH)
            {
                // Successfully
                if(jsonObj["ERROR"].toInt() == -1 && jsonObj["CODE"].toInt() == GUI::Results::AUTHENTICATION_TOKEN_REFRESH_SUCCESSFULLY)
                {
                    // Get real data and set hash
                    QJsonObject result = jsonObj["DATA"].toObject();

                    if(result["TOKEN"].type() != QJsonValue::Undefined)
                    {
                        Logging::addEntry(LOG_LEVEL_INF, "Token refresh successfully ", FUNCTION_NAME);
                        cfg->setToken(result["TOKEN"].toString());
                        isLocked = false;

                        emit responseReceived(jsonObj["CALLER"].toInt(),
                                jsonObj["ACTION"].toInt(),
                                GUI::Results::AUTHENTICATION_TOKEN_REFRESH_SUCCESSFULLY, result["TOKEN"].toString());
                        
                    }
                    else
                    {
                        Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);
                    }
                }
                // Error
                else
                {
                    Logging::addEntry(LOG_LEVEL_INF, "Invalid data found for token refresh", FUNCTION_NAME);
                    emit responseReceived(jsonObj["CALLER"].toInt(),
                            jsonObj["ACTION"].toInt(),
                            jsonObj["CODE"].toInt(), "");
                }
            }
            // Validate for settings answer
            else if(jsonObj["CALLER"].toInt() == GUI::Caller::ACCOUNT &&
                    jsonObj["ACTION"].toInt() == GUI::Action::ACCOUNT_SETTINGS_GET)
            {
                // Successfully
                if(jsonObj["ERROR"].toInt() == -1 && jsonObj["CODE"].toInt() == GUI::Results::ACCOUNT_SETTINGS_GET_SUCCESSFULLY)
                {
                    // Get real data and set hash
                    QJsonObject result = jsonObj["DATA"].toObject();

                    // Save for later access throug config class
                    jsonObjExt = result;

                    if(result["GLOBALS"].type() != QJsonValue::Undefined &&
                            result["PROFILES"].type() != QJsonValue::Undefined)
                    {
                        Logging::addEntry(LOG_LEVEL_INF, "Settings get successfully ", FUNCTION_NAME);

                        QJsonObject globals = result["GLOBALS"].toObject();
                        QJsonArray profiles = result["PROFILES"].toArray();

                        if(globals["profile"].type() != QJsonValue::Undefined &&
                                globals["fullscreen"].type() != QJsonValue::Undefined &&
                                globals["vsync"].type() != QJsonValue::Undefined &&
                                globals["resolution"].type() != QJsonValue::Undefined &&
                                globals["gamma"].type() != QJsonValue::Undefined)
                        {
                            // Set values
                            int profileId = globals["profile"].toInt();
                            int fullscreen = globals["fullscreen"].toBool();
                            int vsync = globals["vsync"].toInt();
                            int resolution = globals["resolution"].toInt();
                            double gamma = globals["gamma"].toDouble();

                            if(fullscreen)
                            {
#ifdef Q_OS_LINUX
                                fullscreen = 2;
#else
                                fullscreen = 1;
#endif
                            }

                            for (int profileIndex = 0; profileIndex < profiles.size(); profileIndex++)
                            {
                                QJsonObject profile = profiles[profileIndex].toObject();

                                if(profile["profile_id"].type() != QJsonValue::Undefined &&
                                        profile["multisample"].type() != QJsonValue::Undefined &&
                                        profile["texture_filtering"].type() != QJsonValue::Undefined &&
                                        profile["motion_blur"].type() != QJsonValue::Undefined &&
                                        profile["volumetric_shadows"].type() != QJsonValue::Undefined &&
                                        profile["reflection"].type() != QJsonValue::Undefined &&
                                        profile["occlusion"].type() != QJsonValue::Undefined &&
                                        profile["shader"].type() != QJsonValue::Undefined &&
                                        profile["texture"].type() != QJsonValue::Undefined &&
                                        profile["parallax"].type() != QJsonValue::Undefined &&
                                        profile["refraction"].type() != QJsonValue::Undefined &&
                                        profile["anisotropy"].type() != QJsonValue::Undefined)
                                {
                                    if(profile["profile_id"] == profileId)
                                    {
                                        Logging::addEntry(LOG_LEVEL_INF, "Found profile, setting all found", FUNCTION_NAME);

                                        int multisample = profile["multisample"].toInt();
                                        int textureFiltering = profile["texture_filtering"].toInt();
                                        int motionBlur = profile["motion_blur"].toInt();
                                        int volumetricShadows = profile["volumetric_shadows"].toInt();
                                        int reflection = profile["reflection"].toInt();
                                        int occlusion = profile["occlusion"].toInt();
                                        int shader = profile["shader"].toInt();
                                        int texture = profile["texture"].toInt();
                                        int parallax = profile["parallax"].toInt();
                                        int refraction = profile["refraction"].toInt();
                                        int anisotropy = profile["anisotropy"].toInt();
                                        int width = 0;
                                        int height = 0;

                                        // Check for custom resolution
                                        if(resolution == -1)
                                        {
                                            if(profile["width"].type() != QJsonValue::Undefined &&
                                                    profile["height"].type() != QJsonValue::Undefined)
                                            {
                                                width = profile["width"].toInt();
                                                height = profile["height"].toInt();
                                            }
                                            else
                                            {
                                                Logging::addEntry(LOG_LEVEL_ERR, "Custom resoultion is missing widht/height", FUNCTION_NAME);

                                                // Set full hd as fallback
                                                resolution = 6;
                                            }
                                        }

                                        QString settings = QString::number(fullscreen) + " " // arg 1
                                                + QString::number(vsync) + " " // arg 2
                                                + QString::number(resolution) + " " // arg 3
                                                + QString::number(gamma) + " " // arg 4
                                                + QString::number(multisample) + " " // arg 5
                                                + QString::number(textureFiltering) + " " // arg 6
                                                + QString::number(motionBlur) + " " // arg 7
                                                + QString::number(volumetricShadows) + " " // arg 8
                                                + QString::number(reflection) + " " // arg 9
                                                + QString::number(occlusion) + " " // arg 10
                                                + QString::number(shader) + " " // arg 11
                                                + QString::number(texture) + " " // arg 12
                                                + QString::number(parallax) + " " // arg 13
                                                + QString::number(refraction) + " " // arg 14
                                                + QString::number(anisotropy) + " " // arg 15
                                                + QString::number(width) + " " // arg 16
                                                + QString::number(height) + " " // arg 17
        #ifdef Q_OS_LINUX
                                                + "opengl" + " " // arg 18
        #else
                                                + "direct3d11" + " " // arg 18
        #endif
                                                + QString(jsonResponse.toJson()).replace(" ", "").replace("\n", "").replace("\"", "\\\"");

                                        emit responseReceived(jsonObj["CALLER"].toInt(),
                                                jsonObj["ACTION"].toInt(),
                                                GUI::Results::ACCOUNT_SETTINGS_GET_SUCCESSFULLY, settings);
                                        emit responseReceivedForConfig(jsonObj["CALLER"].toInt(),
                                                jsonObj["ACTION"].toInt(),
                                                GUI::Results::ACCOUNT_SETTINGS_GET_SUCCESSFULLY);

                                        break;
                                    }
                                }
                                else
                                {
                                    Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);

                                    emit responseReceived(jsonObj["CALLER"].toInt(),
                                            jsonObj["ACTION"].toInt(),
                                            GUI::Results::ACCOUNT_SETTINGS_GET_FAILED_MISC, "");
                                }
                            }
                        }
                        else
                        {
                            Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);

                            emit responseReceived(jsonObj["CALLER"].toInt(),
                                    jsonObj["ACTION"].toInt(),
                                    GUI::Results::ACCOUNT_SETTINGS_GET_FAILED_MISC, "");
                        }
                    }
                    else
                    {
                        Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);

                        emit responseReceived(jsonObj["CALLER"].toInt(),
                                jsonObj["ACTION"].toInt(),
                                GUI::Results::ACCOUNT_SETTINGS_GET_FAILED_MISC, "");
                    }
                }
                // Error
                else
                {
                    Logging::addEntry(LOG_LEVEL_INF, "Invalid data found for settings get", FUNCTION_NAME);

                    emit responseReceived(jsonObj["CALLER"].toInt(),
                            jsonObj["ACTION"].toInt(),
                            GUI::Results::ACCOUNT_SETTINGS_GET_FAILED_MISC, "");
                }
            }
            // Validate version check
            else if(jsonObj["CALLER"].toInt() == GUI::Caller::LAUNCHER &&
                    jsonObj["ACTION"].toInt() == GUI::Action::LAUNCHER_VERSION_CHECK)
            {
                // Successfully
                if(jsonObj["ERROR"].toInt() == -1 && jsonObj["CODE"].toInt() == GUI::Results::LAUNCHER_VERSION_CHECK_SUCCESSFULLY)
                {
                    // Get real data and set hash
                    QJsonObject result = jsonObj["DATA"].toObject();

                    if(result["VALUE"].type() != QJsonValue::Undefined)
                    {
                        Logging::addEntry(LOG_LEVEL_INF, "Version check successfully ", FUNCTION_NAME);

                        emit responseReceived(jsonObj["CALLER"].toInt(),
                                jsonObj["ACTION"].toInt(),
                                GUI::Results::LAUNCHER_VERSION_CHECK_SUCCESSFULLY, result["VALUE"].toString());
                    }
                    else
                    {
                        Logging::addEntry(LOG_LEVEL_ERR, "Missing data in JSON", FUNCTION_NAME);

                        QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (Invalid json)");
                        QApplication::quit();
                    }
                }
                // Error
                else
                {
                    Logging::addEntry(LOG_LEVEL_INF, "Unknown error occured", FUNCTION_NAME);

                    QMessageBox::critical(NULL, "Version check error", "There was an error on checking launcher version, please contact the support!");
                    QApplication::quit();
                }
            }
            else if(jsonObj["ERROR"].toInt() == -1){
                //Empty Response for Logging
            }
            else
            {
                Logging::addEntry(LOG_LEVEL_ERR, "Unknown action/caller", FUNCTION_NAME);

                QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (Invalid caller/action)");
                QApplication::quit();
            }
        }
        else
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Invalid json", FUNCTION_NAME);
            QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (Invalid json)");
            QApplication::quit();
        }
    }
    else
    {
        //std::cout << _reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt() << std::endl;
        Logging::addEntry(LOG_LEVEL_ERR, "Network error: ", FUNCTION_NAME);

        QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (Network error)");
        QApplication::quit();
    }

    delete _reply;
}

void JsonRequest::slot_SSLError(QNetworkReply *_reply)
{
    Logging::addEntry(LOG_LEVEL_ERR, "SSL error occured: " + _reply->errorString(), FUNCTION_NAME);
    QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (SSL error)");
    QApplication::quit();
}

void JsonRequest::slot_timeout()
{
    Logging::addEntry(LOG_LEVEL_ERR, "Request Timed out", FUNCTION_NAME);
    emit error(-99,-99,-99);
    QMessageBox::critical(NULL, "Fatal error", "There was an error, please contact the support! (Network Timeout)");
    QApplication::quit();
}

void JsonRequest::onSslErrors(QNetworkReply *_reply, const QList<QSslError> &list)
{
    QMessageBox::critical(NULL, "Fatal error", "SSL problem detected!");
    _reply->ignoreSslErrors();
}

void JsonRequest::slot_doRequest(QString _url, QString _json, bool _authorization)
{
    doRequest(_url, _json, _authorization);
}
