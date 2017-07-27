#include "configfile.h"

namespace Terminal
{

    /*!
     * \brief ConfigFile::ConfigFile Creates an Object of a ConfigFile and fills the object with default values
     */
    ConfigFile::ConfigFile()
    {
        resetToDefault();
    }

    /*!
     * \brief ConfigFile::writeToFile Writes the given Config to the specified file given in the constructor
     *
     * This Method writes the Config variables to the file which was given in the Constructor of the ConfigFile class.
     * It is writen in JSON syntax with the following structure:
     *
     *   fileName            = fileName(QString)
     *   startPortDjango     = startPortDjango(int)
     *   startPortUnigine    = startPortUnigine(int)
     *   threads             = threads(int)
     *   dataHost            = dataHost(QString)
     *   firstRun            = firstRun(int)
     *
     * \return the status of the saving process (as a boolean)
     */
    bool ConfigFile::writeToFile()
    {
        mutex.lock();

        QFile saveFile(fileName);

        if(saveFile.open(QIODevice::WriteOnly)){
            serialize();

            QJsonDocument sv(jsonObject);

            saveFile.write(sv.toJson());
            mutex.unlock();
            return true;
        }
        mutex.unlock();

        return false;
    }

    /*!
     * \brief ConfigFile::resetToDefault restores the default values
     *
     * Restores the default values and resialize the jsonObject.
     */
    void ConfigFile::resetToDefault()
    {
        fileName            = "save.json";
        startPortDjango     = 14001;
        startPortUnigine    = 24001;
        threads             = 1;
        dataHost            = "https://droag.annorath-game.com/internal/request/";
        firstRun            = 0;
        serialize();
        emit onConfigChanged();
    }

    /*!
     * \brief ConfigFile::getInstance returns a static Object of the ConfigFile class
     *
     * \return a static Object of the ConfigFile class
     */
    ConfigFile &ConfigFile::getInstance()
    {
        static ConfigFile instance;
        return instance;
    }


    /*!
     * \brief ConfigFile::readFromFile reads the configuration from a file, given in the Constructor of this class
     *
     * \return the status of the reading process (as boolean)
     */
    bool ConfigFile::readFromFile()
    {
        mutex.lock();

        QFile loadFile(fileName);

        if(!loadFile.exists())
        {
            mutex.unlock();
            if(!writeToFile())
            {
                logger->addEntry(LOG_LEVEL_ERR,"Can't write to file!", __PRETTY_FUNCTION__);
                mutex.unlock();
                return false;
            }
        }
        if (!loadFile.open(QIODevice::ReadOnly))
        {
            logger->addEntry(LOG_LEVEL_ERR,"Couldn't open save file!", __PRETTY_FUNCTION__);
            mutex.unlock();
            return false;
        }

        QByteArray saveData = loadFile.readAll();

        QJsonDocument loadDoc(QJsonDocument::fromJson(saveData));
        jsonObject = loadDoc.object();

        deserialize();

        mutex.unlock();

        return true;
    }

    /*!
     * \brief ConfigFile::serialize writes all data to the jsonObject
     */
    void ConfigFile::serialize()
    {
        jsonObject.insert("startPortDjango", QJsonValue(startPortDjango));
        jsonObject.insert("startPortUnigine", QJsonValue(startPortUnigine));
        jsonObject.insert("threads", QJsonValue(threads));
        jsonObject.insert("firstRun", QJsonValue(firstRun));
        jsonObject.insert("dataHost", QJsonValue(dataHost));
    }

    /*!
     * \brief ConfigFile::deserialize reads all data from the jsonObject
     */
    void ConfigFile::deserialize()
    {
        startPortDjango     = jsonObject["startPortDjango"].toInt();
        startPortUnigine    = jsonObject["startPortUnigine"].toInt();
        threads             = jsonObject["threads"].toInt();
        firstRun            = jsonObject["firstRun"].toInt();
        dataHost            = jsonObject["dataHost"].toString();
    }

    void ConfigFile::setLogger(Logger *value)
    {
        logger = value;
    }

    QString ConfigFile::getDataHost() const
    {
        return dataHost;
    }

    void ConfigFile::setDataHost(const QString &value)
    {
        dataHost = value;
        emit onConfigChanged();
    }

    QString ConfigFile::getFileName() const
    {
        return fileName;
    }

    void ConfigFile::setFileName(const QString &value)
    {
        fileName = value;
        emit onConfigChanged();
    }

    int ConfigFile::getFirstRun() const
    {
        return firstRun;
    }

    void ConfigFile::setFirstRun(int value)
    {
        firstRun = value;
        emit onConfigChanged();
    }

    int ConfigFile::getThreads() const
    {
        return threads;
    }

    void ConfigFile::setThreads(int value)
    {
        threads = value;
        emit onConfigChanged();
    }

    int ConfigFile::getStartPortUnigine() const
    {
        return startPortUnigine;
    }

    void ConfigFile::setStartPortUnigine(int value)
    {
        startPortUnigine = value;
        emit onConfigChanged();
    }

    int ConfigFile::getStartPortDjango() const
    {
        return startPortDjango;
    }

    void ConfigFile::setStartPortDjango(int value)
    {
        startPortDjango = value;
        emit onConfigChanged();
    }
}
