import { Environment } from '@freescan/skeleton';

export const environment: Environment = {
    production: true,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.freescan.com',
        cashier:      'http://cashier.freescan.com',
        files:        'http://files.freescan.com',
        publications: 'http://finance-api.freescan.com',
    },

    passport: {
        login:       'http://passport.freescan.com/authorize',
        clientId:    '1',
        redirectURI: 'http://freescan.local:5000', // Pull from domain
        scope:       '',
    },
};
