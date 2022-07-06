class DataValidator {

    static minimumNumberOfRows = 101
    static maximumNumberOfRows = 1000

    constructor(config) {
        this.config = config
        this.rows = Array()
    }

    /*
    IMPORTANT SAFETY NOTE: ON THE LOOKUP INTERFACE, ORDER OF PARAMS IS IMPORTANT
    - NAME MUST COME FIRST: name phone, name zipCode, name email etc
    - PREFERRED ORDER FOR ADDRESS: name streetAddress city state zipCode
     */
    validate(rawPIIData){

        if (this.config.debug) {
            console.log("VALIDATION:")
        }
        let index = 0
        rawPIIData.some(row => {

            let isValid = false
            let isNameValid = false

            if (this.config.debug) {
                console.log(JSON.stringify(row))
            }

            let rowParams = Array()
            if (this.config.args.includes('name')) {
                let name = row['name']
                if ((typeof (name) === 'string')) {
                    name = name.toLowerCase()
                    rowParams.push({"name": name})
                    isNameValid = true
                }

            }


            if (this.config.args.includes('email')) {
                let email = row['email']
                if ((typeof (email) === 'string') && email.indexOf('@') !== -1 && (email.indexOf('.') > email.indexOf('@'))) {
                    email = email.toLowerCase()
                    rowParams.push({"email": email})
                    isValid = true
                }

            }

            if (this.config.args.includes('phone')) {
                let phone = row['phone']
                if ((typeof (phone) === 'string')) {
                    const phoneParsed = phone.replace(/\D/g, '');
                    if (phoneParsed.length === 10) {
                        rowParams.push({"phone": phoneParsed})
                        isValid = true
                    }
                }
            }

            if (this.config.args.includes('street')) {
                let streetAddress = row['streetAddress']
                if (typeof (streetAddress) === 'string' && streetAddress.length > 2) {
                    streetAddress = streetAddress.toLowerCase()
                    rowParams.push({"streetAddress": streetAddress})
                }
            }
            if (this.config.args.includes('city')) {
                let city = row['city']
                if (typeof (city) === 'string')  {
                    city = city.toLowerCase()
                    rowParams.push({"city": city})
                }
            }

            if (this.config.args.includes('state')) {
                let state = row['state']
                if ((typeof (state) === 'string') && state.length == 2) {
                    state = state.toLowerCase()
                    rowParams.push({"state": state})
                }
            }

            if (this.config.args.includes('zipCode')) {
                let zipCode = row['zipCode']
                if ((typeof (zipCode) === 'string')) {
                    const strippedZipCode = zipCode.replace(/\D/g, '');
                    if (strippedZipCode.length === 5 || strippedZipCode.length === 9 || strippedZipCode.length === 11) {
                        rowParams.push({"zipCode": strippedZipCode})
                        if (isNameValid) {
                            isValid = true
                        }

                    }
                }
            }

            if (rowParams.length > 1) {
                if (this.config.limit > 0 && config.limit <= 10) {
                    rowParams.push({"limit": config.limit})
                }
            }
            if(isValid){
                this.rows.push(rowParams)
                //return true breaks from Array.some()
                if(++index >= this.config.totalRequestLimit ) return true
            }
            return false
        })

        return this.rows
    }
    hasMoreRows(){
       console.log(this.rows.length)
        if (this.rows.length > DataValidator.minimumNumberOfRows) {
            return true
        } else {
            return false
        }
    }
    getRows(numberOfRows = DataValidator.maximumNumberOfRows) {
        if(this.rows.length >= numberOfRows * 2 || this.rows.length % numberOfRows >= DataValidator.minimumNumberOfRows) {
            return this.rows.splice(0, numberOfRows)
        } else {
            return this.rows.splice(0, numberOfRows / 2)
        }
    }
}
module.exports = DataValidator