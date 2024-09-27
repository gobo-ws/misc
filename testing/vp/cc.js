// Shelly Plus i4 switch/push button to Visual Productions CueCore 3, CueCore 2, QuadCore & Cuety LPU-2
// Copyright (C) 2024 Johan Nilsson. https://gobo.ws

// Configuration
let CONFIG = {
    hostname: 'haarlem.visualproductions.nl:91', // Device hostname/IP
    mode: 'switch', // Options: 'switch' or 'pushbutton'
    deviceType: 'CueCore', // Options: 'CueCore', 'QuadCore', 'CuetyLPU2'

    // Playback IDs for each switch/push button. CueCore3 (01-16), CueCore2 (01-08), QuadCore (01-06), Cuety LPU-2 (01-64)
    pbId1: '01', // Playback ID for switch/push button 1
    pbId2: '01', // Playback ID for switch/push button 2
    pbId3: '01', // Playback ID for switch/push button 3
    pbId4: '01', // Playback ID for switch/push button 4

    // Cue IDs for each switch/push button (1-32) except for Cuety LPU-2 (1-48)
    cueId1: 1, // Cue ID for switch/push button 1
    cueId2: 2, // Cue ID for switch/push button 2
    cueId3: 3, // Cue ID for switch/push button 3
    cueId4: 4, // Cue ID for switch/push button 4
};

const API_ENDPOINT = '/ajax'; 

// Log that the script is running
print("Shelly to " + CONFIG.deviceType + " (" + CONFIG.hostname + ") cue trigger is running in " + CONFIG.mode + " mode");

// Construct the API URL based on device type and action
function getApiUrl(pbId, cueId, action) {
    let url = 'http://' + CONFIG.hostname + API_ENDPOINT + '/pb/' + pbId;
    if (CONFIG.deviceType === 'CuetyLPU2' || CONFIG.deviceType === 'QuadCore') {
        if (action === 'jump') {
            url += '/jmp=' + cueId;
        } else if (action === 'release') {
            url += '/rel';
        }
    } else {
        if (action === 'jump') {
            url += '/jump=' + cueId;
        } else if (action === 'release') {
            url += '/release';
        }
    }
    return url;
}

// Function to send playlist command based on switch state
function sendPlaylistCommand(switchId, state) {
    let cueId = CONFIG['cueId' + switchId];
    let pbId = CONFIG['pbId' + switchId];
    
    let action = state === true ? 'jump' : 'release';
    let url = getApiUrl(pbId, cueId, action);

    // Log the triggering or stopping action
    print((state === true ? 'Triggering' : 'Stopping') + ' cue: ' + cueId + ' in playback: ' + pbId);

    Shelly.call("http.request", {
        method: "GET",
        url: url
    });
}

// Function to trigger a cue
function triggerCue(switchId) {
    let cueId = CONFIG['cueId' + switchId];
    let pbId = CONFIG['pbId' + switchId];
    
    let url = getApiUrl(pbId, cueId, 'jump');
    
    // Log the triggering action
    print('Triggering cue: ' + cueId + ' in playback: ' + pbId);

    Shelly.call("http.request", {
        method: "GET",
        url: url
    });
}

// Event handler for input events
Shelly.addEventHandler(function (event) {
    if (event && event.name && event.name === 'input') {  
        if (CONFIG.mode === 'switch') {
            if (event.info && event.info.state !== undefined) {
                sendPlaylistCommand(event.id + 1, event.info.state);
            }
        } else if (CONFIG.mode === 'pushbutton') {
            if (event.info && event.info.state === true) {
                triggerCue(event.id + 1);
            }
        }
    }
});
