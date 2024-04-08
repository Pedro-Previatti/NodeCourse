const fs  = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/****************************
 * FILES
 * 
 * Blocking, synchronous way
 * const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
 * console.log(textIn);
 * const textOut = `This is what we know about the avocado: ${textIn}.
 *                 \nCreated on ${Date.now()}`;
 * fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
 * console.log('File written');
 * 
 * Non-Blocking, asynchronous way
 * fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
 *     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
 *         console.log(data2);
 *          fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
 *             console.log(data3);
 *      
 *             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
 *                 console.log('Your file has been successfully written');
 *             });
 *         });
 *     });
 * });
 * console.log('Will read file');
 */

/****************************
 * SERVER
 */

const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj
        .map((el) => replaceTemplate(cardTemplate, el))
        .join('');
        const output = overviewTemplate
        .replace('{%PRODUCT_CARDS%}', cardsHtml)
        .trim();

        res.end(output);
    
    // Product Page
    } else if(pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const product = dataObj[query.id];
        const output = replaceTemplate(productTemplate, product);

        res.end(output);

    // API
    } else if(pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // Not Found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'Hello, world'
        });
        res.end('<h1>This page could not be found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});