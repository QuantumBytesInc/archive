find_package(Boost
        REQUIRED COMPONENTS system)

include_directories(${Boost_INCLUDE_DIR})

set(SOURCE_FILES
        ../../Package.h
        ../../Package.cpp
        ../../Client.h
        ../../Client.cpp
        ../../Peer.cpp
        ../../Peer.h
        main.cpp)

add_executable(client ${SOURCE_FILES})

target_link_libraries( client ${Boost_LIBRARIES} -lpthread)