#include "Server.h"
#include <iostream>

using namespace QBNet;

Server::Server(boost::asio::io_service &io_service, uint16_t port) :
        socket_(io_service,
                boost::asio::ip::udp::endpoint(boost::asio::ip::udp::v4(), port)) {
    LOG(INFO) << "Starting QBNet Server";
    session_manager = &SessionManager::getInstance();
    start_receive();
}

Server::~Server() {
    LOG(INFO) << "Stopping QBNet Server";
}

void Server::start_receive() {
    LOG(TRACE) << "Starting receiving";
    socket_.async_receive_from(
            boost::asio::buffer(recv_buffer_),
            remote_endpoint_,
            boost::bind(&Server::handle_receive, this,
                        boost::asio::placeholders::error,
                        boost::asio::placeholders::bytes_transferred));
}

void Server::handle_receive(const boost::system::error_code &error, std::size_t bytes_transferred) {
    if (!error) {
        LOG(TRACE) << "Package received";

        Package package(Package::TYPE_INVALID);

        memcpy(package.data(),
               recv_buffer_.data(),
               Package::length_transport);
        package.decode_header();
        memcpy(package.body(),
               recv_buffer_.data() + Package::length_transport,
               package.body_length());

        // Delegate package to session manager
        session_manager->process_package(package, remote_endpoint_);

        if(package.id())
        {
            Package answer(Package::TYPE_RELIABLE_ACKNOWLEDGE, package.id());
            answer.encode_header();
            socket_.send_to(boost::asio::buffer(answer.data(), answer.length()), remote_endpoint_);
        }
    }

    start_receive();
}

void Server::sendToClient(const std::string &message, uint64_t clientID) {

}

void Server::sendToClient(const std::string &message, std::string ip, unsigned short port) {

}

void Server::sendToAllExcept(const std::string &message, std::string clientID) {

    for (std::tuple<std::string,unsigned short> client : peers) {
        if(!(std::get<0>(client) == clientID)) { // TODO: Define clientID. could be IP imho. Change if necessary
            sendToClient(message, std::get<0>(client), std::get<1>(client));
        }
    }

}

void Server::sendToAll(const std::string &message) {

    for (std::tuple<std::string, unsigned short> client : peers) {
        sendToClient(message, std::get<0>(client), std::get<1>(client));
    }
}
