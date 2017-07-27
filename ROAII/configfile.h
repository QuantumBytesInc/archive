#ifndef CONFIGFILE_H
#define CONFIGFILE_H

#include <QJsonObject>
#include <QJsonValue>
#include <QJsonDocument>
#include <QMutex>
#include <QFile>
#include <QDebug>
#include <QObject>

#include "logger.h"


namespace Terminal
{
    class ConfigFile : QObject
    {
        Q_OBJECT

    public:
        static ConfigFile& getInstance();
        bool readFromFile();
        bool writeToFile();
        void resetToDefault();

        int getStartPortDjango() const;
        void setStartPortDjango(int value);

        int getStartPortUnigine() const;
        void setStartPortUnigine(int value);

        int getThreads() const;
        void setThreads(int value);

        int getFirstRun() const;
        void setFirstRun(int value);

        QString getFileName() const;
        void setFileName(const QString &value);

        QString getDataHost() const;
        void setDataHost(const QString &value);

        void setLogger(Logger *value);

    signals:
        void onConfigChanged();

    private:
        ConfigFile();
        ConfigFile(ConfigFile const&);
        void operator =(ConfigFile const&);
        void serialize();
        void deserialize();
        QMutex mutex;
        QJsonObject jsonObject;
        Logger *logger;

        int startPortDjango, startPortUnigine, threads, firstRun;
        QString fileName, dataHost;

    };

}


#endif // CONFIGFILE_H
