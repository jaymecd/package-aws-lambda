# Make AWS Lambda handler testable: Python edition

Initial code mentioned in the article could be found in [initial_code](initial_code) directory.

## Prerequisites

- `pytest` to run unit tests. Install with `pipx`, `pip3`, `pipenv` or whatever package manager you like most.

## Usage

Run test on final code:

```shell
$ make test
```

Run test on initial code:

```shell
$ make test -C initial_code/
```
