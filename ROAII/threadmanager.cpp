#include "threadmanager.h"

ThreadManager::ThreadManager(int _threadAmount, QString _url)
{
    // Start logging
    log = new Logger("ThreadManager");
    log->addEntry(LOG_LEVEL_INF,"Construction ThreadManager", __PRETTY_FUNCTION__);

    threadAmount = _threadAmount;
    url = _url;
    size = 0;
}

void ThreadManager::start()
{
    log->addEntry(LOG_LEVEL_INF,"Running ThreadManager thread", __PRETTY_FUNCTION__);

    for(int i = 1; i <= threadAmount; i++)
    {
        setThreads(i);
    }
}

void ThreadManager::setThreads(int _threadId)
{
    log->addEntry(LOG_LEVEL_INF,"Setting child threads for working", __PRETTY_FUNCTION__);

    // Create new reuqest and connect it
    JsonRequest *request = new JsonRequest(_threadId, url);
    requests.insert(_threadId, request);

    // Connect thread
    connect(request,SIGNAL(stateChanged(int, int, QString)),this,SLOT(slot_setStateChanged(int, int, QString)));
    connect(request,SIGNAL(responseReceived(int, QString)),this,SLOT(slot_propagateResponse(int, QString)));
    connect(request,SIGNAL(signal_requestSent()),this,SLOT(slot_requestSent()));

    // Emit signal
    emit signal_threadChanged(_threadId, THREAD_STATE_STATE, "Started");

    // Start worker
    request->prepare();
}

void ThreadManager::slot_setStateChanged(int _threadId, int _threadDataId, QString _text)
{
    emit signal_threadChanged(_threadId, _threadDataId,  _text);
}

void ThreadManager::setWork(QString _message, int _id)
{
    JsonRequest *request = NULL;

    foreach (JsonRequest* value, requests)
    {
        if(value->getWorkQueue() <= size)
        {
            request = value;
            size = value->getWorkQueue();

            if(size == 0)
            {
                break;
            }
        }
    }

    size++;

    if(request == NULL)
    {
        /// \note If something goes wrong, use first instance
        request = requests.value(1);
    }

    log->addEntry(LOG_LEVEL_INF,"Set new work to process.", __PRETTY_FUNCTION__);
    request->setRequestData(_message, _id);
}

void ThreadManager::slot_propagateResponse(int _threadId, QString _message)
{
    log->addEntry(LOG_LEVEL_INF,"Propagate message: " + QString::number(_threadId) + " - " + _message, __PRETTY_FUNCTION__);
    emit signal_workDone(_threadId, _message);
}

void ThreadManager::slot_requestSent()
{
    emit signal_requestSent();
}
