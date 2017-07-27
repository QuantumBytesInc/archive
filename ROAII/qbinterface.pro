#-------------------------------------------------
#
# Project created by QtCreator 2014-09-13T19:58:16
#
#-------------------------------------------------

QT       += core gui network widgets
QT -= gui

TARGET = qbinterface
TEMPLATE = app


SOURCES += main.cpp\
        interface.cpp \
    logger.cpp \
    interfacesettings.cpp \
    threadmanager.cpp \
    socketmanager.cpp \
    socketconnector.cpp \
    jsonrequest.cpp \
    terminalinterface.cpp \
    configfile.cpp

HEADERS  += interface.h \
    logger.h \
    constants.h \
    interfacesettings.h \
    threadmanager.h \
    socketmanager.h \
    tcpconnection.h \
    socketconnector.h \
    sharedobject.h \
    jsonrequest.h \
    terminalinterface.h \
    configfile.h

FORMS    += interface.ui \
    interfacesettings.ui

LIBS += -L/usr/lib64 -lboost_system

RESOURCES += \
    res.qrc
