#ifndef CONFIGFILE_H
#define CONFIGFILE_H

#include <QJsonObject>
#include <QString>
#include "src/h/jsonrequest.h"


class configfile
{
public:
    static configfile& getInstance();
    bool readFromFile();
    bool writeToFile();
    QString getFileName();
    void setFileName(QString fileName);
    ~configfile();
private:
    configfile();
    void operator =(configfile const&);
    void serialize();
    void deserialize();
    QJsonObject jsonObject;
    QString fileName;
    JsonRequest *requ = &JsonRequest::getInstance();

    int fullscreen;
    int vsync;
    int resulution;
    int gamma;
    int multisample;
    int textureFiltering;
    int motionBlur;
    int volumetricShadows;
    int reflection;
    int occlusion;
    int shader;
    int texture;
    int parallax;
    int refraction;
    int anisotropy;
    int width;
    int height;
    #ifdef Q_OS_LINUX
    QString opengl;
    #else
    QString direct3d11;
    #endif
    QString token;
    QString dummy = "placeholder";
};

#endif // CONFIGFILE_H
