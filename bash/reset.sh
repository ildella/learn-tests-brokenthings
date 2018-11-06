#!/bin/bash
echo 'Triacos - build automation since 2018'
echo 'reset build environment'
source build.conf
echo `heroku --version`
[ -z "$DEV_APP" ] && echo "No DEV_APP, quitting" && exit 1
[ -z "$PIPELINE" ] && echo "No PIPELINE, quitting" && exit 1
echo app name: $DEV_APP
rm -rf ~/builds/$DEV_APP
heroku config:pull -f .env.pulled -a $DEV_APP
heroku apps:destroy -a $DEV_APP --confirm $DEV_APP
heroku apps:create $DEV_APP -t aTeamName --region eu --remote ci
heroku addons:create rediscloud:30 -a $DEV_APP
heroku pipelines:add $PIPELINE -s development -a $DEV_APP
heroku config:push -a $DEV_APP -o -c -f .env.pulled
rm .env.pulled
slack -c development -m "Build sandbox reset for: $APP" -u daniele
echo 'Triacos wishes you an happy day'
