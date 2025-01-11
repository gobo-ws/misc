#!/bin/bash

# Settings
OLA_SERVER="http://localhost:9090"
UNIVERSE=1
SLEEP_DURATION=0.05  # 50 ms delay between updates

# Validate arguments
if [ "$#" -lt 2 ] || [ $(( $# % 2 )) -ne 0 ]; then
  exit 1
fi

# Retrieve current DMX data once
CURRENT_DMX=$(curl -s "${OLA_SERVER}/get_dmx?u=${UNIVERSE}" | jq -r '.dmx | @csv' | tr ',' ' ')

# Exit if DMX data retrieval fails
[ -z "$CURRENT_DMX" ] && exit 1

# Update channel values locally
while [ $# -gt 0 ]; do
  CHANNEL_TO_UPDATE=$1
  NEW_VALUE=$2

  # Skip invalid inputs
  if [ "$CHANNEL_TO_UPDATE" -gt 0 ] && [ "$CHANNEL_TO_UPDATE" -le 512 ] && [ "$NEW_VALUE" -ge 0 ] && [ "$NEW_VALUE" -le 255 ]; then
    CURRENT_DMX=$(echo "$CURRENT_DMX" | awk -v channel="$CHANNEL_TO_UPDATE" -v value="$NEW_VALUE" 'BEGIN {OFS=" "} { $channel = value } 1')
    sleep $SLEEP_DURATION  # Add delay between updates
  fi

  # Shift to the next pair
  shift 2
done

# Send updated DMX data to OLA server
echo "$CURRENT_DMX" | tr ' ' ',' | ola_streaming_client -u $UNIVERSE
