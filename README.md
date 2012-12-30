# LiveRefresh - SublimeText2 Plugin

Your SublimeText2 will include a websocket-server which sends a signal to all clients when you save a file.
This repository includes the browser- extensions/plugins too.

### Supported Browsers

* Google Chrome

## Installation

You have three ways to install LiveRefresh: using git, installing it manually or using the SublimeText2 "Package Controll" (Available here: http://wbond.net/sublime_packages/package_control)

### Install using git

To install this Plugin via git, simply browse to your 'Packages' folder like this:

for Windows

	cd %APPDATA%/Sublime Text 2/Packages

for OS X

	cd ~/Library/Application Support/Sublime Text 2/Packages

for Linux
 
	cd ~/.Sublime Text 2/Packages

for Portable Installations
	
	cd PATH_TO_PORTABLE_INSTALLATION/Sublime Text 2/Data/Packages

and clone this repository

	git clone https://github.com/PhilippSchaffrath/LiveRefresh


### Install manually

* Download the files using the GitHub .zip download option
* Unzip the files and rename the folder to 'LiveRefresh'
* Copy the folder to your Sublime Text 2 'Packages' directory

### Install using Package Control (NOT AVAILABLE AT THIS MOMENT)

If you are familiar with Package Control you definetly know what to do, if not, go to [SublimeText2 - Package Control](http://wbond.net/sublime_packages/package_control) click on 'Install' and follow the instructions

## How it works

The WebsocketServer running in SublimeText listens at port 1025. If you save a File, it will send "refresh" to all connected clients.

The included Chrome Extension allows you to connect to your SublimeText2. Simply insert host and port (defaults to 127.0.0.1:1025 if empty) and click "Connect", ready to go, your browser will now refresh and focus this tab when you save a File in SublimeText2.


## Usage

* Install the SublimeText2 Plugin and restart the Application
* Install the Browser Plugin/Extension and restart the Browser
* Open both and start the Browser Plugin
* Connect the Browser to your IP and let it refresh :)

## Release Notes

LiveRefresh is designed to work with the latest [development build](http://www.sublimetext.com/dev) of Sublime Text 2

## Development

The intension behind this, was because of personal sloth. If you want any new features or plugins or something, feel free to contact me, but also feel free to do them on your own. I cant promise to add any new functionallity.