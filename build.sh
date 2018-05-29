#!/bin/bash
tput setaf 7; echo 'Triacos - build automation since 2018'
source build.conf
echo `git --version`
echo node version `node --version`
echo npm version `npm --version`
echo `heroku --version`
# npm --version | xargs echo 'npm version'
slackEnabled=true
defaultAppName=newapp-ci
echo 'Checking config from build.conf':
[ -z "$REPO" ] && echo "Error - missing REPO, quitting" && exit 1
[ -z "$APP" ] && echo "Info - missing APP, using default name 'newapp-ci'" && APP=$defaultAppName
[ -z "$SLACK_TOKEN" ] && echo "Info - no SLACK_TOKEN, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_CHANNEL" ] && echo "Info - no SLACK_CHANNEL, Slack notification disabled" && slackEnabled=false
[ -z "$SLACK_USERNAME" ] && SLACK_USERNAME=Triacos
[ "$slackEnabled" = true ] && export SLACK_TOKEN=$SLACK_TOKEN
echo app name: $APP
echo slack enabled: $slackEnabled
tput setaf 2; echo 'get the code...'
tput setaf 8;
git clone --branch 'master' $REPO ~/$APP
cd ~/$APP
echo working folder `pwd`
git pull origin master
tput setaf 2; echo 'run unit tests...'
tput setaf 8;
# npm ci
# npm run unit-tests
tput setaf 2; echo 'setting application config...'
tput setaf 8;
[ -z "$DEV_APP" ] && echo "No DEV_APP"
[ "$DEV_APP" ] && heroku config:pull -f .env.pulled -a $DEV_APP && heroku config:push -a $APP -o -c -f .env.pulled
git remote add ci https://git.heroku.com/$APP.git
tput setaf 2; echo 'pushing code...'
tput setaf 8;
git push ci master
# npm run integration-tests
# Configure Slack --> get a token from https://api.slack.com/custom-integrations/legacy-tokens
tput setaf 2; echo notify team...
tput setaf 8;
slack -c $SLACK_CHANNEL -m "Build completed --> https://$APP.herokuapp.com" -u $SLACK_USERNAME
tput setaf 7; echo 'Triacos wishes you an happy day'