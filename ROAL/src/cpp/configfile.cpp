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
 * \file    	configfile.cpp
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Lerentis <lerentis@burntbunch.org>
 *
 * \date        12.02.2015 19:20 GMT+1
 *
 */

#include "../h/configfile.h"

ConfigFile::ConfigFile()
{
    jsonRequest = &JsonRequest::getInstance();
    connect(jsonRequest, SIGNAL(error(int,int,int)), this, SLOT(receaved(int,int,int)));
    connect(jsonRequest, SIGNAL(responseReceivedForConfig(int, int, int)), this, SLOT(receaved(int, int, int)));
    setFileName("UserConfig");
    readFromFile();
}

ConfigFile &ConfigFile::getInstance()
{
    static ConfigFile instance;
    return instance;
}

bool ConfigFile::readFromFile()
{
    QFile loadFile(fileName);

    if(!loadFile.exists())
    {
        if(!writeToFile())
        {
            qWarning("Can't write to file!");
            return false;
        }
    }
    if (!loadFile.open(QIODevice::ReadOnly))
    {
        qWarning("Couldn't open save file.");
        return false;
    }

    QByteArray saveData = loadFile.readAll();

    QJsonDocument loadDoc(QJsonDocument::fromJson(saveData));
    jsonObject = loadDoc.object();

    deserialize();

    return true;
}

bool ConfigFile::writeToFile()
{
    QFile saveFile(fileName);

        if(saveFile.open(QIODevice::WriteOnly)){
            serialize();

            QJsonDocument sv(jsonObject);

            saveFile.write(sv.toJson());

            return true;
            }
        else{
            qWarning("Could not write to file");
        }
        return false;
}

void ConfigFile::serialize()
{
    // Later used for controls saving
    QJsonArray jsonCtrl;

    if(QSysInfo::prettyProductName().contains("Linux"))
    {
        jsonObject.insert("OpenGl",QJsonValue(this->getGraphicLib()));
    }
    if(QSysInfo::prettyProductName().contains("Windows"))
    {
        jsonObject.insert("Direct3d11",QJsonValue(this->getGraphicLib()));
    }
    //GLOBALS
    jsonObject.insert("fullscreen",QJsonValue(fullscreen));
    jsonObject.insert("gamma",QJsonValue(gamma));
    jsonObject.insert("height",QJsonValue(height));
    jsonObject.insert("language",QJsonValue(language));
    jsonObject.insert("mouse_sensitivity",QJsonValue(mouse_sensitivity));
    jsonObject.insert("profile",QJsonValue(profile));
    jsonObject.insert("resolution",QJsonValue(resolution));
    jsonObject.insert("sfx",QJsonValue(sfx));
    jsonObject.insert("view_distance",QJsonValue(view_distance));
    jsonObject.insert("volume_ambient",QJsonValue(volume_ambient));
    jsonObject.insert("volume_character",QJsonValue(volume_character));
    jsonObject.insert("volume_effects",QJsonValue(volume_effects));
    jsonObject.insert("volume_master",QJsonValue(volume_master));
    jsonObject.insert("volume_music",QJsonValue(volume_music));
    jsonObject.insert("vsync",QJsonValue(vsync));
    jsonObject.insert("width",QJsonValue(width));

    //PROFILES
    jsonObject.insert("anisotropy",QJsonValue(anisotropy));
    jsonObject.insert("motion_blur",QJsonValue(motion_blur));
    jsonObject.insert("multisample",QJsonValue(multisample));
    jsonObject.insert("occlusion",QJsonValue(occlusion));
    jsonObject.insert("parallax",QJsonValue(parallax));
    jsonObject.insert("profile_id",QJsonValue(profile_id));
    jsonObject.insert("profile_name",QJsonValue(profile_name));
    jsonObject.insert("reflection",QJsonValue(reflection));
    jsonObject.insert("refraction",QJsonValue(refraction));
    jsonObject.insert("shader",QJsonValue(shader));
    jsonObject.insert("texture",QJsonValue(texture));
    jsonObject.insert("texture_filtering",QJsonValue(texture_filtering));
    jsonObject.insert("volumetric_shadows",QJsonValue(volumetric_shadows));

    //CONTROLS
    for(Controls& c : controls)
    {
        jsonCtrl.append(QJsonValue(c.toJSON()));
    }

    // Add controls array to json
    jsonObject.insert("controls", jsonCtrl);

    //TOKEN
    jsonObject.insert("Token",QJsonValue(this->getToken()));
    jsonObject.insert("Dummy",QJsonValue(dummy));
}

