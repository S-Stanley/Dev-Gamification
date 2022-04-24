const puppeteer = require('puppeteer');

describe('Homepage tests', () => {
    let browser;
    let page;

    beforeEach(async() => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:1239/');
    });
    it('Should do check the url', async() => {
        await expect(page.url()).toEqual('http://localhost:1239/');
    });
    afterAll(() => {
        browser.close();
    })
})