#!/bin/bash

# ola-dmx-control.sh
# This bash script will update the specified DMX channels while preserving the old values on the remaining channels in the universe.
# Requires OLA, curl and jq
# Copyright (C) 2023 Johan Nilsson. https://gobo.ws

# Settings
# Define the OLA server URL and universe:
OLA_SERVER="http://localhost:9090"
UNIVERSE=1

# Check if the user provided channel-value pairs as arguments
if [ "$#" -lt 2 ] || [ $(( $# % 2 )) -ne 0 ]; then
  echo "Usage: $0 <channel_number> <new_value> [<channel_number> <new_value> ...]"
  exit 1
fi

# Function to update DMX data
update_dmx() {
  CHANNEL_TO_UPDATE=$1
  NEW_VALUE=$2

  # Retrieve current DMX data
  DMX_DATA=$(curl -s "${OLA_SERVER}/get_dmx?u=${UNIVERSE}" | jq -r '.dmx | @csv')

  # Update specified channel with the new value
  DMX_DATA=$(echo $DMX_DATA | awk -v channel="$CHANNEL_TO_UPDATE" -v value="$NEW_VALUE" 'BEGIN {FS=","; OFS=","} { $channel = value } 1')

  # Send the updated DMX data back to the OLA server
  curl -s -X POST -d "u=${UNIVERSE}&d=${DMX_DATA}" "${OLA_SERVER}/set_dmx"
  echo "Updated channel ${CHANNEL_TO_UPDATE} to ${NEW_VALUE}"
}

# Loop through the provided channel-value pairs
while [ $# -gt 0 ]; do
  update_dmx $1 $2

  # Shift the arguments to process the next channel-value pair
  shift 2
done
