//
// Created by mgysin on 6/15/17.
//

#ifndef RELICS_OF_ANNORATH_CLIENT_H
#define RELICS_OF_ANNORATH_CLIENT_H

#include <string>
#include <vector>
#include <functional>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include <boost/date_time/posix_time/posix_time_types.hpp>
#include "Package.h"
#include "extern/easylogging++.h"

namespace QBNet {

    class Client {

    public:
        Client(boost::asio::io_service &io_service, uint16_t port);
        void send(Package &package);
        uint16_t get_new_id();

    private:
        boost::asio::ip::udp::socket socket_;
        boost::asio::ip::udp::endpoint remote_endpoint_;
        uint16_t package_id_ = 0;
        void add_package_to_reliable_queue(Package &package);
        void remove_package_to_reliable_queue(uint16_t id);
        std::map <uint16_t, Package> reliable_packages_;
        void start_receive();
        void handle_receive(const boost::system::error_code &error, std::size_t bytes_transferred);
        boost::array<char, Package::length_transport + Package::max_body_length> recv_buffer_;
    };
}

#endif //RELICS_OF_ANNORATH_CLIENT_H
