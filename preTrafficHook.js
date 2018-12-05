'use strict';

const AWS = require('aws-sdk');
const codedeploy = new AWS.CodeDeploy({apiVersion: '2014-10-06'});
var lambda = new AWS.Lambda();

exports.handler = (event, context, callback) => {

	console.log("Entering PreTraffic Hook!");

	// Read the DeploymentId & LifecycleEventHookExecutionId from the event payload
    var deploymentId = event.DeploymentId;
	var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

	var functionToTest = process.env.NewVersion;
    var doValidationChecks = process.env.HookEnabled;
	console.log("Testing new function version: " + functionToTest);

	// Perform validation of the newly deployed Lambda version
	var lambdaParams = {
		FunctionName: functionToTest,
		InvocationType: "RequestResponse"
	};

	var lambdaResult = "Failed";
	lambda.invoke(lambdaParams, function(err, data) {
		if (err) {	// an error occurred
			console.log(err, err.stack);
			lambdaResult = "Failed";
		}
		else {	// successful response
			var result = JSON.parse(JSON.parse(data.Payload));
			console.log("Result: " +  JSON.stringify(result));
			console.log(doValidationChecks);
			console.log(result.message);
			// Check the response for valid results
			// {
			//		"message": "Hello World!"
            // }
            if (doValidationChecks === "false") {
                lambdaResult = "Succeeded";
                console.log ("Validation testing bypassed due to Env Var HookEnabled");
            }
            else if (result.message === "Hello World!") {
                lambdaResult = "Succeeded";
                console.log ("Validation testing succeeded!");
            }
            else {
                lambdaResult = "Failed";
                console.log ("Validation testing failed!");
            }

			// Complete the PreTraffic Hook by sending CodeDeploy the validation status
			var params = {
				deploymentId: deploymentId,
				lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
				status: lambdaResult // status can be 'Succeeded' or 'Failed'
			};
			
			// Pass AWS CodeDeploy the prepared validation test results.
			codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, data) {
				if (err) {
					// Validation failed.
					console.log('CodeDeploy Status update failed');
					console.log(err, err.stack);
					callback("CodeDeploy Status update failed");
				} else {
					// Validation succeeded.
					console.log('Codedeploy status updated successfully');
					callback(null, 'Codedeploy status updated successfully');
				}
			});
		}  
	});
}