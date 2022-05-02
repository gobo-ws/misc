// Shelly - OLA DMX by gobo.ws

let CONFIG = {
    hostname: '192.168.0.1:9090', // OLA hostname:port
    universe: '1', // OLA universe
    dmx: '255,255,255', // OLA DMX data
    input1: 0, // Shelly Button ID (not in use at the moment)
};

print("Shelly - OLA DMX by gobo.ws running"); 

// add an evenHandler for single push button events
Shelly.addEventHandler(
    function (event, user_data) {
         if (typeof event.info.event !== 'undefined') {
            if (event.info.event === 'single_push') {
                let detached = isDetached(0);
                if (detached === true) {
                    print("");
                } else {
                    print('Sending ' + CONFIG.dmx + ' on universe ' + CONFIG.universe);
Shelly.call(
    "http.request", {
    method: "POST",
    url: 'http://' + CONFIG.hostname + '/set_dmx',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'u=' + CONFIG.universe + '&d=' + CONFIG.dmx
});
                }
            } else {
                return true;

            }
        } else {
            return true;
        }
    },
);

// checks if a button is in detached mode.
function isDetached(idswitch) {
    Shelly.call(
        "switch.getconfig", {
            id: idswitch
        },
        function (result, error_code, error_message) {
            if (result.in_mode === "detached") {
                return true;
            } else {
                return false;
            }
        }
    );
}
