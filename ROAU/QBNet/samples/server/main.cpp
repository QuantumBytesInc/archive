//
// Created by mgysin on 6/15/17.
//

#include "../../extern/easylogging++.h"
#include "../../Server.h"
#include <boost/thread/thread.hpp>

INITIALIZE_EASYLOGGINGPP

int main(int argc,char *argv[]) {

    GOOGLE_PROTOBUF_VERIFY_VERSION;

    boost::asio::io_service io_service;

    QBNet::Server server(io_service, 15000);
    boost::thread bt(boost::bind(&boost::asio::io_service::run, &io_service));

    std::string request;
    std::getline(std::cin, request);

    bt.interrupt();

    return 0;
}