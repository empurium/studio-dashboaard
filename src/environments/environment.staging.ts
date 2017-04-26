import { Environment, VinylService, PassportData } from '@freescan/skeleton';

// VinylService determines our domain so that we can
// host anybody on studio.company.com and hit the correct API's
const vinyl: VinylService    = new VinylService();
const domain: string         = vinyl.domain();
const passport: PassportData = vinyl.passport();

const env: Environment = {
    production: false,
    staging:    true,

    // API URL's
    api: {
        passport:     'https://staging-passport.publication.studio',
        vinyl:        'https://staging-vinyl.publication.studio',
        cashier:      'https://staging-cashier.publication.studio',
        files:        'https://staging-files.publication.studio',
        publications: 'https://staging-publication.publication.studio',
    },

    passport: {
        login:       'https://staging-passport.publication.studio/authorize',
        clientId:    '4',
        redirectURI: 'http://staging.publication.studio',
        scope:       '',
    },
};

// Set the API URL's based on the domain
env.api.vinyl            = `https://staging-vinyl.${domain}`;
env.api.cashier          = `https://staging-cashier.${domain}`;
env.api.files            = `https://staging-files.${domain}`;
env.api.publications     = `https://staging-publication.${domain}`;
env.passport.clientId    = passport.clientId;
env.passport.redirectURI = passport.redirectURI;


export const environment: Environment = env;
