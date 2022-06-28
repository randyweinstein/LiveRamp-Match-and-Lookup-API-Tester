const Config = require('./Config')
const csv = require('csvtojson')
const DataValidator = require("./DataValidator")
const LiveRampRequestBuilder = require("./LiveRampRequestBuilder")
const axiosInstance = require("./Axios")
const ResponseParser = require("./ResponseParser")
const fs = require('fs');

(async function() {

    //parse command line args
    let config
    try {
        config = new Config(false)
        config.parseCommandLineArgs()
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
    //load and parse PII CSV dile
    let validatedPIIData
    try {
        const rawPIIData = await csv().fromFile(config.PIIFile);
        const validator = new DataValidator(config)
        validatedPIIData = validator.validate(rawPIIData)
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
    //build request body
    let request
    try {
        request = LiveRampRequestBuilder.buildRequestBody(config, validatedPIIData)
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
    //make network call to LiveRamp
    let response
    try {
        response = await axiosInstance.post(config.endpointURL, JSON.stringify(request))
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
    //parse response and display results
    let stats
    try{
        stats = new ResponseParser(request, response)
        console.log(JSON.stringify(stats, null, 4))
        fs.writeFileSync("./output/request.json", JSON.stringify(request, null, 4))
        fs.writeFileSync("./output/response.json", JSON.stringify(response.data, null, 4))
        fs.writeFileSync("./output/stats.json", JSON.stringify(stats, null, 4))
    } catch (e) {
        console.log(e);
        process.exit(1)
    }

})();