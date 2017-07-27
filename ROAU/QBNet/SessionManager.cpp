//
// Created by mgysin on 6/15/17.
//

#include "SessionManager.h"

using namespace QBNet;

SessionManager::SessionManager() {
}

SessionManager &SessionManager::getInstance() {
    static SessionManager instance;
    return instance;
}

void SessionManager::process_package(Package &package, boost::asio::ip::udp::endpoint endpoint) {

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
        case Package::TYPE_CONNECT: {
            LOG(ERROR) << "Login requested";

            // Read package
            basic::Login data;
            if (data.ParseFromString(package.body())) {
                add_peer(data.uuid(), Peer(endpoint, data.uuid()));
            } else {
                LOG(ERROR) << "Error while reading package";
            }
        }
            break;
        default:
            LOG(ERROR) << "Unknown package type";
            return;
            break;
    }
}

std::map<std::string, Peer> SessionManager::get_peers() {
    return peers;
}

void SessionManager::add_peer(std::string uuid, Peer peer) {

    auto ret = peers.insert(std::make_pair(uuid, peer));

    if (!ret.second) {
        LOG(ERROR) << "Client already added";
    } else {
        LOG(INFO) << "Adding peer with uuid: " << uuid;
    }
}

Peer *SessionManager::get_peer(std::string uuid) {
    auto peer = peers.find(uuid);

    if (peer != peers.end()) {
        return &peer->second;
    } else {
        return nullptr;
    }
}

