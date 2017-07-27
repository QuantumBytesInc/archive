//
// Created by mgysin on 6/14/17.
//

#ifndef RELICS_OF_ANNORATH_PACKAGE_H
#define RELICS_OF_ANNORATH_PACKAGE_H

#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <stdint.h>
#include <iostream>
#include <string>
#include <boost/date_time/posix_time/posix_time_types.hpp>

#define VERSION 1

class Package {

public:
    enum { header_length = 4 };
    enum { version_length = 5 };
    enum { type_length = 5 };
    enum { id_length = 5 };
    enum { max_body_length = 512 };
    enum {
        TYPE_INVALID = 0,
        TYPE_CONNECT,
        TYPE_SYNC_CHARACTER,
        TYPE_SYNC_EQUIP,
        TYPE_RELIABLE_ACKNOWLEDGE,
    };

    static const uint16_t length_transport = header_length + version_length + type_length + id_length;

    Package(uint16_t type, uint16_t id = 0, uint8_t timeout = 2);

    const char* data() const;
    char* data();
    static const uint16_t current_version = VERSION;

    size_t length() const;

    const char* body() const;
    char* body();
    uint16_t type();
    uint16_t id();
    uint16_t version();
    bool reliable;
    bool receipt_received;

    size_t body_length() const;
    void body_length(size_t new_length);

    void encode_header();
    bool decode_header();

    boost::posix_time::ptime sent_time_;

    uint8_t timeout();

private:
    size_t body_length_;
    uint16_t version_;
    uint16_t type_;
    uint16_t id_;
    uint8_t timeout_;

    char data_[length_transport + max_body_length];
};


#endif //RELICS_OF_ANNORATH_PACKAGE_H
