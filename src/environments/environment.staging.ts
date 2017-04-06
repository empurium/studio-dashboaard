import { Environment } from '@freescan/skeleton';

export const environment: Environment = {
    production: false,
    staging:    true,

    // API URL's
    api: {
        passport:     'http://staging-passport.freescan.com',
        cashier:      'http://staging-cashier.freescan.com',
        files:        'http://staging-files.freescan.com',
        publications: 'http://staging-finance-api.freescan.com',
    },

    passport: {
        login:       'http://staging-passport.freescan.com/authorize',
        clientId:    '1',
        redirectURI: 'http://staging-720global.freescan.com',
        scope:       '',
    },
};
