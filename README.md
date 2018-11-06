# Learn, Tests, and Broken Things

A personal repo where I collect sample code for different use cases and techonlogies

* The language is Javascript (ES6+). Mostly Node.js, some React
* Tests and code I use to learn libraries and tools
* My best practices for tests, linters, code coverage, continuous integrations.
* DevOps (aka: Infrastructure Code).
* Various stuff I like to share, like my bash aliases and some bash scripts I find useful
* Articles / Guides / How Tos... (coming soon...)

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/ildella/2018)
[![Build Status](https://travis-ci.com/ildella/learn-tests-brokenthings.svg?branch=master)](https://travis-ci.com/ildella/learn-tests-brokenthings)

## Some setup

Ok here are my ways to setup things. 
My standard toolchain includes nodejs, eslint, jest, pm2, dicital ocean cli, terraform cli, kubectl and a few more...
I'll start adding some docs here and expand later.

### NodeJS toolchain

```bash
# I use n (not nvm) as Node version manager. Why? Because.
curl -L https://git.io/n-install | bash -s -- -y
. "$HOME/.bashrc"
echo "n-> $(n --version)"
n stable
npm i -g npm
echo "node-> $(node --version)"
echo "npm-> $(npm --version)"

npm i -g pm2
echo "pm2-> $(pm2 --version)"
# pm2 completion install // this will install the completion code directly into .bashrc, which is messy.
pm2 completion > ~/.pm2.completion
echo '[[ -r ~/.pm2.completion ]] && . ~/.pm2.completion' >> ~/.bashrc
pm2 install pm2-logrotate
```

## Runnable stuff

### Websocket Server + React

```bash
cd nodejs && npm install && node src/websocket-server.js
cd reactjs/tutorial-app && npm install && npm start
```

This will launch a simple WebSocket server built on socket.io and the ReactJS tutorial app with a SocketIO component that connects to the server and print a welcome message. 

There are also some interesting example with Nodejs streams, generators and highlandjs in the [Node.js](nodejs) folder.

### Start PM2 with server + gateway

```bash
cd nodejs && npm install
cd gateway && npm install && cd ..
pm2 start ecosystem.config.js
```

Now ```curl http://localhost:7070/ip``` will give your IP address while ```curl http://localhost:7070``` will give you unauthorized. Obsiously calling directly the express server with ```curl http://localhost:3456``` will return the actual JSON. 

TODO: how to create credentials to bypass gateway security :)

## Why this name
It's inspired by an episode of Game of Thrones, the TV Series, titled [Cripple, Bastards, and Broken Things](http://awoiaf.westeros.org/index.php/Cripples,_Bastards,_and_Broken_Things)
The reason is that today, March 16th 2018, I decided to create this mostly as the repo for broken things that I want to share with other people, especially myself in the future, to remember the good times spent fixing code and learning things. 
