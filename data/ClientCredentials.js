const axios = require('axios');
const oauth = require('axios-oauth-client');

const ClientCredentials = oauth.client(axios.create(), {
    url: 'https://us.identity.api.liveramp.com/token',
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: '',
    scope: 'openid'
});
module.exports = ClientCredentials