.PHONY: vendor

vendor:
	-rm -r node_modules
	npm install --production