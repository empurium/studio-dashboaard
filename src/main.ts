import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '@env/environment';
import { AppModule } from './app/app.module';

if (environment.production || environment.staging) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
