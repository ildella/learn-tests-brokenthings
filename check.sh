#!/bin/bash
source build.conf
echo $SLACK_CHANNEL
[ -z "$SLACK_TOKEN" ] && echo "Info - no SLACK_TOKEN environment variable set, Slack notification disabled"
echo $PWD
tput setaf 1; echo "red"
tput setaf 2; echo "green"
tput setaf 3; echo "yellow"
tput setaf 4; echo "blue"
tput setaf 5; echo "purple"
tput setaf 6; echo "cyan"
tput setaf 7; echo "white"
tput setaf 8; echo "grey"
tput setaf 9; echo "more red"
tput setaf 10; echo "more green"
tput setaf 11; echo "more yellow"
tput setaf 12; echo "light blue"
tput setaf 15; echo "more white"
tput setaf 21; echo "more blue"
tput setaf 22; echo "dark green"
tput setaf 59; echo "more purple"
tput setaf 69; echo "more purple"
tput setaf 79; echo "more purple"
tput setaf 89; echo "more purple"
tput setaf 99; echo "more purple"
tput setaf 199; echo "more purple"
red='tput setaf 9' 
# red1 echo "this is red text, again"
$red; echo `pwd`
result=`npm run integration-tests`
# echo $result