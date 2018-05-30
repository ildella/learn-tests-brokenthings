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
defaultAppName=newapp-ci
echo 'Checking config from build.conf':
[ -z "$REPO" ] && echo "Error - missing REPO, quitting" && exit 1
[ -z "$APP" ] && echo "Info - missing APP, using default name 'newapp-ci'" && APP=$defaultAppName
[ -z "$SLACK_TOKEN" ] && echo "Info - no SLACK_TOKEN, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_CHANNEL" ] && echo "Info - no SLACK_CHANNEL, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_USERNAME" ] && SLACK_USERNAME=Triacos
[ -z "$DEV_URL" ] && DEV_URL=https://$DEV_APP.herokuapp.com
[ "$slackEnabled" = true ] && export SLACK_TOKEN=$SLACK_TOKEN
echo app name: $APP
echo slack enabled: $slackEnabled
$steps; echo 'get the code...'; $log;
git clone --branch 'master' $REPO ~/$APP
cd ~/$APP
echo working folder `pwd`
git pull origin master
$steps; echo 'run unit tests...'; $log;
# npm run eslint
npm ci
# npm run unit-tests
$steps; echo 'setting application config...'; $log;
[ -z "$DEV_APP" ] && echo "No DEV_APP"
[ "$DEV_APP" ] && heroku config:pull -f .env -a $DEV_APP && heroku config:push -a $APP -o -c -f .env
$steps; echo 'pushing to ci app and running ci tests'; $log;
git remote add ci https://git.heroku.com/$APP.git
git push ci master
source .env
export BASEURL=$DEV_URL	
npm run smoke-tests
$steps; echo 'all good, pushing to dev...'; $log;
git remote add dev https://git.heroku.com/$DEV_APP.git
git push dev master
$steps; echo notify team...; $log;
# Configure Slack --> get a token from https://api.slack.com/custom-integrations/legacy-tokens
slack -c $SLACK_CHANNEL -m "Build completed --> $DEV_URL" -u $SLACK_USERNAME
$normal; echo 'Triacos wishes you an happy day'