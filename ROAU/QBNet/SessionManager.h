//
// Created by mgysin on 6/15/17.
//

#ifndef RELICS_OF_ANNORATH_SESSIONMANAGER_H
#define RELICS_OF_ANNORATH_SESSIONMANAGER_H

#include "Peer.h"
#include "Package.h"
#include "protobuf/source/login.pb.h"
#include "extern/easylogging++.h"
#include <map>

namespace QBNet {
    /**
     * @brief Session manager for server
     *
     * Handles the users sessions. Each connected user has an unique session.
     * The session manager handles the following functions:
     * - Manages user sessions
     * - Manages message reading and writing
     * - Manages actions on received messages
     * - Delegates work the other managers
     */
    class SessionManager {
    public:
        /**
         * @brief Get instance of SessionManager
         * @return SessionManager instance
         */
        static SessionManager& getInstance();

        /**
         * @brief Process incoming package.
         * At this point version and type of the package are validated.
         */
        void process_package(Package &package, boost::asio::ip::udp::endpoint endpoint);

        /**
         * @brief Get list of connected peers.
         */
        std::map<std::string, Peer> get_peers();

        /**
         * @brief Get list of connected peers.
         */
        void add_peer(std::string uuid, Peer peer);

        /**
         * @brief Get specific connected peer by uuid.
         */
        Peer * get_peer(std::string uuid);

    private:
        /* @brief Constructor
         */
        SessionManager();

        /* @brief Map with all connected users, the key must be a secret to other users.
         * The key must be created on login with the gui and is transmitted with each package.
         */
        std::map<std::string, Peer> peers;
    };
}

#endif //RELICS_OF_ANNORATH_SESSIONMANAGER_H
