const axiosInstance = require("./Axios")
const md5 = require('md5')
const sha256 = require('sha256')
const sha1 = require("sha1")
const csv = require('csv-parser')
const fs = require('fs');


function parseCommandLineArgs(){
    let config = {}
    config.debug = false
    config.PIIFile = "data/PII.csv"
    config.endpointURL = ""
    config.encryption = ""
    config.endpoint = ""

    const usageString = "USAGE: npm run post [md5|sha256|sha1|none] [limit] fields..."
    const args = process.argv.slice(2)
    switch (args.shift()) {
        case 'md5':
            config.encryption = "md5"
            config.endpoint = "lookup"
            config.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
            break;
        case 'sha256':
            config.encryption = "sha256"
            config.endpoint = "lookup"
            config.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
            break;
        case 'sha1':
            config.encryption = "sha1"
            config.endpoint = "lookup"
            config.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
            break;
        case 'none':
            config.encryption = "none"
            config.endpoint = "match"
            config.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/match"
            break;
        default:
            console.log(usageString)
            process.exit(1);
    }


    config.limit = Number.parseInt(args.shift())

    config.args = args

    if (config.debug) {
        console.log("CONFIG:")
        console.log(JSON.stringify(config, null, 4))
    }

    return config

}

function validatePIIData(config, rawPIIData){
    let totalRows = 0
    let bodyRows = []
    if (config.debug) {
        console.log("VALIDATION:")
    }
    rawPIIData.some(row => {
        if (config.debug) {
            console.log(JSON.stringify(row))
        }

        let bodyRowParams = Array()

        if (config.args.includes('name')) {
            let name = row['name']
            if ((typeof (name) === 'string')) {
                bodyRowParams.push({"name": name})
            }

        }


        if (config.args.includes('email')) {
            let email = row['email']
            if ((typeof (email) === 'string') && email.indexOf('@') !== -1) {
                bodyRowParams.push({"email": email})
            }

        }

        if (config.args.includes('phone')) {
            let phone = row['phone']
            if ((typeof (phone) === 'string')) {
                const phoneParsed = phone.replace(/\D/g, '');
                if (phoneParsed.length === 10) {
                    bodyRowParams.push({"phone": phoneParsed})

                }
            }

        }


        if (bodyRowParams.length > 1) {
            if (config.limit > 0 && config.limit <= 10) {
                bodyRowParams.push({"limit": config.limit})
            }
        }
        bodyRows.push(bodyRowParams)
        if(++totalRows >=999 ) return bodyRows
    })

    return bodyRows

}

function buildRequestBody(config, validatedData) {
    let matchRequestBody = [];
    if (validatedData.length > 0) {
        validatedData.forEach(row => {
            if (row.length > 0) {
                let matchRequestBodyRowStringPrefix = "/people"
                if (config.encryption === 'none') {
                    matchRequestBodyRowStringPrefix += "/match?"
                } else {
                    matchRequestBodyRowStringPrefix += "/" + config.encryption + "?key="

                }
                let matchRequestBodyRowString = ""
                row.forEach(rowParams => {
                    Object.keys(rowParams).forEach(key => {
                        switch (config.encryption) {
                            case 'none':
                                matchRequestBodyRowString += key + '=' + rowParams[key] + '&'
                                break
                            case 'md5':
                            case 'sha256':
                            case 'sha1':
                                if (matchRequestBodyRowString.length > 1) {
                                    matchRequestBodyRowString += " "
                                }
                                matchRequestBodyRowString += rowParams[key].toLowerCase()
                                break
                        }
                    })

                })
                if (config.encryption === 'none') {
                    matchRequestBodyRowString = matchRequestBodyRowString.substr(0, matchRequestBodyRowString.length - 1)
                }
                if (config.encryption === 'md5') {
                    matchRequestBodyRowString = md5(matchRequestBodyRowString)
                }
                if (config.encryption === 'sha1') {
                    matchRequestBodyRowString = sha1(matchRequestBodyRowString)
                }
                if (config.encryption === 'sha256') {
                    matchRequestBodyRowString = sha256(matchRequestBodyRowString)
                }


                matchRequestBody.push(matchRequestBodyRowStringPrefix + matchRequestBodyRowString)
            }
        })


    }
    fs.writeFileSync("./output/request.json", JSON.stringify(matchRequestBody, null, 4))
    if (config.debug) {
        console.log("REQUEST:")
        console.log(JSON.stringify(matchRequestBody, null, 4))
    }
    return matchRequestBody

}

