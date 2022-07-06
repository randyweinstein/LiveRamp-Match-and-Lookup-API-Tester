
class Config {
    constructor(debug = false, PIIFile = "data/PII.csv", totalRequestLimit = 50000 ) {
        this.debug = debug
        this.PIIFile = PIIFile
        this.totalRequestLimit = totalRequestLimit
    }



    parseCommandLineArgs() {
        this.endpointURL = ""
        this.encryption = ""

        const usageString = "USAGE: npm run post [md5|sha256|sha1|none] [limit] fields...\n" +
            "\tValid combination of parameters are:\n" +
            "\t\tLookup Endpoint\n" +
            " \t\t\tmd5 0 email\n" +
            "\t\t\tsha256 0 email\n" +
            "\t\t\tsha1 0 email\n" +
            "\t\t\tsha1 0 phone\n" +
            "\t\t\tsha1 0 name email\n" +
            "\t\t\tsha1 0 name phone\n" +
            "\t\t\tsha1 0 name zipCode\n" +
            "\t\tMatch Endpoint\n" +
            "\t\t\tnone 0 email\n" +
            "\t\t\tnone 0 phone\n" +
            "\t\t\tnone 0 name email\n" +
            "\t\t\tnone 0 name phone\n" +
            "\t\t\tnone 0 name zipCode\n" +
            "\t\t\tnone 0 name streetAddress [city?] [state?] zipCode\n"

        //encryption argument
        const args = process.argv.slice(2)
        switch (args.shift()) {
            case 'md5':
                this.encryption = "md5"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'sha256':
                this.encryption = "sha256"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'sha1':
                this.encryption = "sha1"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/lookup"
                break;
            case 'none':
                this.encryption = "none"
                this.endpointURL = "https://us.identity.api.liveramp.com/v1/batch/match"
                break;
            default:
                throw (usageString)
                break;
        }

        //limit argument doesn't work
        this.limit = Number.parseInt(args.shift())
        this.args = args

        // validate parameter combinations
        switch(this.args) {
            case 'city':
            case 'street:':
            case 'streetAddress':
                if(!args.contains('name') || this.encryption != 'none'){
                    throw (usageString)
                }
                break

            case 'name':
                if(!args.contains('email') || !args.contains('phone') || !args.contains('zipCode')){
                    throw (usageString)
                }
                if (this.encryption != "none"  || this.encryption != "sha1"){
                    throw (usageString)
                }
                break
            case 'phone':
                if (this.encryption != "none"  || this.encryption != "sha1"){
                    throw (usageString)
                }
                break
        }

        if (this.debug) {
            console.log("CONFIG:")
            console.log(JSON.stringify(this, null, 4))
        }
    }
}

module.exports = Config