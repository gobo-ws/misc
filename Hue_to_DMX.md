**Hue to DMX

Control DMX devices with your Philips Hue App.

**Requirements**

* [OLA](https://www.openlighting.org/ola/)
* [curl](https://curl.haxx.se/)
* [ha-bridge](https://github.com/bwssytems/ha-bridge/)

Add a new device in HA Bridge.  
Use the option: *Execute Script/Program as Device Type (Informational)*

**OnUrl:**  
`[{"item":"curl -d u=0 -d d=255 http://olahostname:9090/set_dmx","type":"cmdDevice"}]`

**DimUrl:**  
`[{"item":"curl -d u=0 -d d=${intensity.math(X*1)} http://olahostname:9090/set_dmx","type":"cmdDevice"}]`

**OffUrl:**  
`[{"item":"curl -d u=0 -d d=0 http://olahostname:9090/set_dmx","type":"cmdDevice"}]`

