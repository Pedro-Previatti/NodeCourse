const fs  = require('fs');

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.
//                 \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
// console.log('File written');

// Non-Blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
console.log('Will read file');