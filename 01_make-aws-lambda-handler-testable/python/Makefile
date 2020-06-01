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
	find . -type f -name '*.pyc' -print0 | xargs -r -0 rm -rf
	find . -type d -name '__pycache__' -print0 | xargs -r -0 rm -rf
	# $@: done
.PHONY: clean

HAS_PYTEST := $(shell pytest -V &>/dev/null && echo 1)

## Run unittests
test:
ifneq ($(HAS_PYTEST),1)
	$(error pytest command was not found)
endif
	pytest -v test
.PHONY: test
