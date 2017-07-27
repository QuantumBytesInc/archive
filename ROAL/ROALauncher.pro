#-------------------------------------------------
#
# Project created by QtCreator 2011-04-02T20:27:08
#
#-------------------------------------------------

# Needed qt modules
QT += core gui network xml widgets

# Switch off unused parameter warnings
QMAKE_CXXFLAGS_WARN_ON = -Wall -Wno-unused-parameter

# Target and projekt template
TARGET = ROALauncher
TEMPLATE = app

# Configure libboost
QMAKE_CFLAGS += -DBOOST_FILESYSTEM_VERSION=2
QMAKE_CXXFLAGS += -DBOOST_FILESYSTEM_VERSION=2

# Uncomment for custom builds
#DEFINES += BUILD_CUSTOM
DEFINES += DISTRO_BUILD

win32 {
    message( "Building for windows")

    DEFINES += NOMINMAX
    DEFINES += TORRENT_NO_DEPRECATE

    win32-msvc*:contains(QMAKE_TARGET.arch, x86_64) {
        message( "Building for 64 bit")

        # Add includes
        INCLUDEPATH += "E:/dynamic/sources/boost"
        INCLUDEPATH += "E:/dynamic/sources/libtorrent/include"
        INCLUDEPATH += "E:/dynamic/sources/sfml/include"
        INCLUDEPATH += "E:/dynamic/sources/libarchive/libarchive"

        # Add libs
        LIBS += "C:/buildenv/w8sdk/Lib/win8/um/x64/shell32.lib"
        LIBS += "E:/dynamic/binaries/x64/liblzma.lib"
        LIBS += "E:/dynamic/binaries/x64/archive.lib"
        Release:LIBS += "E:/dynamic/binaries/x64/libboost_date_time-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x64/libboost_filesystem-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x64/libboost_system-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x64/libboost_thread-vc110-mt-1_54.lib"
        LIBS += "E:/dynamic/binaries/x64/torrent.lib"
        LIBS += "E:/dynamic/binaries/x64/sfml-audio.lib"
        LIBS += "E:/dynamic/binaries/x64/sfml-system.lib"
    } else {
        message( "Building for 32 bit")

        # Add includes
        INCLUDEPATH += "E:/dynamic/sources/boost"
        INCLUDEPATH += "E:/dynamic/sources/libtorrent/include"
        INCLUDEPATH += "E:/dynamic/sources/sfml/include"
        INCLUDEPATH += "E:/dynamic/sources/libarchive/libarchive"

        # Add libs
        LIBS += "C:/buildenv/w8sdk/Lib/win8/um/x86/shell32.lib"
        LIBS += "E:/dynamic/binaries/x86/liblzma.lib"
        LIBS += "E:/dynamic/binaries/x86/archive.lib"
        Debug:LIBS += "E:/dynamic/binaries/x86/libboost_date_time-vc110-mt-gd-1_54.lib"
        Debug:LIBS += "E:/dynamic/binaries/x86/libboost_filesystem-vc110-mt-gd-1_54.lib"
        Debug:LIBS += "E:/dynamic/binaries/x86/libboost_system-vc110-mt-gd-1_54.lib"
        Debug:LIBS += "E:/dynamic/binaries/x86/libboost_thread-vc110-mt-gd-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x86/libboost_date_time-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x86/libboost_filesystem-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x86/libboost_system-vc110-mt-1_54.lib"
        Release:LIBS += "E:/dynamic/binaries/x86/libboost_thread-vc110-mt-1_54.lib"
        LIBS += "E:/dynamic/binaries/x86/torrent.lib"
        LIBS += "E:/dynamic/binaries/x86/sfml-audio.lib"
        LIBS += "E:/dynamic/binaries/x86/sfml-system.lib"
    }
}

# Linux stuff
unix {
    INCLUDEPATH += "/usr/local/include/"
    LIBS += -lboost_filesystem -lboost_system -larchive -lsfml-audio -lsfml-system
    CONFIG += link_pkgconfig
    CONFIG += qt
    CONFIG += c++11
    PKGCONFIG += libtorrent-rasterbar
    QMAKE_CXXFLAGS += -std=c++11
}

DEFINES += QAPPLICATION_CLASS=QApplication

# Source files
SOURCES += src/cpp/torrentclient.cpp \
           src/cpp/settings.cpp \
           src/cpp/mainwindow.cpp \
           src/cpp/main.cpp \
           src/cpp/httpupdate.cpp \
           src/cpp/httpdownload.cpp \
           src/cpp/filevalidationthread.cpp \
           src/cpp/customsound.cpp \
           src/cpp/aboutlauncher.cpp \
           src/cpp/filedecompression.cpp \
           src/cpp/logger.cpp \
           src/cpp/logging.cpp \
           src/cpp/game.cpp \
           src/cpp/jsonrequest.cpp \
           src/cpp/configfile.cpp \
           src/cpp/controls.cpp \
    src/external/singleapplication.cpp \
    src/cpp/systeminformation.cpp

# Header files
HEADERS  += src/h/torrentclient.h \
            src/h/settings.h \
            src/h/mainwindow.h \
            src/h/httpupdate.h \
            src/h/httpdownload.h \
            src/h/filevalidationthread.h \
            src/h/customsound.h \
            src/h/aboutlauncher.h \
            src/h/constants.h \
            src/h/filedecompression.h \
            src/h/logger.h \
            src/h/logging.h \
            src/h/game.h \
            src/h/jsonrequest.h \
            src/h/constants_external.h \
            src/h/configfile.h \
            src/h/controls.h \
    src/external/singleapplication.h \
    src/h/systeminformation.h \
    src/external/singleapplication_p.h

# Forms
FORMS    += src/ui/mainwindow.ui \
            src/ui/httpupdate.ui \
            src/ui/aboutlauncher.ui

# Ressources
RESOURCES += resources/res.qrc

# RC
RC_FILE =       src/ROALauncher.rc

# Translations
TRANSLATIONS = resources/translations/roal_french.ts \
               resources/translations/roal_greek.ts \
               resources/translations/roal_italian.ts \
               resources/translations/roal_polish.ts \
               resources/translations/roal_portuguese.ts \
               resources/translations/roal_spanish.ts \
               resources/translations/roal_swedish.ts \
               resources/translations/roal_english.ts \
               resources/translations/roal_german.ts \
