#!/bin/bash
normal='tput setaf 7'
log='tput setaf 12'
steps='tput setaf 2'
$normal; echo 'Triacos - build automation since 2018'
source build.conf
echo `git --version`
echo node version `node --version`
echo npm version `npm --version`
echo `heroku --version`
slackEnabled=true
$steps; echo 'Checking config from build.conf...'; $log;
[ -z "$REPO" ] && echo "Error - No REPO, quitting" && exit 1
# [ -z "$1" ] && echo "Error - First param must be the tag version, quitting" && exit 1
[ -z "$DEV_APP" ] && echo "No DEV_APP, quitting" && exit 1
[ -z "$APP" ] && echo "Info - No APP, quitting" && exit 1
[ -z "$SLACK_TOKEN" ] && echo "Info - Missing SLACK_TOKEN, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_CHANNEL" ] && echo "Info - Missing SLACK_CHANNEL, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_USERNAME" ] && SLACK_USERNAME=Triacos
[ -z "$DEV_URL" ] && DEV_URL=https://$DEV_APP.herokuapp.com
[ "$slackEnabled" = true ] && export SLACK_TOKEN=$SLACK_TOKEN
# TAG=$1
echo DEV app: $DEV_APP
echo DEV url: $DEV_URL
# echo TAG: $TAG
echo slack enabled: $slackEnabled
$steps; echo "get the code from $REPO..."; $log;
mkdir ~/builds 
# rm -rf ~/builds/$APP
# git clone $REPO ~/builds/$APP
git clone --branch 'master' $REPO ~/builds/$APP
cp .env ~/builds/$APP
cd ~/builds/$APP
echo working folder `pwd`
# source .env
git pull origin master
# git checkout $TAG
$steps; echo 'build...'; $log;
npm ci
npm run eslint
$steps; echo 'run tests...'; $log;
export LOG_LEVEL=info
npm run tests
$steps; echo "all good, pushing to $DEV_APP..."; $log;
git remote add dev https://git.heroku.com/$DEV_APP.git
git push dev master
$steps; echo Done. Notify team...; $log;
# Configure Slack --> get a token from https://api.slack.com/custom-integrations/legacy-tokens
slack -c $SLACK_CHANNEL -m "Build completed --> $DEV_URL" -u $SLACK_USERNAME
$normal; echo 'Triacos wishes you an happy day'