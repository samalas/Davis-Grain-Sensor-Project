#!/bin/bash

check_process() {
  echo "$ts: checking $1"
  [ "$1" = "" ]  && return 0
  [ `pgrep -n $1` ] && return 1 || return 0
}

while [ 1 ]; do
  # timestamp
  ts=`date +%T`

  echo "$ts: begin checking..."
  check_process "client0.py"
  [ $? -eq 0 ] && echo "$ts: client0 disconnected, restarting..." && ENV=production python client0
  check_process "client1.py"
  [ $? -eq 0 ] && echo "$ts: client1 disconnected, restarting..." && ENV=production python client1
  check_process "client2.py"
  [ $? -eq 0 ] && echo "$ts: client2 disconnected, restarting..." && ENV=production python client2
  sleep 20
done
