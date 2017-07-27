//
// Created by mgysin on 6/14/17.
//

#include "Package.h"

Package::Package(uint16_t type, uint16_t id, uint8_t timeout)
        : body_length_(0),
          version_(Package::current_version),
          type_(type),
          id_(id),
          timeout_(timeout){
    // Reliable if id is provided
    reliable = id_ >= 1;
}

const char *Package::data() const {
    return data_;
}

char *Package::data() {
    return data_;
}

size_t Package::length() const {
    return length_transport + body_length_;
}

const char *Package::body() const {
    return data_ + length_transport;
}

char *Package::body() {
    return data_ + length_transport;
}

size_t Package::body_length() const {
    return body_length_;
}

void Package::body_length(size_t new_length) {
    body_length_ = new_length;

    if (body_length_ > max_body_length) {
        body_length_ = max_body_length;
    }
}

uint16_t Package::type() {
    return type_;
}

uint16_t Package::version() {
    return version_;
}

uint16_t Package::id() {
    return id_;
}

void Package::encode_header() {
    using namespace std; // For sprintf and memcpy.
    char header[header_length + 1] = "";
    char version[version_length + 1] = "";
    char type[version_length + 1] = "";
    char id[id_length + 1] = "";
    sprintf(header, "%4d", body_length_);
    sprintf(version, "%5d", version_);
    sprintf(type, "%5d", type_);
    sprintf(id, "%5d", id_);
    memcpy(data_, header, header_length);
    memcpy(data_ + header_length, version, version_length);
    memcpy(data_ + header_length + version_length, type, type_length);
    memcpy(data_ + header_length + version_length + type_length, id, id_length);
}


bool Package::decode_header() {
    using namespace std; // For strncat and atoi.
    char header[header_length + 1] = "";
    char version[version_length + 1] = "";
    char type[version_length + 1] = "";
    char id[id_length + 1] = "";
    strncat(header, data_, header_length);
    strncpy(version, data_+ header_length, version_length);
    strncpy(type, data_+ header_length + version_length, type_length);
    strncpy(id, data_+ header_length + version_length + type_length, id_length);

    body_length_ = atoi(header);
    version_ = atoi(version);
    type_ = atoi(type);
    id_ = atoi(id);

    if (body_length_ > max_body_length)
    {
        body_length_ = 0;
        return false;
    }

    return true;
}

uint8_t Package::timeout() {
    return timeout_;
}
