
class Config {
    constructor(debug = false, PIIFile = "data/PII.csv" ) {
        this.debug = debug
        this.PIIFile = PIIFile
    }

    parseCommandLineArgs() {
        this.endpointURL = ""
        this.encryption = ""
        this.endpoint = ""

        const usageString = "USAGE: npm run post [md5|sha256|sha1|none] [limit] fields..."
        const args = process.argv.slice(2)
        switch (args.shift()) {
            case 'md5':
                this.encryption = "md5"
                this.endpoint = "lookup"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'sha256':
                this.encryption = "sha256"
                this.endpoint = "lookup"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'sha1':
                this.encryption = "sha1"
                this.endpoint = "lookup"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'none':
                this.encryption = "none"
                this.endpoint = "match"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/match"
                break;
            default:
                throw (usageString)
                break;
        }

        this.limit = Number.parseInt(args.shift())
        this.args = args

        if (this.debug) {
            console.log("CONFIG:")
            console.log(JSON.stringify(this, null, 4))
        }
    }
}

module.exports = Config