**OLA on RPi 4 (Raspbian Buster Lite)**

sudo apt-get update  
sudo apt-get upgrade  
sudo apt-get install git libtool libcppunit-dev uuid-dev pkg-config libncurses5-dev autoconf libmicrohttpd-dev protobuf-compiler python-protobuf bison libprotoc-dev libbison-dev flex libfl-dev libfl2 libftdi-dev libftdi1 libusb-0.1-4 libusb-dev libusb-1.0-0-dev liblo-dev libavahi-client-dev python-numpy

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
``` 
echo "Sleep 15 seconds before starting olad"
sleep 15
echo "Starting olad"
sudo -u testuser olad -f --syslog
``` 

sudo adduser testuser dialout
