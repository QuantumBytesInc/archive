FROM fedora
#Freshly updated fedora images with jenkins for cpp/qt projects 
MAINTAINER Tobias Trabelsi <Tobias.Trabelsi@HS-Bochum.de>
#Install QT5,jenkins and some dependencies
USER root
RUN dnf -y groupinstall "Development Tools";dnf -y install rpm-build createrepo glibc-devel wget qt5-qtbase.x86_64 qt5-qtbase-devel qt-devel java-1.8.0-openjdk gcc-c++ libarchive-devel openssl-devel SFML-devel python3-pip rb_libtorrent-deve
l rb_libtorrent boost-devel; pip3 install --user awscli;
