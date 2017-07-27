//
// Created by mgysin on 6/15/17.
//

#include <cstdlib>
#include <cstring>
#include <iostream>
#include <boost/asio.hpp>
#include "../../Package.h"
#include "../../Client.h"


int main(int argc, char* argv[])
{
    boost::asio::io_service io_service;

    QBNet::Client client(io_service, 15000);

    Package package(Package::TYPE_CONNECT);
    package.body_length(strlen("Test message2"));
    memcpy(package.body(), "Test message2", package.body_length());
    package.encode_header();

    client.send(package);

    return 0;
}