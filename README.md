# LiveRamp Match and Lookup API Test Suite

## Important Security Notes

1. **Do not share the credentials in ClientCredentials.js**
2. **Do not share Personally identifiable information (PII) in PII.json**

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
- this can be set up in IntelliJ IDEA easily using npm configs, but you still need to open package.json and click on the "run npm install" toast that appears at the bottom of the screen

![IDEA](idea.png)

## Liveramp Links:

- The Match Endpoint: https://developers.liveramp.com/retrieval-api/reference/batch-request-calls-match
- Error codes: https://developers.liveramp.com/retrieval-api/docs/error-document
- RampIDs explained: https://developers.liveramp.com/retrieval-api/docs/rampids
- Bucket upload : https://docs.liveramp.com/connect/en/getting-your-data-into-liveramp.html
- 10,000 myriad IDs https://docs.liveramp.com/connect/en/interpreting-rampid,-liveramp-s-people-based-identifier.html
- How does the RampID get into the bid request? https://sidecar.readme.io/docs/using-idls-in-openrtb