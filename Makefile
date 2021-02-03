.PHONY: build test lint format

.DEFAULT:
build: test
	# TODO

test:
	@deno test --unstable -A

lint:
	@deno lint --unstable **/*.ts

.ONESHELL:
format:
	@deno fmt
