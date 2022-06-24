const Config = require('./Config')
const csv = require('csvtojson')
const DataValidator = require("./DataValidator")
const LiveRampRequestBuilder = require("./LiveRampRequestBuilder")
const axiosInstance = require("./Axios")
const ResponseParser = require("./ResponseParser")
const fs = require('fs');

(async function() {

    try {
        const config = new Config(true)
        config.parseCommandLineArgs()
        const rawPIIData = await csv().fromFile(config.PIIFile);
        const validator = new DataValidator(config)
        const validatedPIIData = validator.validate(rawPIIData)
        const request = LiveRampRequestBuilder.buildRequestBody(config, validatedPIIData)
        const response = await axiosInstance.post(config.endpointURL, JSON.stringify(request))
        const stats = new ResponseParser(request, response)
        console.log(JSON.stringify(stats, null, 4))
        fs.writeFileSync("./output/request.json", JSON.stringify(request, null, 4))
        fs.writeFileSync("./output/response.json", JSON.stringify(response.data, null, 4))
        fs.writeFileSync("./output/stats.json", JSON.stringify(stats, null, 4))

    } catch (e) {
        console.log(e);
        process.exit(1)
    }

})();