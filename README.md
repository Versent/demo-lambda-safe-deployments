# Demo: Lambda/Stepfunctions Deployment Preferences

This repo is a working implementation of AWS [Serverless Application Model]( https://github.com/awslabs/serverless-application-model) (SAM) deployment preferences.

The majority of interest will be in the deploy.sam.yaml

This file contains the deployment information for a simple hello-world lambda function. This contains example of how to enable:

* Canary/Linear Deployments
* PreTraffic lambda function validation (Post traffic enabled the same way)
* Alarms to trigger automated cloudformation rollback based on error threshold
* Conditions to control when these

To test out these deployment strategies, recommendation is to deploy into nbos-sandbox-np.
The conditions in the same template have excluded dev so you can swap between dev/tst in sandbox to see the differences (stg does not exist in sandbox)

* dev will be a quick deployment
* tst will be a safe deployment with all options enabled

## Requirements

### Dependancies

* GNU Make > 4.2.1
* aws-cli > 1.14.60
* node version > 11.1.0
* npm version > 6.4.1
* saml2aws > 2.10.0

### Dev Dependancies

* direnv

## Build

Build commands are configured in the Makefile:

`make build`

## Deploy

To deploy this locally:
1) Have a valid AWS Account cli session configured (saml2aws) 
2) Have your environment variables configured (direnv or manually)

`make deploy`

More information on Deployment Preferences is available at:

* [Versent Confluence](hhttps://versent.atlassian.net/wiki/spaces/PRAC/pages/703562074/Step+Functions)
* [SAM Safe Lambda Deployments](https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst)
* [AWS Blog - Implmenting Canary Deployments](https://aws.amazon.com/blogs/compute/implementing-canary-deployments-of-aws-lambda-functions-with-alias-traffic-shifting/)
