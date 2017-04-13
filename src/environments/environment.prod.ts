import { Environment, VinylService, PassportData } from '@freescan/skeleton';

// VinylService determines our domain so that we can
// host anybody on studio.company.com and hit the correct API's
const vinyl: VinylService    = new VinylService();
const domain: string         = vinyl.domain();
const passport: PassportData = vinyl.passport();

const env: Environment = {
    production: true,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.publication.studio',
        vinyl:        'http://vinyl.publication.studio',
        cashier:      'http://cashier.publication.studio',
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

// Set the API URL's based on the domain
env.api.vinyl        = `http://vinyl.${domain}`;
env.api.cashier      = `http://cashier.${domain}`;
env.api.files        = `http://files.${domain}`;
env.api.publications = `http://publication.${domain}`;
env.passport.clientId    = passport.clientId;
env.passport.redirectURI = passport.redirectURI;


export const environment: Environment = env;
