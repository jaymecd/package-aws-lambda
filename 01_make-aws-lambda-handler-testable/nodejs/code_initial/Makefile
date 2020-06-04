MAKEFLAGS += --warn-undefined-variables
SHELL := bash -o pipefail -c
.DEFAULT_GOAL := help

## Display this help
help:
	@ echo 'Usage: make <target>'
	@ echo
	@ echo 'Available targets are:'
	@ awk '/^[[:alnum:]]+([\.\-_][[:alnum:]]*)*:/ \
		{if (match(line, /^## (.*)/)) { \
			printf "    %s^%s\n", substr($$1, 0, index($$1, ":")-1), substr(line, RSTART + 3, RLENGTH); \
		}} { line = $$0 }' $(MAKEFILE_LIST) | sort | column -t -s^
	@ echo
.PHONY: help

## Run unit tests
test:
	npx jest --verbose --rootDir=.
.PHONY: test
