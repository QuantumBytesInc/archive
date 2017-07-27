#ifndef RELICS_OF_ANNORATH_SERVER_H
#define RELICS_OF_ANNORATH_SERVER_H


#include <string>
#include <vector>
#include <functional>
#include <list>
#include <tuple>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include "Package.h"
#include "SessionManager.h"
#include "extern/easylogging++.h"

namespace QBNet
{

class Server {
public:
    /**
    * @brief Constructor
    */
    Server(boost::asio::io_service &io_service, uint16_t port);

    /**
    * @brief Destructor
    */
    ~Server();

    /**
    * @brief Send to specific connected clients
    *
    *  @param message The message to send
    *  @param clientID The client id to send the message to
    */
    void sendToClient(const std::string &message, uint64_t clientID);

    /**
     * @brief Send to specific connected clients
     *
     * Overloads Function void sendToClient(const std::string &message, uint64_t clientID);
     * Can Send a Generic Message to a Generic Client identified by IP and Port
     *
     * @param message
     * @param ip
     * @param port
     */
    void sendToClient(const std::string &message, std::string ip, unsigned short port);

    /**
    * @brief Send to all connected clients
    *
    *  @param message The message to send
    *  @param clientID The client id that is excepted
    */
    void sendToAllExcept(const std::string &message, std::string clientID);

    /**
    * @brief Send to all connected clients
    *
    *  @param message The message to send
    */
    void sendToAll(const std::string &message);

private:
    void start_receive();
    void handle_receive(const boost::system::error_code &error, std::size_t);
    boost::asio::ip::udp::socket socket_;
    boost::asio::ip::udp::endpoint remote_endpoint_;
    boost::array<char, Package::length_transport + Package::max_body_length> recv_buffer_;
    SessionManager *session_manager;
    /**
     * @brief list of all connected peers
     *
     * Could Contain User Object instead of Tuple?
     *
     */
    std::list<std::tuple<std::string, unsigned short>> peers;
};
}

#endif //RELICS_OF_SERVER_H
