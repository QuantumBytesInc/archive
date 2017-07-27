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
 * \file    	filedecompression.cpp
 *
 * \note
 *
 * \version 	3.0
 *
 * \author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * \date        2013/04/10 19:00:00 GMT+1
 *              2013/11/24 19:00:00 GMT+1
 *
 */

/******************************************************************************/
/*                                                                            */
/*    Others includes                                                         */
/*                                                                            */
/******************************************************************************/
#include "../h/filedecompression.h"

// QT does not read this in h file, so we place it here
#ifdef Q_OS_WIN
#include <direct.h>
#endif

/******************************************************************************/
/*                                                                            */
/*    Constructor/Deconstructor                                               */
/*                                                                            */
/******************************************************************************/

FileDecompression::FileDecompression()
{
    Logging::addEntry(LOG_LEVEL_INF, "Creating file decompressor", FUNCTION_NAME);

    // Set state to true
    state = true;
}

/******************************************************************************/
/*                                                                            */
/*    Public methods                                                          */
/*                                                                            */
/******************************************************************************/

void FileDecompression::run()
{
    // Change dir
    QString chDirPath = installPath + target;

#ifdef Q_OS_WIN
    int chdir = _chdir(chDirPath.toStdString().c_str());

    if(chdir == 0)
#else
    if(chdir(chDirPath.toStdString().c_str()) == 0)
#endif
    {
        Logging::addEntry(LOG_LEVEL_INF, "Changed dir to archive", FUNCTION_NAME);
        extract();
    }
    else
    {
        Logging::addEntry(LOG_LEVEL_INF, "Can't chdir", FUNCTION_NAME);
        state = false;
    }

    emit extraction_done(state);
}

void FileDecompression::setFile(QString _file, QString _installPath, QString _target)
{
    Logging::addEntry(LOG_LEVEL_INF, "Setting file to " + _installPath + "/" + _file, FUNCTION_NAME);

    target = _target;

#ifdef Q_OS_WIN
    file = _file;
    installPath = _installPath.replace("/","\\\\");
#else
    file = _file;
    installPath = _installPath;
#endif
}

/******************************************************************************/
/*                                                                            */
/*    Private methods                                                         */
/*                                                                            */
/******************************************************************************/

int FileDecompression::copy_data(struct archive *_ar, struct archive *_aw)
{
    Logging::addEntry(LOG_LEVEL_INF, "Copy archive data", FUNCTION_NAME);

    int r;
    const void *buff;
    size_t size;

#ifdef Q_OS_WIN
    long long offset;
#else
#if __x86_64__
    off_t offset;
#else
    long long int offset;
#endif
#endif

    for (;;)
    {
        // Read
        r = archive_read_data_block(_ar, &buff, &size, &offset);

        if (r == ARCHIVE_EOF)
        {
            Logging::addEntry(LOG_LEVEL_INF, "End of archive", FUNCTION_NAME);
            return (ARCHIVE_OK);
        }
        if (r != ARCHIVE_OK)
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Corrupt archive", FUNCTION_NAME);
            return (r);
        }

        // Write
        r = archive_write_data_block(_aw, buff, size, offset);

        if (r != ARCHIVE_OK)
        {
            Logging::addEntry(LOG_LEVEL_ERR, archive_error_string(_aw), FUNCTION_NAME);
            return (r);
        }
    }
}

void FileDecompression::extract()
{
    Logging::addEntry(LOG_LEVEL_INF, "Extracting file", FUNCTION_NAME);

    struct archive *a;
    struct archive *ext;
    struct archive_entry *entry;
    int flags;
    int r;

    /* Select which attributes we want to restore. */
    flags = ARCHIVE_EXTRACT_TIME;
    flags |= ARCHIVE_EXTRACT_PERM;
    flags |= ARCHIVE_EXTRACT_ACL;
    flags |= ARCHIVE_EXTRACT_FFLAGS;

    // Read archive
    a = archive_read_new();
    archive_read_support_format_all(a);
    archive_read_support_filter_all(a);

    // Write to disk
    ext = archive_write_disk_new();
    archive_write_disk_set_options(ext, flags);
    archive_write_disk_set_standard_lookup(ext);

    // Target file
#ifdef Q_OS_LINUX
    if ((r = archive_read_open_filename(a, QString("../" + file).toStdString().c_str(), 10240)))
#else
    if ((r = archive_read_open_filename(a, QString("..\\" + file).toStdString().c_str(), 10240)))
#endif
    {
        Logging::addEntry(LOG_LEVEL_ERR, "Error while extracting", FUNCTION_NAME);
        exit(1);
    }

    for (;;)
    {
        // Reading
        r = archive_read_next_header(a, &entry);

        // Check
        if (r == ARCHIVE_EOF)
        {
            Logging::addEntry(LOG_LEVEL_INF, "End of archive reached", FUNCTION_NAME);
            break;
        }
        if (r != ARCHIVE_OK)
        {
            Logging::addEntry(LOG_LEVEL_ERR, archive_error_string(a), FUNCTION_NAME);
        }
        if (r < ARCHIVE_WARN)
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Error while extracting", FUNCTION_NAME);
            state = false;
            exit(1);
        }

        // Writting
        r = archive_write_header(ext, entry);

        // Check
        if (r != ARCHIVE_OK)
        {
            Logging::addEntry(LOG_LEVEL_ERR, archive_error_string(ext), FUNCTION_NAME);
            state = false;
        }
        else if (archive_entry_size(entry) > 0)
        {
            // Copy data
            copy_data(a, ext);

            // Check
            if (r != ARCHIVE_OK)
            {
                Logging::addEntry(LOG_LEVEL_ERR, archive_error_string(ext), FUNCTION_NAME);
                state = false;
            }
            if (r < ARCHIVE_WARN)
            {
                Logging::addEntry(LOG_LEVEL_ERR, "Error while extracting", FUNCTION_NAME);
                state = false;
                exit(1);
            }
        }

        // Finishing
        r = archive_write_finish_entry(ext);

        // Check
        if (r != ARCHIVE_OK)
        {
            Logging::addEntry(LOG_LEVEL_ERR, archive_error_string(ext), FUNCTION_NAME);
            state = false;
        }
        if (r < ARCHIVE_WARN)
        {
            Logging::addEntry(LOG_LEVEL_ERR, "Error while extracting", FUNCTION_NAME);
            state = false;
            exit(1);
        }
    }

    // Closing archives
    archive_read_close(a);
    archive_read_free(a);
    archive_write_close(ext);
    archive_write_free(ext);
}
