#include "../../Package.h"
#include <string>
#include <iostream>
#include "test.pb.h"


int main(int argc,char *argv[]) {
    GOOGLE_PROTOBUF_VERIFY_VERSION;

    // Write person
    tutorial::Person person;

    person.set_name("hans");
    person.set_email("hans@hans.com");
    person.set_id(2);

    std::string *person_str = new std::string;
    person.SerializeToString(person_str);

    // Read person
    tutorial::Person person2;
    person2.ParseFromString(*person_str);

    std::cout << "ID: " << person2.id() << std::endl;
    std::cout << "Name: " << person2.name() << std::endl;
    std::cout << "Mail: " << person2.email() << std::endl;

    return 0;
}