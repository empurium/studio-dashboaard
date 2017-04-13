import { Environment, VinylService } from '@freescan/skeleton';

// VinylService determines our domain so that we can
// host anybody on studio.company.com and hit the correct API's
const vinyl: VinylService = new VinylService();
const domain: string      = vinyl.domain();

const env: Environment = {
    production: false,
    staging:    true,

    // API URL's
    api: {
        passport:     'http://staging-passport.publication.studio',
        vinyl:        'http://staging-vinyl.publication.studio',
        cashier:      'http://staging-cashier.publication.studio',
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

// Set the API URL's based on the domain
env.api.vinyl        = `http://staging-vinyl.${domain}`;
env.api.cashier      = `http://staging-cashier.${domain}`;
env.api.files        = `http://staging-files.${domain}`;
env.api.publications = `http://staging-publication.${domain}`;


export const environment: Environment = env;