void ConfigFile::deserialize()
{
    if(QSysInfo::prettyProductName().contains("Linux"))
    {
        graphicLib                  =   jsonObject["OpenGl"].toString();
    }
    if(QSysInfo::prettyProductName().contains("Windows"))
    {
        graphicLib                  =   jsonObject["Direct3d11"].toString();
    }
    fullscreen              =   jsonObject["fullscreen"].toBool();
    gamma                   =   jsonObject["gamma"].toInt();
    height                  =   jsonObject["height"].toInt();
    language                =   jsonObject["language"].toInt();
    mouse_sensitivity       =   jsonObject["mouse_sensitivity"].toInt();
    profile                 =   jsonObject["profile"].toInt();
    resolution              =   jsonObject["resolution"].toInt();
    sfx                     =   jsonObject["sfx"].toInt();
    view_distance           =   jsonObject["view_distance"].toInt();
    volume_ambient          =   jsonObject["volume_ambient"].toInt();
    volume_character        =   jsonObject["volume_character"].toInt();
    volume_effects          =   jsonObject["volume_effects"].toInt();
    volume_master           =   jsonObject["volume_master"].toInt();
    volume_music            =   jsonObject["volume_music"].toInt();
    vsync                   =   jsonObject["vsync"].toBool();
    width                   =   jsonObject["width"].toInt();

    anisotropy              =   jsonObject["anisotropy"].toInt();
    motion_blur             =   jsonObject["motion_blur"].toBool();
    multisample             =   jsonObject["multisample"].toInt();
    occlusion               =   jsonObject["occlusion"].toInt();
    parallax                =   jsonObject["parallax"].toBool();
    profile_id              =   jsonObject["profile_id"].toInt();
    profile_name            =   jsonObject["profile_name"].toString();
    reflection              =   jsonObject["reflection"].toBool();
    refraction              =   jsonObject["refraction"].toBool();
    shader                  =   jsonObject["shader"].toInt();
    texture                 =   jsonObject["texture"].toInt();
    texture_filtering       =   jsonObject["texture_filtering"].toBool();
    volumetric_shadows      =   jsonObject["volumetric_shadows"].toBool();

    //CONTROLS
    QJsonArray controls_array = jsonObject["controls"].toArray();

    for(int i=0; i<controls_array.size();i++)
    {
        QJsonObject con = controls_array[i].toObject();

        if(con["key"].type() != QJsonValue::Undefined &&
                con["label"].type() != QJsonValue::Undefined &&
                con["name"].type() != QJsonValue::Undefined &&
                con["value"].type() != QJsonValue::Undefined)
        {
            // Set values
            int key = con["key"].toInt();
            QString label = con["label"].toString();
            QString name = con["name"].toString();
            int value = con["value"].toInt();
            controls.push_back(Controls(key,label,name,value));
        }
    }

    token                   =   jsonObject["Token"].toString();
    dummy                   =   jsonObject["Dummy"].toString();
}

void ConfigFile::error_receaved()
{

}

