const Config = require('./Config')
const csv = require('csvtojson')
const DataValidator = require("./DataValidator")
const LiveRampRequestBuilder = require("./LiveRampRequestBuilder")
const axiosInstance = require("./Axios")
const throat = require('throat');
const ResponseParser = require("./ResponseParser")
const fs = require('fs');

(async function() {

    //parse command line args
    let config
    try {
        config = new Config(false, "data/PII.csv", 50000)
        config.parseCommandLineArgs()
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
    //load and parse PII CSV dile
    let validator
    try {
        const rawPIIData = await csv().fromFile(config.PIIFile);
        //50,000 is 3.5 MB with full addresses, we should keep this below 5 MB
        validator = new DataValidator(config)
        validator.validate(rawPIIData)
    } catch (e) {
        console.log(e);
        process.exit(1)
    }

    //build request body and make network call to LiveRamp
    let stats = new ResponseParser()

    try {
        let index = 0
        while (validator.hasMoreRows()) {
            index++
            const request = LiveRampRequestBuilder.buildRequestBody(config, validator.getRows(1000))
            const response = await axiosInstance.post(config.endpointURL, request)
            stats.addResponseData(request, response)
            fs.writeFileSync("./output/request" + index + ".json", JSON.stringify(request, null, 4))
            fs.writeFileSync("./output/response" + index + ".json", JSON.stringify(response.data, null, 4))
        }

    } catch (e) {
        console.log(e);
        process.exit(1)
    }

    // display results
    try{
        console.log(JSON.stringify(stats, null, 4))
        fs.writeFileSync("./output/stats.json", JSON.stringify(stats, null, 4))
    } catch (e) {
        console.log(e);
        process.exit(1)
    }

})();