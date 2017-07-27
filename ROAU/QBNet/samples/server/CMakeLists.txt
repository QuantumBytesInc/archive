find_package(Boost
        REQUIRED COMPONENTS system thread)
find_package(Protobuf REQUIRED)

include_directories(${Boost_INCLUDE_DIR}
        ${PROTOBUF_INCLUDE_DIR})

set(SOURCE_FILES
        ../../Server.cpp
        ../../Server.h
        ../../Package.h
        ../../Package.cpp
        ../../SessionManager.cpp
        ../../SessionManager.h
        ../../Peer.cpp
        ../../Peer.h
        ../../protobuf/source/login.pb.h
        ../../protobuf/source/login.pb.cc
        ../../extern/easylogging++.cc
        ../../extern/easylogging++.h
        main.cpp)

add_executable(server ${SOURCE_FILES})

target_link_libraries(server ${Boost_LIBRARIES} ${PROTOBUF_LIBRARY})