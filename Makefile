# Path to the node engine
NODE ?= /opt/nodejs/7/bin/node
NPM ?= /opt/nodejs/7/bin/npm

# Install npm modules
install:
	$(NPM) install

start:
	$(NODE) index.js