// CueTrigger for Shelly
// Shelly Plus i4 switch/push button to Visual Productions CueCore 3, CueCore 2, QuadCore & Cuety LPU-2
// Copyright © 2024 Johan Nilsson - https://gobo.ws. All rights reserved. 
// Visual Productions and Shelly are trademarks of their respective owners.

// Use the following URL to update a KVS variable on a Shelly device (this example sets cue with ID 1 to 3):
// http://<hostname/ip>/rpc/KVS.Set?key="cueId1"&value="3"

// After updating a KVS variable on the Shelly you need to restart the script:
// Stop the script with ID 1:
// http://<hostname/ip>/rpc/Script.Stop?id=1

// Start the script with ID 1:
// http://<hostname/ip>/rpc/Script.Start?id=1


// Default configuration
let defaultConfig = {
    hostname: 'haarlem.visualproductions.nl:91', // Device hostname/IP
    mode: 'switch', // Options: 'switch' or 'pushbutton'
    deviceType: 'CueCore', // Options: 'CueCore', 'QuadCore', 'CuetyLPU2'
	
    // Playback IDs for each push button. CueCore3 (01-16), CueCore2 (01-08), QuadCore (01-06), Cuety LPU-2 (01-64)
    pbId1: '01', // Playback ID for switch/push button 1
    pbId2: '01', // Playback ID for switch/push button 2
    pbId3: '01', // Playback ID for switch/push button 3
    pbId4: '01', // Playback ID for switch/push button 4
	
    // Cue IDs for each switch/push button (1-32) except for Cuety LPU-2 (1-48)
    cueId1: 1, // Cue ID for switch/push button 1
    cueId2: 2, // Cue ID for switch/push button 2
    cueId3: 3, // Cue ID for switch/push button 3
    cueId4: 4  // Cue ID for switch/push button 4
};

// Load configuration from KVS or fallback to default
function loadConfigFromKVS() {
    CONFIG = Object.assign({}, defaultConfig);
    let keys = Object.keys(defaultConfig);
    
    let loadNextConfig = function(index) {
        if (index < keys.length) {
            let key = keys[index];
            Shelly.call("KVS.Get", { key: key }, function (result, error_code, error_message) {
                if (error_code === 0 && result.value) {
                    CONFIG[key] = result.value;
                } else {
                    Shelly.call("KVS.Set", { key: key, value: defaultConfig[key] });
                }
                loadNextConfig(index + 1);
            });
        } else {
            runCueTrigger();
        }
    };
    
    loadNextConfig(0);
}

// Save configuration to KVS
function saveConfigToKVS() {
    let keys = Object.keys(CONFIG);
    keys.forEach(function(key) {
        Shelly.call("KVS.Set", { key: key, value: CONFIG[key] }, function (result, error_code, error_message) {
            if (error_code === 0) {
                print("Configuration saved to KVS: " + key);
            } else {
                print("Error saving config to KVS: " + key + ", " + error_message);
            }
        });
    });
}

// Construct the API URL
function getApiUrl(pbId, cueId, action) {
    let url = 'http://' + CONFIG.hostname + '/ajax/pb/' + pbId;
    if (CONFIG.deviceType === 'CuetyLPU2' || CONFIG.deviceType === 'QuadCore') {
        url += action === 'jump' ? '/jmp=' + cueId : '/rel';
    } else {
        url += action === 'jump' ? '/jump=' + cueId : '/release';
    }
    return url;
}

// Send commands based on switch state
function sendPlaylistCommand(switchId, state) {
    let cueId = CONFIG['cueId' + switchId];
    let pbId = CONFIG['pbId' + switchId];
    let action = state ? 'jump' : 'release';
    let url = getApiUrl(pbId, cueId, action);
    print((state ? 'Triggering' : 'Stopping') + ' cue: ' + cueId + ' in playback: ' + pbId);
    Shelly.call("http.request", { method: "GET", url: url });
}

// Trigger a cue in push button mode
function triggerCue(switchId) {
    let cueId = CONFIG['cueId' + switchId];
    let pbId = CONFIG['pbId' + switchId];
    let url = getApiUrl(pbId, cueId, 'jump');
    print('Triggering cue: ' + cueId + ' in playback: ' + pbId);
    Shelly.call("http.request", { method: "GET", url: url });
}

// Event handler for input events
Shelly.addEventHandler(function (event) {
    if (event.name === 'input') {
        if (CONFIG.mode === 'switch') {
            if (event.info && event.info.state !== undefined) {
                sendPlaylistCommand(event.id + 1, event.info.state);
            }
        } else if (CONFIG.mode === 'pushbutton' && event.info.state === true) {
            triggerCue(event.id + 1);
        }
    }
});

// Initialize the script
function runCueTrigger() {
    print("CueTrigger for Shelly is running in " + CONFIG.mode + " mode. Device hostname/IP: " + CONFIG.hostname + "");
}

// Loading the configuration
loadConfigFromKVS();
