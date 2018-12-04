#!/bin/bash

python 6LEDS.py & fswebcam -d /dev/video0 -r 1280x1024 --no-banner -S 29 example.jpg
