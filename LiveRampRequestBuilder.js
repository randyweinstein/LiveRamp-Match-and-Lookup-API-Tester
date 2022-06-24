const md5 = require("md5");
const sha1 = require("sha1");
const sha256 = require("sha256");

class LiveRampRequestBuilder {

    static buildRequestBody(config, validatedData) {
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
        if (config.debug) {
            console.log("REQUEST:")
            console.log(JSON.stringify(matchRequestBody, null, 4))
        }
        return matchRequestBody



    }

}
module.exports = LiveRampRequestBuilder