const md5 = require("md5");
const sha1 = require("sha1");
const sha256 = require("sha256");

class LiveRampRequestBuilder {

    static buildRequestBody(config, validatedData) {
        let requestBodyArray = [];
        if (validatedData.length > 0) {
            validatedData.forEach(row => {
                if (row.length > 0) {
                    let matchRequestBodyRowStringPrefix = "/people"
                    if (config.encryption === 'none') {
                        matchRequestBodyRowStringPrefix += "/match?"
                    } else {
                        matchRequestBodyRowStringPrefix += "/" + config.encryption + "?key="

                    }
                    let requestBodyRowString = ""
                    row.forEach(rowParams => {
                        Object.keys(rowParams).forEach(key => {
                            switch (config.encryption) {
                                case 'none':
                                    requestBodyRowString += key + '=' + rowParams[key] + '&'
                                    break
                                case 'md5':
                                case 'sha256':
                                case 'sha1':
                                    if (requestBodyRowString.length > 1) {
                                        requestBodyRowString += " "
                                    }
                                    requestBodyRowString += rowParams[key].toLowerCase()
                                    break
                            }
                        })

                    })
                    if (config.encryption === 'none') {
                        requestBodyRowString = requestBodyRowString.substr(0, requestBodyRowString.length - 1)
                    }
                    if (config.encryption === 'md5') {
                        requestBodyRowString = md5(requestBodyRowString)
                    }
                    if (config.encryption === 'sha1') {
                        requestBodyRowString = sha1(requestBodyRowString)
                    }
                    if (config.encryption === 'sha256') {
                        requestBodyRowString = sha256(requestBodyRowString)
                    }


                    requestBodyArray.push(matchRequestBodyRowStringPrefix + requestBodyRowString)
                }
            })


        }
        if (config.debug) {
            console.log("REQUEST:")
            console.log(JSON.stringify(requestBodyArray, null, 4))
        }
        return requestBodyArray

    }

}
module.exports = LiveRampRequestBuilder