//
// Created by mgysin on 6/15/17.
//

#include <cstdlib>
#include <cstring>
#include <iostream>
#include <boost/asio.hpp>
#include <boost/thread/thread.hpp>
#include "../../extern/easylogging++.h"
#include "../../Package.h"
#include "../../Client.h"
#include "../../protobuf/source/login.pb.h"

INITIALIZE_EASYLOGGINGPP

int main(int argc, char* argv[])
{
    GOOGLE_PROTOBUF_VERIFY_VERSION;

    // Prepare network
    boost::asio::io_service io_service;
    QBNet::Client client(io_service, 15000);

    // Create protobuf data
    basic::Login data;
    data.set_uuid("45936d25-4527-4c05-80be-2bea4e5bba2e");

    // Create package
    Package package(Package::TYPE_CONNECT, client.get_new_id());

    package.body_length(data.SerializeAsString().size());
    memcpy(package.body(), data.SerializeAsString().c_str(), package.body_length());
    package.encode_header();

    // Send
    client.send(package);

    boost::thread bt(boost::bind(&boost::asio::io_service::run, &io_service));

    std::string request;
    std::getline(std::cin, request);

    bt.interrupt();

    return 0;
}