//
// Created by mgysin on 6/15/17.
//

#ifndef RELICS_OF_ANNORATH_USER_H
#define RELICS_OF_ANNORATH_USER_H

#include <string>
#include <boost/asio.hpp>

namespace QBNet {

    class Peer {
    public:
        Peer(boost::asio::ip::udp::endpoint endpoint, std::string uuid);
        const boost::asio::ip::udp::endpoint &remote_endpoint() const;


    private:
        std::string uuid_;
        boost::asio::ip::udp::endpoint remote_endpoint_;
    };
}

#endif //RELICS_OF_ANNORATH_USER_H
