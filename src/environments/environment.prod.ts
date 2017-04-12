import { Environment } from '@freescan/skeleton';

export const environment: Environment = {
    production: true,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.publication.studio',
        cashier:      'http://cashier.publication.studio',
        vinyl:        'http://vinyl.publication.studio',
        files:        'http://files.publication.studio',
        publications: 'http://api.publication.studio',
    },

    passport: {
        login:       'http://passport.publication.studio/authorize',
        clientId:    '4',
        redirectURI: 'http://www.publication.studio',
        scope:       '',
    },
};
