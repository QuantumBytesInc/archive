#ifndef SYSTEMINFORMATION_H
#define SYSTEMINFORMATION_H

#include <QString>
#include <QSysInfo>
#include <QFileInfo>
#include <QCoreApplication>
#include <QLocale>
#include <QTcpSocket>
#include <QStorageInfo>
#include <QHostInfo>
#include "constants.h"

class SystemInformation
{
public:
    SystemInformation();
    QString getSystemInformation();

private:
    QString OSName;
    QString OSType;
    QString OSVersion;
    QString installDir;
    QString LauncherVersion;
    QString QTBuildInformations;
    QString SystemLanguage;
    QString RoAConfigVersion;
    QString HostIP;
    QString FreeSpace;

    QString getHostIP();
    QString getFreeSpace();

};

#endif // SYSTEMINFORMATION_H
