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
        passport:     'https://passport.publication.studio',
        vinyl:        'https://vinyl.publication.studio',
        cashier:      'https://cashier.publication.studio',
        files:        'https://files.publication.studio',
        publications: 'https://api.publication.studio',
    },

    passport: {
        login:       'https://passport.publication.studio/authorize',
        clientId:    '4',
        redirectURI: 'https://www.publication.studio',
        scope:       '',
    },
};

// Set the API URL's based on the domain
env.api.passport         = `https://passport.${domain}`;
env.api.vinyl            = `https://vinyl.${domain}`;
env.api.cashier          = `https://cashier.${domain}`;
env.api.files            = `https://files.${domain}`;
env.api.publications     = `https://publication.${domain}`;
env.passport.clientId    = passport.clientId;
env.passport.redirectURI = passport.redirectURI;


export const environment: Environment = env;
