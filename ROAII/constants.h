/**
 * @copyright
 *              Copyright © 2011 Manuel Gysin
 *              Copyright © 2012 QuantumBytes inc.
 *              Copyright © 2014 QuantumBytes inc.
 *
 *              For more information, see https://www.quantum-bytes.com/
 *
 * @section LICENSE
 *
 *              This file is part of QuantumBytes Interface.
 *
 *              QuantumBytes Interface is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              any later version.
 *
 *              QuantumBytes Interface is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *
 *              You should have received a copy of the GNU General Public License
 *              along with QuantumBytes Interface.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @brief       Constants for various usages.
 *
 * @file    	cosntants.h
 *
 * @note
 *
 * @version 	3.0
 *
 * @author  	Manuel Gysin <manuel.gysin@quantum-bytes.com>
 *
 * @date        2014/11/03 19:00:00 GMT+1
 *
 */

#ifndef CONSTANTS_H
#define CONSTANTS_H

/**
 * brief Thread states
 */
enum
{
    THREAD_STATE_ID = 0,
    THREAD_STATE_STATE,
    THREAD_STATE_OPEN,
    THREAD_STATE_PROCESSED,
    THREAD_STATE_ERRORS,
    THREAD_STATE_DETAILS
};

/**
 * @brief Socket states
 */
enum
{
    SOCKET_STATE_GROUP = 0,
    SOCKET_STATE_STATE,
    SOCKET_STATE_PORT,
    SOCKET_STATE_TYPE,
    SOCKET_STATE_PROCESSED,
    SOCKET_STATE_ERRORS,
    SOCKET_STATE_DETAILS,
};

/**
 * @brief Socket types
 */
enum
{
    SOCKET_TYPE_READER = 1,
    SOCKET_TYPE_SENDER
};

/**
 * @brief Log levels
 */
enum
{
    LOG_LEVEL_TRC = 0,
    LOG_LEVEL_ERR,
    LOG_LEVEL_WRN,
    LOG_LEVEL_INF
};

#endif // CONSTANTS_H
