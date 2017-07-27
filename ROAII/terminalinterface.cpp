#include "terminalinterface.h"

namespace Terminal {

terminalInterface::terminalInterface()
{
    // Start logging
    log = new Logger("InterfaceReloaded");
    log->addEntry(LOG_LEVEL_INF,"Starting interface", __PRETTY_FUNCTION__);

    config = &ConfigFile::getInstance();

    config->setLogger(log);

    // Set stats to zero
    requestsReceived = 1;
    requestsSent = 1;
    requestsSocketReceived = 1;
    requestsSocketSent = 1;

    threadManager = new ThreadManager(config->getThreads(), config->getDataHost());

    // Connect signals
    connect(threadManager, SIGNAL(signal_threadChanged(int, int, QString)),this, SLOT(slotThreadStatusChanged(int,int,QString)));
    connect(threadManager, SIGNAL(signal_workDone(int, QString)),this, SLOT(slotSendMessage(int, QString)));
    connect(threadManager, SIGNAL(signal_requestSent()),this, SLOT(slotRequestSent()));

    // Start manager
    threadManager->start();

    // Create socket manager
    socketManager = new SocketManager(config->getThreads(), config->getStartPortUnigine());

    // Connect for signal
    connect(socketManager,SIGNAL(signal_newMessage(QString, int)),this,SLOT(slotNewMessage(QString,int)));
    connect(socketManager,SIGNAL(signal_socketChanged(int,int,QString)),this,SLOT(slotSocketStatusChanged(int,int,QString)));
    connect(socketManager, SIGNAL(signal_messageSent()),this, SLOT(slotMessageSent()));

    // Create thread and move sockets into it
    thread = new QThread();
    socketManager->moveToThread(thread);

    // Connect signal and start
    connect(thread, SIGNAL(started()), socketManager, SLOT(slot_process()));
    thread->start();

}

void terminalInterface::runTerminalInterface()
{
    while(true)
    {
        printStats();
    }
}

terminalInterface::~terminalInterface()
{
    log->addEntry(LOG_LEVEL_INF,"Stopping interface", __PRETTY_FUNCTION__);
    printStats();
    delete config;

}

void terminalInterface::printStats()
{
    std::cout << "*---------------------------------------------------Stats------------------------------------------------------------*" << std::endl;
    std::cout << "|-----------------------------------------------------|--------------------------------------------------------------|" << std::endl;
    std::cout << "| Requests send:                                      |                                                  " << requestsSent << "           |"<< std::endl;
    std::cout << "| Requests answered:                                  |                                                  " << requestsReceived << "           |"<< std::endl;
    std::cout << "| Socket requets received:                            |                                                  " << requestsSocketReceived << "           |"<< std::endl;
    std::cout << "| Socket requests receaved:                           |                                                  " << requestsSocketSent << "           |"<< std::endl;
    std::cout << "*--------------------------------------------------------------------------------------------------------------------*" << std::endl;
}

void terminalInterface::slotThreadStatusChanged(int _threadId, int _threadDataChanged, QString _text)
{
    std::cout << "Thread " << _threadId << " Has been changed to " << _threadDataChanged << " and is now by " << _text.toStdString() << std::endl;

}

void terminalInterface::slotSocketStatusChanged(int _socketId, int _socketDataChanged, QString _text)
{
    std::cout << "Socket " << _socketId << " Has beend changed to " << _socketDataChanged << " and is now by " << _text.toStdString() << std::endl;
}

void terminalInterface::slotNewMessage(QString _message, int _id)
{
    log->addEntry(LOG_LEVEL_INF, "Setting work to thread manager", __PRETTY_FUNCTION__);

    threadManager->setWork(_message, _id);
    requestsReceived++;
}

void terminalInterface::slotSendMessage(int _id, QString _data)
{
    log->addEntry(LOG_LEVEL_INF, "Send message to socket manager: " + QString::number(_id), __PRETTY_FUNCTION__);

    socketManager->sendData(_id, _data);
    requestsSocketReceived++;
}

void terminalInterface::slotRequestSent()
{
    requestsSocketSent++;
}

void terminalInterface::slotMessageSent()
{
    requestsSent++;
}

}
