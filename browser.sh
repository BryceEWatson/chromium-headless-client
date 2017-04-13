#!/bin/bash

status=`ps -efww | grep -w "[C]anary"`
if [ ! -z "$status" ]; then
        echo "Canary browser already running."
        exit 0;
fi

"/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" --headless --remote-debugging-port=9222 &
