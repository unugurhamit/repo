const request = require('request-promise'); // request with Promise support
const bodyJSON = '{"startDate": "2016-01-01","endDate": "2020-06-28","minCount": 150,"maxCount": 170}';
const apiUrl = "/getdata"; // http://localhost:3004

/* this test verify the functionality of API that returns the filtered data from getir-case-study DB */
describe("verifyData()", () => {
    test('getData should return true', async (done) => {
        let result = false;
        try { // test the api with the code = 0 for success
            request.post({
                headers: { 'content-type': 'application/json' },
                url: apiUrl,
                body: bodyJSON
            }, async function (error, response, body) {

                if (error)
                    result = false;

                var resBody = await response.body;
                var parsedData = JSON.parse(resBody);
                //console.log("JEST : " + resBody);
                if (parsedData.code === 0)
                    result = true;
                else
                    result = false;

                expect(result).toEqual(true);
                done();
            });
            
        } catch (err) {
            result = false;
            expect(result).toEqual(true);
            done();
        }
    });
});

