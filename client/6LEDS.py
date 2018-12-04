
import picamera
from subprocess import call
import time 
import os
import pygame
import pygame.camera
import datetime
#LED code
import RPi.GPIO as GPIO
import time

import pygame, sys
from pygame.locals import *

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup (18, GPIO.OUT)
print("LED on")

GPIO.output (18,GPIO.HIGH)
time.sleep(5)
GPIO.output (18,GPIO.LOW)

