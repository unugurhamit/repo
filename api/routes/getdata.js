
// variable declarations
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const express = require('express');
const router = express.Router();
const request = require('request-promise'); // request with Promise support
var bodyParser = require('body-parser');
const errorObj = {"code":99,"message":"An error occured !"};
const successObj = {"code":0,"message":"success"};
var inputValidationError = false;

// connect to DB
try {
	client.connect();
	console.log("Connected to MongoDB ...");
} catch (e) {
	console.log("Connection error : " + e);
}

// POST
router.post('/', async function (req, res) {
	// get the body of the request
	var body = '';
	req.on('data', function (data) {
		body += data;
	});

	// wait for the body end
	await req.on('end', async function () {
		try {
			var req_body_json = await JSON.stringify(body);
			var parsedParams = JSON.parse(body);
			
			// input validations
			if(
				Number.isNaN(Number.parseFloat(parsedParams.minCount)) 
				|| Number.isNaN(Number.parseFloat(parsedParams.maxCount)) 
				|| Number.isNaN(Date.parse(parsedParams.startDate)) 
				|| Number.isNaN(Date.parse(parsedParams.endDate))
			){
				res.status(200).json({
					"code": errorObj.code,
					"msg": errorObj.message,
					"error": "Check your inputs !"
				});
				return;
			}

			// parse and get the inputs 
			let minCount = parsedParams.minCount;
			let maxCount = parsedParams.maxCount;
			let startDate = new Date(parsedParams.startDate);
			startDate.setHours(0, 0, 0, 0); // set the time to start of the day
			let endDate = new Date(parsedParams.endDate);
			endDate.setHours(23, 59, 59, 59); // set the time to end of the day

			// get data with filters
			try {
				client.db("getir-case-study").collection("records").aggregate([
					{
						$project: { // find sum of the counts
							_id: false,
							key: "$key",
							createdAt: "$createdAt",
							totalCount: { $sum: "$counts" },
						}
					},
					{
						$match: // other filters for totalCount and createdAt
						{
							'totalCount':
							{
								$gte: minCount,
								$lte: maxCount
							},
							'createdAt':
							{
								$gte: startDate,
								$lte: endDate
							}
						}
					},
				]).toArray(function (err, result) {
					//console.log("collection result : " + result + " err : " + err);
					// return expected response 
					res.status(200).json({
						"code": successObj.code,
						"msg": successObj.message,
						"records": result
					});
				});
			} catch (e) {
				console.log("ERROR : " + e);
				res.status(200).json({
					"code": errorObj.code,
					"msg": errorObj.message,
					"error": e.message
				});
			}
		} catch (e) {
			res.status(200).json({
				"code": errorObj.code,
				"msg": errorObj.message,
				"error": e.message
			});
		}
		return;
	});
});

module.exports = router;


/*
Unit test for testing the API working correctly; run the command below;
npm run test-dev
*/