#include "../../Package.h"
#include <string>
#include <iostream>


int main(int argc,char *argv[]) {
    // Encode package
    Package package(Package::TYPE_CONNECT);

    package.body_length(strlen("Test message"));
    memcpy(package.body(), "Test message", package.body_length());
    package.encode_header();

    // Decode package
    Package package2(Package::TYPE_CONNECT);
    package2.body_length(package.body_length());
    memcpy(package2.data(), package.data(), package.header_length + package.version_length);
    memcpy(package2.body(), package.body(), package.body_length());
    package2.decode_header();

    std::cout << package2.data() << std::endl;
    std::cout << package2.body();

    return 0;
}