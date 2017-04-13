import { Environment, VinylService } from '@freescan/skeleton';

// VinylService determines our domain so that we can
// host anybody on studio.company.com and hit the correct API's
const vinyl: VinylService = new VinylService();
const domain: string      = vinyl.domain();

const env: Environment = {
    production: false,
    staging:    false,

    // API URL's
    api: {
        passport:     'http://passport.publication.studio.local',
        vinyl:        'http://vinyl.publication.studio.local',
        cashier:      'http://cashier.publication.studio.local',
        files:        'http://files.publication.studio.local',
        publications: 'http://publication.publication.studio.local',
    },

    passport: {
        login:       'http://passport.publication.studio.local/authorize',
        clientId:    '4', // TODO - oh fuck
        redirectURI: 'http://publication.studio.local:5001',
        scope:       '',
    },
};

// Set the API URL's based on the domain
env.api.vinyl        = `http://vinyl.${domain}`;
env.api.cashier      = `http://cashier.${domain}`;
env.api.files        = `http://files.${domain}`;
env.api.publications = `http://publication.${domain}`;


export const environment: Environment = env;
