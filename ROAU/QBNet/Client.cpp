//
// Created by mgysin on 6/15/17.
//

#include "Client.h"

using namespace QBNet;

Client::Client(boost::asio::io_service &io_service, uint16_t port) :
        remote_endpoint_(boost::asio::ip::udp::v4(), port),
        socket_(io_service)
{
    socket_.connect(remote_endpoint_);
    start_receive();
}

void Client::send(Package &package) {
    if(package.reliable)
    {
        add_package_to_reliable_queue(package);
    }

    socket_.send(boost::asio::buffer(package.data(), package.length()));
}

uint16_t Client::get_new_id() {
    // @Note Soft reset, we should never overflow to 0 because of conflict in package class.
    if(package_id_ > 65534) {
        package_id_ = 0;
    }

    return package_id_ = ++package_id_;
}

void Client::add_package_to_reliable_queue(Package &package) {
    package.sent_time_ = boost::posix_time::second_clock::local_time();

    auto ret = reliable_packages_.insert(std::make_pair(package.id(), package));

    if (!ret.second) {
        std::cout << "Package id collision" << std::endl;
    }
}

void Client::remove_package_to_reliable_queue(uint16_t id) {
    reliable_packages_.erase(id);
}

void Client::start_receive() {
    LOG(TRACE) << "Starting receiving";
    socket_.async_receive_from(
            boost::asio::buffer(recv_buffer_),
            remote_endpoint_,
            boost::bind(&Client::handle_receive, this,
                        boost::asio::placeholders::error,
                        boost::asio::placeholders::bytes_transferred));
}

void Client::handle_receive(const boost::system::error_code &error, std::size_t bytes_transferred) {
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

        // Basic validation
        if (package.type() <= Package::TYPE_INVALID) {
            LOG(ERROR) << "Invalid package type:" << package.type();
            return;
        }
        if (package.version() != Package::current_version) {
            LOG(ERROR) << "Invalid package version:" << package.version();
            return;
        }

        // Do work
        switch (package.type()) {
            case Package::TYPE_RELIABLE_ACKNOWLEDGE:
                LOG(ERROR) << "Reliable acknowledge received";
                remove_package_to_reliable_queue(package.id());
                break;
            default:
                LOG(ERROR) << "Unknown package type";
                return;
                break;
        }
    }

    start_receive();
}