import { Environment } from '@freescan/skeleton';

export const environment: Environment = {
    production: false,
    staging:    true,

    // API URL's
    api: {
        passport:     'http://staging-passport.publication.studio',
        cashier:      'http://staging-cashier.publication.studio',
        vinyl:        'http://staging-vinyl.publication.studio',
        files:        'http://staging-files.publication.studio',
        publications: 'http://staging-publication.publication.studio',
    },

    passport: {
        login:       'http://staging-passport.publication.studio/authorize',
        clientId:    '4',
        redirectURI: 'http://staging.publication.studio',
        scope:       '',
    },
};
