# Make AWS Lambda handler testable: Python

Source code & unit tests:

- [final version](code_final)
- [initial version](code_initial)


## Prerequisites

Required dependencies:

- `pytest` to run unit tests
- `boto3` to communicate with AWS API

Install dependencies locally, if needed:

```shell
$ pip3 install --user -r requirements.txt
```


## Usage

Run tests on final code:

```shell
$ make test-final
```

Run tests on initial code:

```shell
$ make test-initial
```


## Clean up

Keep local repository clean:

```shell
$ make clean
```
