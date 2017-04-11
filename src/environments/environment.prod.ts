import { Environment } from '@freescan/skeleton';

export const environment: Environment = {
    production: true,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.publication.studio',
        cashier:      'http://cashier-api.publication.studio',
        vinyl:        'http://vinyl-api.publication.studio',
        files:        'http://files-api.publication.studio',
        publications: 'http://api.publication.studio',
    },

    passport: {
        login:       'http://passport.publication.studio/authorize',
        clientId:    '4',
        redirectURI: 'http://www.publication.studio',
        scope:       '',
    },
};
