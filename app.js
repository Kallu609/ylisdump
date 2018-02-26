const config = require('./config');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const USERNAME_SELECTOR = '.login > input:nth-child(3)';
const PASSWORD_SELECTOR = '.login > input:nth-child(4)';
const LOGIN_SUBMIT_SELECTOR = '.login > button:nth-child(5)';

const FILE_SELECTOR = '#file';
const REPLY_SUBMIT_SELECTOR = '#submit';

const LOGIN_URL = 'https://ylilauta.org/'

const HEADERS = {
  'Accept-Language': 'fi-FI,fi;q=0.8,en-US;q=0.5,en;q=0.3',
  'User-Agent': 'dumppibot 2000'
}

let browser;
let page;

async function initBrowser() {
  browser = await puppeteer.launch({
    headless: true // false to show browser
  });

  page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  })

  await page.setExtraHTTPHeaders(HEADERS);
}

async function login(username, password) {
  await page.goto(LOGIN_URL);

  // Fill the login form
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(password);

  await page.click(LOGIN_SUBMIT_SELECTOR);
  await page.waitForNavigation();

  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  return !(bodyHTML.includes('class="error center"'));
}

function waitForUpload() {
  return new Promise(function (resolve, reject) {
      (async function checkUpload() {
        let filevalue = await page.evaluate(() => document.querySelector('#file')['value']);

        if (!filevalue) {
          return resolve();
        }

        setTimeout(checkUpload, 100);
      })();
  });
}

async function postFiles(files, index=0) {
  process.stdout.write(`Dumpataan ${index + 1} / ${files.length} (${files[index]}) `);

  const fileInput = await page.$(FILE_SELECTOR);
  await fileInput.uploadFile(files[index]);
  
  await page.click(REPLY_SUBMIT_SELECTOR);
  await waitForUpload();
  
  console.log(`Dumpattu\'d. Odotetaan ${config.delay}ms...`);

  index += 1;

  if (index >= files.length) {
    console.log('Valmis!');
    await closeBrowser();
    return;
  }

  setTimeout(async () => {
    await postFiles(files, index);
  }, config.delay);
}

async function closeBrowser() {
  /*
  await page.screenshot({
    path: 'ylis.png'
  }); */

  await browser.close();
}

function getFiles() {
  return fs.readdirSync(config.dir)
    .map(filename => {
      if (config.types.includes(filename.split('.').pop())) {
        return path.join(config.dir, filename);
      }
    })
    .filter(filepath => {
      if (filepath) return filepath;
    });
}

async function main() {
  await initBrowser();

  const loggedIn = await login(config.username, config.password);

  if (!loggedIn) {
    console.log('Kirjautuminen epäonnistui.');
    await closeBrowser();
    return;
  }

  console.log('Kirjautuminen onnistui.');

  const files = getFiles();
  await page.goto(config.thread);
  await postFiles(files);
}

main();