void ConfigFile::receaved(int caller, int action, int returnCode)
{
    // Check for caller and action
    if((caller == GUI::Caller::ACCOUNT && action == GUI::Action::ACCOUNT_SETTINGS_GET) && returnCode == 0)
    {
        this->setJson(jsonRequest->getJsonObj());

        QJsonObject tmp = json["GLOBALS"].toObject();

        this->setFullscreen(tmp["fullscreen"].toBool());
        this->setGamma(tmp["gamma"].toInt());
        this->setHeight(tmp["height"].toInt());
        this->setLanguage(tmp["language"].toInt());
        this->setMouse_sensitivity(tmp["mouse_sensitivity"].toInt());
        this->setProfile(tmp["profile"].toInt());
        this->setResolution(tmp["resolution"].toInt());
        this->setSfx(tmp["sfx"].toInt());
        this->setView_distance(tmp["view_distance"].toInt());
        this->setVolume_ambient(tmp["volume_ambient"].toInt());
        this->setVolume_character(tmp["volume_character"].toInt());
        this->setVolume_effects(tmp["volume_effects"].toInt());
        this->setVolume_master(tmp["volume_master"].toInt());
        this->setVolume_music(tmp["volume_music"].toInt());
        this->setVsync(tmp["vsync"].toBool());
        this->setWidth(tmp["width"].toInt());

        // Only get first profile
        tmp = json["PROFILES"].toArray()[0].toObject();

        this->setAnisotropy(tmp["anisotropy"].toInt());
        this->setMotion_blur(tmp["motion_blur"].toBool());
        this->setMultisample(tmp["multisample"].toInt());
        this->setOcclusion(tmp["occlusion"].toInt());
        this->setParallax(tmp["parallax"].toBool());
        this->setProfile_id(tmp["profile_id"].toInt());
        this->setProfile_name(QString(tmp["profile_name"].toString()));
        this->setReflection(tmp["reflection"].toBool());
        this->setRefraction(tmp["refraction"].toBool());
        this->setShader(tmp["shader"].toInt());
        this->setTexture(tmp["texture"].toInt());
        this->setTexture_filtering(tmp["texture_filtering"].toBool());
        this->setVolumetric_shadows(tmp["volumetric_shadows"].toBool());

        QJsonArray controls_array = json["CONTROLS"].toArray();

        for(int i=0; i<controls_array.size();i++)
        {
            QJsonObject con = controls_array[i].toObject();

            if(con["key"].type() != QJsonValue::Undefined &&
                    con["label"].type() != QJsonValue::Undefined &&
                    con["name"].type() != QJsonValue::Undefined &&
                    con["value"].type() != QJsonValue::Undefined)
            {
                // Set values
                int key = con["key"].toInt();
                QString label = con["label"].toString();
                QString name = con["name"].toString();
                int value = con["value"].toInt();
                controls.push_back(Controls(key,label,name,value));
            }
        }
        writeToFile();
    }
}
QString ConfigFile::getDummy() const
{
    return dummy;
}

void ConfigFile::setDummy(const QString &value)
{
    dummy = value;
}
QJsonObject ConfigFile::getJson() const
{
    return json;
}

void ConfigFile::setJson(const QJsonObject &value)
{
    json = value;
}
bool ConfigFile::getFullscreen() const
{
    return fullscreen;
}

void ConfigFile::setFullscreen(bool value)
{
    fullscreen = value;
}
int ConfigFile::getGamma() const
{
    return gamma;
}

void ConfigFile::setGamma(int value)
{
    gamma = value;
}
int ConfigFile::getHeight() const
{
    return height;
}

void ConfigFile::setHeight(int value)
{
    height = value;
}
int ConfigFile::getLanguage() const
{
    return language;
}

void ConfigFile::setLanguage(int value)
{
    language = value;
}
int ConfigFile::getMouse_sensitivity() const
{
    return mouse_sensitivity;
}

void ConfigFile::setMouse_sensitivity(int value)
{
    mouse_sensitivity = value;
}
int ConfigFile::getProfile() const
{
    return profile;
}

void ConfigFile::setProfile(int value)
{
    profile = value;
}
int ConfigFile::getResolution() const
{
    return resolution;
}

void ConfigFile::setResolution(int value)
{
    resolution = value;
}
int ConfigFile::getSfx() const
{
    return sfx;
}

void ConfigFile::setSfx(int value)
{
    sfx = value;
}
int ConfigFile::getView_distance() const
{
    return view_distance;
}

void ConfigFile::setView_distance(int value)
{
    view_distance = value;
}
int ConfigFile::getVolume_ambient() const
{
    return volume_ambient;
}

