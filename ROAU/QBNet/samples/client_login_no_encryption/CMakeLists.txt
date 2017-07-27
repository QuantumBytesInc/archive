find_package(Boost
        REQUIRED COMPONENTS system thread)

find_package(Protobuf REQUIRED)

include_directories(${Boost_INCLUDE_DIR},
        ${PROTOBUF_INCLUDE_DIR})


set(SOURCE_FILES
        ../../Package.h
        ../../Package.cpp
        ../../Client.h
        ../../Client.cpp
        ../../Peer.cpp
        ../../Peer.h
        ../../protobuf/source/login.pb.h
        ../../protobuf/source/login.pb.cc
        ../../extern/easylogging++.cc
        ../../extern/easylogging++.h
        main.cpp)

add_executable(client_login ${SOURCE_FILES})

target_link_libraries( client_login ${Boost_LIBRARIES} -lpthread ${PROTOBUF_LIBRARY})