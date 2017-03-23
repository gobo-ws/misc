**OLA on RPi 3 and C.H.I.P.**

sudo apt-get update  
sudo apt-get upgrade  
sudo apt-get install git libcppunit-dev libcppunit-1.13-0 uuid-dev pkg-config libncurses5-dev libtool autoconf automake g++ libmicrohttpd-dev \
 libmicrohttpd10 protobuf-compiler libprotobuf-lite9 python-protobuf libprotobuf-dev libprotoc-dev zlib1g-dev bison flex make libftdi-dev  libftdi1 libusb-1.0-0-dev liblo-dev libavahi-client-dev python-numpy  
 git clone https://github.com/OpenLightingProject/ola.git ola  
 cd ola  
 autoreconf -i  
 ./configure --enable-rdm-tests CXXFLAGS='-ftrack-macro-expansion=0'  
 make  
 make check  
 sudo make install  
 sudo ldconfig  
 sudo nano /etc/rc.local

Add the following line before the line exit 0 at the end, then save the file and exit:  
echo 'Sleep 15 seconds before starting olad' sleep 15 echo 'Starting olad' sudo -u user olad -f --syslog

sudo adduser user dialout
