const readline = require('readline')
const vkqr = require('@vkontakte/vk-qr')
const svg2img = require('svg2img')
const { FoxDispatcher } = require('@modularium/fox')
const fs = require('fs')

const fd = new FoxDispatcher()

const settings = {
    text: 'hi!',
    options: {}
}

fd.add({
    base: 'text',
    aliases: ['url', 'setText', 'setURL'],
    info: 'sets text', 
    execute (msg, [ text ]) {
        if (!text) {
            console.log('enter valid text')
            return
        }
    
        settings.text = text
    
        console.log(`set url to '${text}'`)
    }
})

fd.add({
    base: 'gen',
    aliases: ['generate', 'create', 'genqr'],
    info: 'sets text', 
    execute (msg, []) {
        settings.qr = vkqr.createQR(settings.text || 'hi!', settings.options)

        console.log('generated a qr with settings:\n', { text: settings.text, options: settings.options })
    }
})

fd.add({
    base: 'save',
    aliases: ['saveqr'],
    info: 'saves qr as png', 
    execute (msg, []) {
        svg2img(settings.qr, (error, buffer) => {
            if (error) throw error
            fs.writeFileSync('qr.png', buffer);
            console.log('saved qr to \'qr.png\'')
        });
    }
})

fd.add({
    base: 'fast',
    aliases: ['fastqr', 'fqr'],
    info: 'makes qr as quickly as possible', 
    execute (msg, [ text ]) {
        fd.parseuse(msg, `text ${text}`)
        fd.parseuse(msg, 'gen')
        fd.parseuse(msg, 'save')
    }
})

fd.addSimple('size', 'sets size of qr', (msg, [ size ]) => {
    if (!size) {
        console.log('enter valid size')
        return
    }

    settings.options.qrSize = Number(size)

    console.log(`set qr size to '${size}'`)
})

let completer = (line) => {
    const hits = fd._commands.array().map(c => c.base).filter(c => c.startsWith(line));

    // show all completions if none found
    return [hits.length ? hits : commandlist, line];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "qr > ",
    completer: completer
});

rl.prompt(true)

console.log = (function () {
    const orig = console.log
    return function () {
      readline.cursorTo(process.stdout, 0)
      let tmp
      try {
        tmp = process.stdout
        process.stdout = process.stderr
        orig.apply(console, ['qr |', ...arguments])
      } finally {
        process.stdout = tmp
      }
      rl.prompt(true)
    }
})()

rl.on('line', (input) => {
    fd.parseuse({}, input)
    .catch(({ name, message, code, trace }) => {
        if (name === 'FoxError') {
            if (code === '404' || code === 'off') {
                console.log(`FD executed with code: ${code}`)
            }
        } else {
            console.error(`${name}: ${message}\n${trace}`)
        }
    })
    rl.prompt(true)
})