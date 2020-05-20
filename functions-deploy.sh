#!/bin/sh
cd ./backend-firebase
firebase deploy --only functions
cd ..