// 5. PARSE RESPONSE FROM LIVERAMP AND GENERATE STATS
function parseResponseMetadata(request, response) {
    this.stats = {}
    this.stats.request = {}
    this.stats.request.totalRows = request.length
    this.stats.response = {}
    this.stats.response.matchRate = "0 %"
    this.stats.response.totalResults = 0
    this.stats.response.httpStatus200Results = 0
    this.stats.response.httpStatus4XXResults = 0
    this.stats.response.derivedRampIDsFound = 0
    this.stats.response.maintainedRampIDsFound = 0
    this.stats.response.matches = {}

    response.data.forEach(row => {
        this.stats.response.totalResults++
        if (row.code === 200) {
            this.stats.response.httpStatus200Results++
            let rampID = row.document?.person?.anonymousAbilitec?.anonymousConsumerLink
            if (typeof rampID === 'string') {
                switch (rampID.substr(0, 2)) {
                    case 'XY':
                        this.stats.response.maintainedRampIDsFound++
                        break;
                    case 'Xi':
                        this.stats.response.derivedRampIDsFound++
                        break;
                }
            }
            let matchComponents = row.document?.person?.matchMetadata?.matchComponents
            if (typeof matchComponents == 'object') {
                matchComponents.forEach(matchType => {
                    if (typeof this.stats.response.matches[matchType] !== "number") {
                        this.stats.response.matches[matchType] = 1
                    } else {
                        this.stats.response.matches[matchType]++
                    }
                })
            }

        } else {
            this.stats.response.httpStatus4XXResults++
        }


        this.stats.response.matchRate = "" + Math.round((this.stats.response.maintainedRampIDsFound / this.stats.response.totalResults * 100)) + "%"


    })
    fs.writeFileSync("./output/stats.json", JSON.stringify(this.stats, null, 4))
    console.log("STATS:")
    console.log(JSON.stringify(this.stats, null, 4))
}


async function postBodyToLiveRamp(config, matchRequestBody) {


    axiosInstance.post(config.endpointURL, JSON.stringify(matchRequestBody))
        .then(function (response) {
            fs.writeFileSync("./output/response.json", JSON.stringify(response.data, null, 4))
            if (config.debug) {
                console.log("RESPONSE:")
                console.log(JSON.stringify(response.data, null, 4))
            }

            parseResponseMetadata(matchRequestBody, response)

        })
        .catch(function (error) {
            console.log("ERROR:")
            console.log(error.message);
            console.log(error.code);
            console.log(JSON.stringify(error, null, 4))
            fs.writeFileSync("./output/response.json", JSON.stringify(error.data, null, 4))

        });

}

(async function() {

    //1. PARSE AND STORE COMMAND LINE INPUT
    const config = parseCommandLineArgs()

    // 2. LOAD AND PARSE CSV
    let rawPIIData = []

    fs.createReadStream(config.PIIFile)
        .pipe(csv())
        .on('data', (data) => {
            rawPIIData.push(data)
        })
        .on('end', async () => {

            // 3. VALIDATE DATA
            const validatedData = validatePIIData(config, rawPIIData)

            // 4. BUILD UP REQUEST BODY
            const requestBody = buildRequestBody(config, validatedData)


            // 5. POST REQUEST BODY TO LIVERAMP

            await postBodyToLiveRamp(config, requestBody)
        });


})();