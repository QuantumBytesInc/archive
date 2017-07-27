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
 * \file    	configfile.h
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

#ifndef CONFIGFILE_H
#define CONFIGFILE_H

/******************************************************************************/
/*                                                                            */
/*    C/C++ includes                                                          */
/*                                                                            */
/******************************************************************************/

#include <vector>

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/

#include <QJsonObject>
#include <QString>
#include <QSysInfo>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/

#include "src/h/jsonrequest.h"
#include "src/h/controls.h"

class JsonRequest;

class ConfigFile : public QObject
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
     * @return pointer to ConfigFile
     */
    static ConfigFile& getInstance();

    /**
     * @brief readFromFile read from the filesystem
     * @return status of success
     */
    bool readFromFile();

    /**
     * @brief writeToFile write the JSON ConfigFile to the filesystem
     * @return status of success
     */
    bool writeToFile();

    /**
     * @brief setFileName sets the name for the configfile in the filesystem
     * @param fileName
     */
    void setFileName(QString fileName);
    QString getFileName();

    /**
     * @brief clear delets all content from the filesystem
     */
    void clear();

    ~ConfigFile();

    /******************************************************************************/
    /*                                                                            */
    /*    Getter and Setter                                                       */
    /*                                                                            */
    /******************************************************************************/

    int getMultisample() const;
    void setMultisample(int value);
    int getTextureFiltering() const;
    void setTextureFiltering(int value);
    int getReflection() const;
    void setReflection(int value);
    int getOcclusion() const;
    void setOcclusion(int value);
    int getShader() const;
    void setShader(int value);
    int getTexture() const;
    void setTexture(int value);
    int getParallax() const;
    void setParallax(int value);
    int getRefraction() const;
    void setRefraction(int value);
    int getAnisotropy() const;
    void setAnisotropy(int value);
    int getWidth() const;
    void setWidth(int value);
    int getHeight() const;
    void setHeight(int value);
    QString getGraphicLib() const;
    void setGraphicLib(const QString &value);
    QString getToken() const;
    void setToken(const QString &value);
    QString getDummy() const;
    void setDummy(const QString &value);
    QJsonObject getJson() const;
    void setJson(const QJsonObject &value);
    bool getFullscreen() const;
    void setFullscreen(bool value);
    int getGamma() const;
    void setGamma(int value);
    int getLanguage() const;
    void setLanguage(int value);
    int getMouse_sensitivity() const;
    void setMouse_sensitivity(int value);
    int getProfile() const;
    void setProfile(int value);
    int getResolution() const;
    void setResolution(int value);
    int getSfx() const;
    void setSfx(int value);
    int getView_distance() const;
    void setView_distance(int value);
    int getVolume_ambient() const;
    void setVolume_ambient(int value);
    int getVolume_character() const;
    void setVolume_character(int value);
    int getVolume_effects() const;
    void setVolume_effects(int value);
    int getVolume_master() const;
    void setVolume_master(int value);
    int getVolume_music() const;
    void setVolume_music(int value);
    bool getVsync() const;
    void setVsync(bool value);
    bool getMotion_blur() const;
    void setMotion_blur(bool value);
    int getProfile_id() const;
    void setProfile_id(int value);
    QString getProfile_name() const;
    void setProfile_name(const QString &value);
    bool getTexture_filtering() const;
    void setTexture_filtering(bool value);
    bool getVolumetric_shadows() const;
    void setVolumetric_shadows(bool value);
    std::vector<Controls> getControls() const;
    void setControls(const std::vector<Controls> &value);

private:

    /******************************************************************************/
    /*                                                                            */
    /*    Members                                                                 */
    /*                                                                            */
    /******************************************************************************/

    QString graphicLib;
    QString token;
    QString dummy = "placeholder";

    std::vector<Controls> controls;

    //GLOBALS
    bool fullscreen;
    int gamma;
    int height;
    int language;
    int mouse_sensitivity;
    int profile;
    int resolution;
    int sfx;
    int view_distance;
    int volume_ambient;
    int volume_character;
    int volume_effects;
    int volume_master;
    int volume_music;
    bool vsync;
    int width;

    //PROFILES
    int anisotropy;
    bool motion_blur;
    int multisample;
    int occlusion;
    bool parallax;
    int profile_id;
    QString profile_name;
    bool reflection;
    bool refraction;
    int shader;
    int texture;
    bool texture_filtering;
    bool volumetric_shadows;

    QJsonObject json;

    QJsonObject jsonObject;
    QString fileName;
    JsonRequest *jsonRequest;

    /******************************************************************************/
    /*                                                                            */
    /*    Methods                                                                 */
    /*                                                                            */
    /******************************************************************************/

    /**
     * @brief ConfigFile connects
     */
    ConfigFile();

    /**
     * @brief serialize
     */
    void serialize();

    /**
     * @brief deserialize
     */
    void deserialize();

public slots:
    void receaved(int caller, int action, int returnCode);
    void error_receaved();
};

#endif // CONFIGFILE_H
