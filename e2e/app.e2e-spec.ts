import { PublicationStudioPage } from './app.po';

describe('publication-studio App', () => {
  let page: PublicationStudioPage;

  beforeEach(() => {
    page = new PublicationStudioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pstudio works!');
  });
});
