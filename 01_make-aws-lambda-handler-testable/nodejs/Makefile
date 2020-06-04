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

## Clean up garbage
clean:
	rm -rf node_modules package-lock.json
.PHONY: clean

## Run initial unit tests
test-initial:
	make test -C code_initial
.PHONY: test-initial

## Run final unit tests
test-final:
	make test -C code_final
.PHONY: test-final
