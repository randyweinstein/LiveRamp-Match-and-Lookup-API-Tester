class DataValidator {
    constructor(config) {
        this.config = config
    }

    /*
    IMPORTANT SAFETY NOTE: ON THE LOOKUP INTERFACE, ORDER OF PARAMS IS IMPORTANT
    - NAME MUST COME FIRST: name phone, name zipCode, name email etc
    - PREFERRED ORDER FOR ADDRESS: name streetAddress city state zipCode
     */
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
                    name = name.toLowerCase()
                    bodyRowParams.push({"name": name})
                }

            }


            if (this.config.args.includes('email')) {
                let email = row['email']
                if ((typeof (email) === 'string') && email.indexOf('@') !== -1 && (email.indexOf('.') > email.indexOf('@'))) {
                    email = email.toLowerCase()
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

            if (this.config.args.includes('street')) {
                let streetAddress = row['streetAddress']
                if (typeof (streetAddress) === 'string') {
                    streetAddress = streetAddress.toLowerCase()
                    bodyRowParams.push({"streetAddress": streetAddress})
                }
            }
            if (this.config.args.includes('city')) {
                let city = row['city']
                if (typeof (city) === 'string')  {
                    city = city.toLowerCase()
                    bodyRowParams.push({"city": city})
                }
            }

            if (this.config.args.includes('state')) {
                let state = row['state']
                if ((typeof (state) === 'string') && state.length == 2) {
                    state = state.toLowerCase()
                    bodyRowParams.push({"state": state})
                }
            }

            if (this.config.args.includes('zipCode')) {
                let zipCode = row['zipCode']
                if ((typeof (zipCode) === 'string')) {
                    const strippedZipCode = zipCode.replace(/\D/g, '');
                    if (strippedZipCode.length === 5 || strippedZipCode.length === 9 || strippedZipCode.length === 11) {
                        bodyRowParams.push({"zipCode": strippedZipCode})

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