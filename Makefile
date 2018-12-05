SHELL = /bin/bash

FUNCTION_ALIAS ?= prd
APPNAME ?= lambda-safe-deployments
ENV ?= dev
ENV_NO ?= 1


default: build deploy
clean:
	@rm -f handler.zip
	@rm -f *.out.yaml
	@rm -rf node_modules
	@rm -rf dist
	@rm -rf coverage

test: compile
	npm run lint
	npm test
	npm run remap

compile:
	npm install

# build and package with just the required deps, then put it back to dev
build: clean test
	ls -al
	rm -rf node_modules
	npm install --production --no-optional
	(cd dist/src; zip -q -r ../../handler.zip *.js lib)
	zip -u -q -r handler.zip node_modules
	npm install

.ONESHELL:
deploy:
	echo "`date`"|zip --archive-comment handler.zip
	aws --region $(AWS_REGION) cloudformation package \
		--template-file deploy.sam.yaml \
		--output-template-file deploy.out.yaml \
		--s3-bucket ops-dev-0-lambda-$(AWS_ACCOUNT_ID)-$(AWS_REGION) \
		--s3-prefix sam

	aws --region ${AWS_REGION} cloudformation deploy \
		--template-file deploy.out.yaml \
		--capabilities CAPABILITY_IAM \
		--stack-name $(PRODUCT)-$(ENV)-$(ENV_NO)-$(APPNAME) \
		--no-fail-on-empty-changeset \
		--parameter-overrides \
			FunctionAlias=$(FUNCTION_ALIAS) \
			Environment=$(ENV) \
			EnvironmentNumber=$(ENV_NO) \
			Product=$(PRODUCT) \
		--tags Name=$(PRODUCT)-$(ENV)-$(ENV_NO)-$(APPNAME) \
			Service=lambda \
			Environment=$(ENV)-$(ENV_NO) \
			Application=$(APPNAME) \
			Product=$(PRODUCT) \
			Tenant=nbos \
			Role=app \
			UpdateTime="$(shell date)"

.PHONY: all ci clean test setup compile build deploy