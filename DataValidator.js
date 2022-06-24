class DataValidator {
    constructor(config) {
        this.config = config
    }

    validate(rawPIIData){

        let totalRows = 0
        let bodyRows = []
        if (this.config.debug) {
            console.log("VALIDATION:")
        }
        rawPIIData.some(row => {
            if (this.config.debug) {
                console.log(JSON.stringify(row))
            }

            let bodyRowParams = Array()

            if (this.config.args.includes('name')) {
                let name = row['name']
                if ((typeof (name) === 'string')) {
                    bodyRowParams.push({"name": name})
                }

            }


            if (this.config.args.includes('email')) {
                let email = row['email']
                if ((typeof (email) === 'string') && email.indexOf('@') !== -1) {
                    bodyRowParams.push({"email": email})
                }

            }

            if (this.config.args.includes('phone')) {
                let phone = row['phone']
                if ((typeof (phone) === 'string')) {
                    const phoneParsed = phone.replace(/\D/g, '');
                    if (phoneParsed.length === 10) {
                        bodyRowParams.push({"phone": phoneParsed})

                    }
                }

            }


            if (bodyRowParams.length > 1) {
                if (this.config.limit > 0 && config.limit <= 10) {
                    bodyRowParams.push({"limit": config.limit})
                }
            }
            if(bodyRowParams.length > 0){
                bodyRows.push(bodyRowParams)
                if(++totalRows >=1000 ) return bodyRows
            }

        })

        return bodyRows

    }
}
module.exports = DataValidator