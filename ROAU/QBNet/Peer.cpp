//
// Created by mgysin on 6/15/17.
//

#include "Peer.h"

using namespace QBNet;

Peer::Peer(boost::asio::ip::udp::endpoint endpoint, std::string uuid) : remote_endpoint_(endpoint),
                                                                        uuid_(uuid) {
}

const boost::asio::ip::udp::endpoint &Peer::remote_endpoint() const {
    return remote_endpoint_;
}