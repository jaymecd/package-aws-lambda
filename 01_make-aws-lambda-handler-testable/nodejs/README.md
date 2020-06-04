# Make AWS Lambda handler testable: NodeJS

Source code & unit tests:

- [final version](code_final)
- [initial version](code_initial)


## Prerequisites

Required dependencies:

- `jest` to run unit tests
- `aws-sdk` to communicate with AWS API

Install dependencies locally, if needed:

```shell
$ npm install
```


## Usage

Run test on final code:

```shell
$ make test-final
```

Run test on initial code:

```shell
$ make test-initial
```


## Clean up

Keep local repository clean:

```shell
$ make clean
```
