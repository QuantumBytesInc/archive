include(FindProtobuf)
find_package(Protobuf REQUIRED)
include_directories(${PROTOBUF_INCLUDE_DIR})


set(SOURCE_FILES
        ../../Package.cpp
        ../../Package.h
        test.pb.h
        test.pb.cc
        main.cpp)

add_executable(protobuf ${SOURCE_FILES})


TARGET_LINK_LIBRARIES(protobuf ${PROTOBUF_LIBRARY})