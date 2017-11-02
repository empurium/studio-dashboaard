import { Environment, VinylService, PassportData } from '@rndstudio/skeleton';

// VinylService determines our domain so that we can
// host anybody on studio.company.com and hit the correct API's
const vinyl: VinylService    = new VinylService();
const domain: string         = vinyl.domain();
const passport: PassportData = vinyl.passport();

const env: Environment = {
    production: false,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.publication.studio.test',
        vinyl:        'http://vinyl.publication.studio.test',
        cashier:      'http://cashier.publication.studio.test',
        files:        'http://files.publication.studio.test',
        publications: 'http://publication.publication.studio.test',
    },

    passport: {
        login:       'http://passport.publication.studio.test/authorize',
        clientId:    '4',
        redirectURI: 'http://publication.studio.test:5001',
        scope:       '',
    },
};

// Set the API URL's based on the domain
env.api.passport         = `http://passport.${domain}`;
env.api.vinyl            = `http://vinyl.${domain}`;
env.api.cashier          = `http://cashier.${domain}`;
env.api.files            = `http://files.${domain}`;
env.api.publications     = `http://publication.${domain}`;
env.passport.clientId    = passport.clientId;
env.passport.redirectURI = passport.redirectURI;


export const environment: Environment = env;
