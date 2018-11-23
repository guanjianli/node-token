const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream(__dirname+'/langdao'),
    crlfDelay: Infinity
});

let word = process.argv[2];
rl.on('line', (line) => {
    let  r = new RegExp(word)
    if(line.match(r)){
        console.log(line);
    }
});