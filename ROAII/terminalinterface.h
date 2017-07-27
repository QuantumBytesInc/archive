#ifndef TERMINALINTERFACE_H
#define TERMINALINTERFACE_H

#include <iostream>
#include <iomanip>

#include <QObject>


#include "threadmanager.h"
#include "socketmanager.h"
#include "logger.h"
#include "configfile.h"

namespace Terminal
{

class terminalInterface : QObject
{
    Q_OBJECT
public:
    terminalInterface();
    void runTerminalInterface();
    ~terminalInterface();

private:
    /**
     * @brief Log object
     */
    Logger *log;

    /**
     * @brief Configuration class
     */
    ConfigFile *config;

    /**
     * @brief Pointer to thread manager
     */
    ThreadManager *threadManager;

    /**
     * @brief Pointer to socket manager
     */
    SocketManager *socketManager;

    /**
     * @brief Thread for socket manager
     */
    QThread *thread;

    /**
     * @brief Total requests send django
     */
    int requestsSent;

    /**
     * @brief Total requests received from django
     */
    int requestsReceived;

    /**
     * @brief Total requests sent to unigine
     */
    int requestsSocketSent;

    /**
     * @brief Total requets received from unigine
     */
    int requestsSocketReceived;

    void printStats();

public slots:

    /**
     * @brief Slot when thread has changed state
     * @param _threadId The thread id
     * @param _threadDataChanged The state chagend
     * @param _text The value to set
     */
    void slotThreadStatusChanged(int _threadId, int _threadDataChanged, QString _text);

    /**
     * @brief Slot when socket has changed state
     * @param _socketId The socket id
     * @param _socketDataChanged The data changed
     * @param _text The value to set
     */
    void slotSocketStatusChanged(int _socketId, int _socketDataChanged, QString _text);

    /**
     * @brief Slot when new message arrived
     * @param _message The message
     * @todo Send or receive?
     */
    void slotNewMessage(QString _message, int _id);

    /**
     * @brief Slot when message was send to django
     * @param _id The thread id
     * @param _data The data
     */
    void slotSendMessage(int _id, QString _data);

    /**
     * @brief Slot when requests was sent
     */
    void slotRequestSent();

    /**
     * @brief Slot when message was sent
     */
    void slotMessageSent();
};
}
#endif // TERMINALINTERFACE_H