void ConfigFile::setVolume_ambient(int value)
{
    volume_ambient = value;
}
int ConfigFile::getVolume_character() const
{
    return volume_character;
}

void ConfigFile::setVolume_character(int value)
{
    volume_character = value;
}
int ConfigFile::getVolume_effects() const
{
    return volume_effects;
}

void ConfigFile::setVolume_effects(int value)
{
    volume_effects = value;
}
int ConfigFile::getVolume_master() const
{
    return volume_master;
}

void ConfigFile::setVolume_master(int value)
{
    volume_master = value;
}
int ConfigFile::getVolume_music() const
{
    return volume_music;
}

void ConfigFile::setVolume_music(int value)
{
    volume_music = value;
}
bool ConfigFile::getVsync() const
{
    return vsync;
}

void ConfigFile::setVsync(bool value)
{
    vsync = value;
}
int ConfigFile::getWidth() const
{
    return width;
}

void ConfigFile::setWidth(int value)
{
    width = value;
}
int ConfigFile::getAnisotropy() const
{
    return anisotropy;
}

void ConfigFile::setAnisotropy(int value)
{
    anisotropy = value;
}
bool ConfigFile::getMotion_blur() const
{
    return motion_blur;
}

void ConfigFile::setMotion_blur(bool value)
{
    motion_blur = value;
}
int ConfigFile::getMultisample() const
{
    return multisample;
}

void ConfigFile::setMultisample(int value)
{
    multisample = value;
}
int ConfigFile::getOcclusion() const
{
    return occlusion;
}

void ConfigFile::setOcclusion(int value)
{
    occlusion = value;
}
int ConfigFile::getProfile_id() const
{
    return profile_id;
}

void ConfigFile::setProfile_id(int value)
{
    profile_id = value;
}
QString ConfigFile::getProfile_name() const
{
    return profile_name;
}

void ConfigFile::setProfile_name(const QString &value)
{
    profile_name = value;
}
int ConfigFile::getShader() const
{
    return shader;
}

void ConfigFile::setShader(int value)
{
    shader = value;
}
int ConfigFile::getTexture() const
{
    return texture;
}

void ConfigFile::setTexture(int value)
{
    texture = value;
}
bool ConfigFile::getTexture_filtering() const
{
    return texture_filtering;
}

void ConfigFile::setTexture_filtering(bool value)
{
    texture_filtering = value;
}
bool ConfigFile::getVolumetric_shadows() const
{
    return volumetric_shadows;
}

void ConfigFile::setVolumetric_shadows(bool value)
{
    volumetric_shadows = value;
}
std::vector<Controls> ConfigFile::getControls() const
{
    return controls;
}

void ConfigFile::setControls(const std::vector<Controls> &value)
{
    controls = value;
}

QString ConfigFile::getToken() const
{
    return token;
}

void ConfigFile::setToken(const QString &value)
{
    token = value;
}

QString ConfigFile::getGraphicLib() const
{
    if(QSysInfo::prettyProductName().contains("Linux"))
        return "opengl";
    if(QSysInfo::prettyProductName().contains("Windows"))
        return "direct3dll";
    return "opengl";
}

void ConfigFile::setGraphicLib(const QString &value)
{
    graphicLib = value;
}

int ConfigFile::getRefraction() const
{
    return refraction;
}

void ConfigFile::setRefraction(int value)
{
    refraction = value;
}

int ConfigFile::getParallax() const
{
    return parallax;
}

void ConfigFile::setParallax(int value)
{
    parallax = value;
}

int ConfigFile::getReflection() const
{
    return reflection;
}

void ConfigFile::setReflection(int value)
{
    reflection = value;
}

QString ConfigFile::getFileName()
{
    return fileName;
}

void ConfigFile::setFileName(QString fileName)
{
    this->fileName = fileName;
}

void ConfigFile::clear()
{
    QFile saveFile(fileName);

    if(!saveFile.remove()){
        qWarning("Could not delete SaveFile");
       }
}

ConfigFile::~ConfigFile()
{

}
