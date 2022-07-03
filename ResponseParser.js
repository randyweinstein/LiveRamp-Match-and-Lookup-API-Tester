class ResponseParser{
    constructor() {
        this.stats = {}
        this.stats.request = {}
        this.stats.request.totalRows = 0
        this.stats.response = {}
        this.stats.response.matchRate = "0 %"
        this.stats.response.totalResults = 0
        this.stats.response.httpStatus200Results = 0
        this.stats.response.httpStatus4XXResults = 0
        this.stats.response.derivedRampIDsFound = 0
        this.stats.response.maintainedRampIDsFound = 0
        this.stats.response.matches = {}
    }
    addResponseData(request, response) {
        this.stats.request.totalRows += request.length
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

            this.stats.response.matchRate = "" + Math.round((this.stats.response.maintainedRampIDsFound / this.stats.request.totalRows * 100)) + "%"
        })
    }

}
module.exports = ResponseParser


