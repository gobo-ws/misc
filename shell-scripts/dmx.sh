#!/bin/bash

# Set the hostname for the OLA REST API
HOSTNAME="localhost"

# Check that at least two arguments are provided
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 -u<universe> <dmx_values...> (a comma separated list of values)"
  exit 1
fi

# Extract the universe from the arguments
UNIVERSE_ARG=$1
shift

# Check that the universe argument starts with -u
if [[ $UNIVERSE_ARG != -u* ]]; then
  echo "Usage: $0 -u<universe> <dmx_values...>"
  exit 1
fi

# Extract the universe ID
UNIVERSE=${UNIVERSE_ARG:2}

# Fetch the current DMX values from the OLA REST API
CURRENT_DMX=$(curl -s "http://$HOSTNAME:9090/get_dmx?u=$UNIVERSE")

# Check if the request was successful
if [[ $CURRENT_DMX == *"302 Found"* ]]; then
  echo "Error: Received 302 Found response. Please check the OLA REST API endpoint."
  exit 1
fi

# Convert the JSON response to an array of DMX values
CURRENT_DMX_ARRAY=($(echo $CURRENT_DMX | jq -r '.dmx[]'))

# Update the DMX values with the new values
IFS=',' read -r -a DMX_VALUES <<< "$*"
for i in "${!DMX_VALUES[@]}"; do
  if [ -n "${DMX_VALUES[$i]}" ]; then
    CURRENT_DMX_ARRAY[$i]=${DMX_VALUES[$i]}
  fi
done

# Convert the array back to a comma-separated string
UPDATED_DMX=$(IFS=,; echo "${CURRENT_DMX_ARRAY[*]}")

# Send the updated DMX values back to OLA with a POST request
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X POST -d "u=$UNIVERSE&d=$UPDATED_DMX" "http://$HOSTNAME:9090/set_dmx")

# Check if the request was successful
if [ "$RESPONSE" -ne 200 ]; then
  echo "Error: Failed to update DMX values. HTTP response code: $RESPONSE"
  exit 1
fi

echo "DMX values updated successfully for universe $UNIVERSE"
