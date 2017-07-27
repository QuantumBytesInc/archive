/**
 * \copyright
 *              Copyright © 2011 Manuel Gysin
 *              Copyright © 2012 QuantumBytes inc.
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
 * \brief       Decompresses archives
 *
 * \file    	filedecompression.h
 *
 * \note
 *
 * \version 	1.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2013/04/10 19:00:00 GMT+1
 *
 */

#ifndef FILE_DECOMPRESSION_H
#define FILE_DECOMPRESSION_H

/******************************************************************************/
/*                                                                            */
/*    C/C++ includes                                                          */
/*                                                                            */
/******************************************************************************/
#include <archive.h>
#include <archive_entry.h>

/******************************************************************************/
/*                                                                            */
/*    Qt includes                                                             */
/*                                                                            */
/******************************************************************************/
#include <QThread>

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "logging.h"

class FileDecompression : public QThread
{
    Q_OBJECT

    public:
        /**
         * @brief Decompressing archives
         * @param _file The path with the file name
         */
        FileDecompression();

        /**
         * @brief Start decompressing
         */
        void run();

        /**
         * @brief Set file
         * @param _file The file name
         * @param _installPath The installation path
         */
        void setFile(QString _file, QString _installPath, QString _target);

    private:

        /**
         * @brief The file
         */
        QString file;

        /**
         * @brief The installation path
         */
        QString installPath;

        /**
         * @brief The target folder
         */
        QString target;

        bool state;

        /**
         * @brief Copy date
         * @param _ar The archive read
         * @param _aw The archive write
         * @return Size
         */
        int copy_data(struct archive *_ar, struct archive *_aw);

        /**
         * @brief Extract archive
         */
        void extract();

    signals:
        void extraction_done(bool state);

};

#endif // FILE_DECOMPRESSION_H
