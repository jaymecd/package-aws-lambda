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
	# $@ ...
	find . -type d -name .pytest_cache -print0 | xargs -r -0 rm -rf
	find . -type f -name '*.pyc' -print0 | xargs -r -0 rm -rf
	find . -type d -name '__pycache__' -print0 | xargs -r -0 rm -rf
	# $@: done
.PHONY: clean

## Run initial unit tests
test-initial:
	make test -C code_initial
.PHONY: test-initial

## Run final unit tests
test-final:
	make test -C code_final
.PHONY: test-final
