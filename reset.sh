#!/bin/bash
echo 'Triacos - build automation since 2018'
echo 'reset build environment'
source build.conf
git --version
npm --version
node --version
# APP=worm-api-ci
echo app name: $APP
rm -rf ~/builds/$APP
heroku config:pull -f .env.pulled -a $DEV_APP
heroku apps:destroy -a $APP --confirm $APP
heroku apps:create $APP -t $TEAM --region eu
heroku config:push -a $APP -o -c -f .env.pulled
rm .env.pulled
slack -c development -m "Build sandbox reset for: $APP" -u daniele
echo 'Triacos wishes you an happy day'
