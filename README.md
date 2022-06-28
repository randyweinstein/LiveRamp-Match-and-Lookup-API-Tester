# LiveRamp Match and Lookup API Test Suite

## Important Security Notes

1. **Do not share the credentials in ClientCredentials.js!**
2. **Do not share Personally identifiable information (PII) in PII.csv PII.xlsx!**

## Installation & Running

1. Install [node.js](https://nodejs.org/en/)
2. Command line: npm install
3. Edit the required fields in ClientCredentials.js 
4. Fill in test data in PII.json with a **minimum** of 101 entries
5. Command line: npm run post {encryption} {limit} {list of fields to parse from PII.json}

## Notes:

- npm run post starts the program
- {encryption} can be "none", "sha1", "sha256", or "md5" if your PII includes emails only. 
- {encryption} can be "none" or "sha1" if your PII includes more than emails.
- limit must be zero, adding the limit parameter causes the request to fail. There is an open question to LR support about why this is the case
- Valid combination of parameters are:
  - Lookup Endpoint
    - md5 0 email
    - sha256 0 email
    - sha1 0 email
    - sha1 0 phone
    - sha1 0 name email
    - sha1 0 name phone
    - sha1 0 name zipCode
  - Match Endpoint
    - none 0 email
    - none 0 phone
    - none 0 name email
    - none 0 name phone
    - none 0 name zipCode
    - none 0 name street [city?] [state?] zipCode
- this can be set up in IntelliJ IDEA easily using npm configs, but you still need to open package.json and click on the "run npm install" toast that appears at the bottom of the screen

![IDEA](idea.png)

## Liveramp Links:

- The Match Endpoint: https://developers.liveramp.com/retrieval-api/reference/batch-request-calls-match
- Error codes: https://developers.liveramp.com/retrieval-api/docs/error-document
- RampIDs explained: https://developers.liveramp.com/retrieval-api/docs/rampids
- Bucket upload : https://docs.liveramp.com/connect/en/getting-your-data-into-liveramp.html
- 10,000 myriad IDs https://docs.liveramp.com/connect/en/interpreting-rampid,-liveramp-s-people-based-identifier.html
- How does the RampID get into the bid request? https://sidecar.readme.io/docs/using-idls-in-openrtb

## Expected Match Rates

| DataSet     | Endpoint | Encryption | Limit | Fields                                   | Total Rows Submitted | Match Rate | Total Results | Total HTTP 200 Results | Total HTTP 4xx Results | Derived RampIDs Returned | Maintained RampIDs Returned |
| ----------- | -------- | ---------- | ----- | ---------------------------------------- | -------------------- | ---------- | ------------- | ---------------------- | ---------------------- | ------------------------ | --------------------------- |
| AK 1000     | Lookup   | md5        | 0     | email                                    | 1000                 | 69%        | 1000          | 1000                   | 0                      | 310                      | 690                         |
| AK 1000     | Lookup   | sha256     | 0     | email                                    | 1000                 | 69%        | 1000          | 1000                   | 0                      | 310                      | 690                         |
| AK 1000     | Lookup   | sha1       | 0     | email                                    | 1000                 | 69%        | 1000          | 1000                   | 0                      | 310                      | 690                         |
| AK 1000     | Lookup   | sha1       | 0     | phone                                    | 1000                 | 82%        | 1000          | 1000                   | 0                      | 176                      | 824                         |
| AK 1000     | Lookup   | sha1       | 0     | name email                               | 1000                 | 45%        | 1000          | 1000                   | 0                      | 548                      | 452                         |
| AK 1000     | Lookup   | sha1       | 0     | name phone                               | 1000                 | 45%        | 1000          | 1000                   | 0                      | 547                      | 453                         |
| AK 1000     | Lookup   | sha1       | 0     | name zipCode                             | 1000                 | 14%        | 1000          | 1000                   | 0                      | 855                      | 145                         |
| AK 1000     | Match    | none       | 0     | email                                    | 1000                 | 69%        | 1000          | 1000                   | 0                      | 310                      | 690                         |
| AK 1000     | Match    | none       | 0     | phone                                    | 1000                 | 82%        | 1000          | 1000                   | 0                      | 178                      | 822                         |
| AK 1000     | Match    | none       | 0     | name email                               | 1000                 | 57%        | 1000          | 1000                   | 0                      | 260                      | 574                         |
| AK 1000     | Match    | none       | 0     | name phone                               | 1000                 | 61%        | 1000          | 1000                   | 0                      | 137                      | 606                         |
| AK 1000     | Match    | none       | 0     | name zipCode                             | 1000                 | 87%        | 1000          | 1000                   | 0                      | 118                      | 869                         |
| AK 1000     | Match    | none       | 0     | name street \[city?\] \[state?\] zipCode | 1000                 | 90%        | 1000          | 1000                   | 0                      | 96                       | 903                         |