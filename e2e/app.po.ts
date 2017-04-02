import { browser, element, by } from 'protractor';

export class PublicationStudioPage {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('pstudio-root h1')).getText();
    }
}
