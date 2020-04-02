var ess = require('event-source-stream');
let lodash = require('lodash');
let moment = require('moment');
require('colors');

process.stdout.write("\033c");
let fields = "f530,f57,f58,f60,f46,f51,f52,f43,f44,f45,f71,f168,f169,f170,f171,f31,f32,f33,f34,f35,f36,f37,f38,f39,f40,f11,f12,f13,f14,f15,f16,f17,f18,f19,f20".split(','); //

const upDownColor = ['green', 'cyan', 'red'];
const upDownFlag = ['↓', '↕', '↑'];
let updown;
const titleSellBuy = ['卖盘', '卖量', '买盘', '买量'];
const BASE_X = 4;
let showStock = (startLine, currValues, newValue) => {
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let bgColor, fieldValid;
    lodash.merge(currValues, newValue);

    if (!currValues.time) {
        [0, 1, 2, 3].forEach((v) => {
            process.stdout.cursorTo(BASE_X + 10 + v * 20, startLine + 7)
            process.stdout.write(titleSellBuy[v]);
        })
    }

    process.stdout.cursorTo(BASE_X + 0, startLine + 0);
    process.stdout.write('══════════════════════════════════════ ' + (currValues.f58 + '(' + currValues.f57 + ')').bold.brightMagenta + ' ══════════════════════════════════════')

    process.stdout.cursorTo(BASE_X + 20, startLine + 1);
    process.stdout.write('昨  收：'.cyan + (currValues.f60 == '-' || currValues.f60.toFixed(2)).toString().underline.brightBlue)

    process.stdout.cursorTo(BASE_X + 40, startLine + 1);
    process.stdout.write("今  开：".cyan + (currValues.f46 == '-' || currValues.f46.toFixed(2)).toString().underline.brightBlue)

    process.stdout.cursorTo(BASE_X + 60, startLine + 1);
    process.stdout.write('涨  停：'.cyan + (currValues.f51 == '-' || currValues.f51.toFixed(2)).toString().underline.brightBlue)

    process.stdout.cursorTo(BASE_X + 80, startLine + 1);
    process.stdout.write("跌  停：".cyan + (currValues.f52 == '-' || currValues.f52.toFixed(2)).toString().underline.brightBlue)

    process.stdout.cursorTo(BASE_X + 0, startLine + 2);
    updown = currValues.f44 > currValues.f60 ? 2 : currValues.f43 < currValues.f60 ? 0 : 1
    process.stdout.write('最  高：'.cyan + ((currValues.f44 == '-' || currValues.f44.toFixed(2)).toString() + upDownFlag[updown])[upDownColor[updown]])

    process.stdout.cursorTo(BASE_X + 20, startLine + 2);
    updown = currValues.f45 > currValues.f60 ? 2 : currValues.f43 < currValues.f60 ? 0 : 1
    process.stdout.write("最  低：".cyan + ((currValues.f45 == '-' || currValues.f45.toFixed(2)).toString() + upDownFlag[updown])[upDownColor[updown]])

    process.stdout.cursorTo(BASE_X + 40, startLine + 2);
    updown = currValues.f71 > currValues.f60 ? 2 : currValues.f43 < currValues.f60 ? 0 : 1
    process.stdout.write('均  价：'.cyan + ((currValues.f71 == '-' || currValues.f71.toFixed(2)).toString() + upDownFlag[updown])[upDownColor[updown]])

    process.stdout.cursorTo(BASE_X + 60, startLine + 2);
    updown = currValues.f45 > currValues.f60 ? 2 : currValues.f43 < currValues.f60 ? 0 : 1
    process.stdout.write("振  幅：".cyan + ((currValues.f171 == '-' || currValues.f171.toFixed(2)).toString() + upDownFlag[updown])[upDownColor[updown]])

    process.stdout.cursorTo(BASE_X + 80, startLine + 2);
    process.stdout.write('换手率：'.cyan + ((currValues.f168 == '-' || currValues.f168.toFixed(2)).toString() + '%').brightBlue)

    process.stdout.cursorTo(BASE_X + 20, startLine + 4);
    process.stdout.write("涨跌额：".cyan + (currValues.f169 == '-' || currValues.f169.toFixed(2)).toString())

    process.stdout.cursorTo(BASE_X + 40, startLine + 4);
    updown = currValues.f43 > currValues.f60 ? 2 : currValues.f43 < currValues.f60 ? 0 : 1
    process.stdout.write("最  新：".cyan.underline + ((currValues.f43 == '-' || currValues.f43.toFixed(2)).toString() + upDownFlag[updown])[upDownColor[updown]].bold.underline)

    process.stdout.cursorTo(BASE_X + 60, startLine + 4);
    process.stdout.write("涨跌幅：".cyan + (currValues.f170 == '-' || currValues.f170.toFixed(2)).toString() + '%')

    if (!currValues.time) bgColor = 'bgBlack';

    [0, 1, 2, 3, 4].forEach((v, index) => {
        // f31
        field = 'f' + (31 + 2 * v);
        process.stdout.cursorTo(BASE_X + 10, startLine + v + 8)
        process.stdout.write('                    ');
        process.stdout.moveCursor(-20, 0);
        fieldValid = currValues[field] != '-';
        if (fieldValid) {
            if (currValues.time) bgColor = newValue.hasOwnProperty(field) ? 'bgMagenta' : 'bgBlack'
            updown = currValues[field] > currValues.f60 ? 2 : currValues[field] < currValues.f60 ? 0 : 1;
            process.stdout.write(((currValues[field] == '-' || currValues[field].toFixed(2)).toString() + upDownFlag[updown])['bold'][bgColor][upDownColor[updown]]);
        } else process.stdout.write('  -  ');


        // f32
        field = 'f' + (31 + 2 * v + 1);
        process.stdout.cursorTo(BASE_X + 30, startLine + v + 8);
        process.stdout.write('                    ');
        process.stdout.moveCursor(-20, 0);
        if (fieldValid) {
            if (currValues.time) bgColor = newValue.hasOwnProperty(field) ? 'bgBrightMagenta' : 'bgBlack'
            process.stdout.write((currValues[field].toString() + upDownFlag[updown])['bold'][bgColor][upDownColor[updown]]);
        } else process.stdout.write('  -  ');

        // f11
        field = 'f' + (11 + 2 * v);
        process.stdout.cursorTo(BASE_X + 50, startLine + v + 8);
        process.stdout.write('                    ');
        process.stdout.moveCursor(-20, 0);
        fieldValid = currValues[field] != '-';
        if (fieldValid) {
            if (currValues.time) bgColor = newValue.hasOwnProperty(field) ? 'bgBrightMagenta' : 'bgBlack'
            updown = currValues[field] > currValues.f60 ? 2 : currValues[field] < currValues.f60 ? 0 : 1
            process.stdout.write(((currValues[field] == '-' || currValues[field].toFixed(2)).toString() + upDownFlag[updown])['bold'][bgColor][upDownColor[updown]]);
        } else process.stdout.write('  -  ');

        // f12
        field = 'f' + (11 + 2 * v + 1);
        process.stdout.cursorTo(BASE_X + 70, startLine + v + 8);
        process.stdout.write('                    ');
        process.stdout.moveCursor(-20, 0);
        if (fieldValid) {
            if (currValues.time) bgColor = newValue.hasOwnProperty(field) ? 'bgBrightMagenta' : 'bgBlack'
            process.stdout.write((currValues[field].toString() + upDownFlag[updown])['bold'][bgColor][upDownColor[updown]]);
        } else process.stdout.write('  -  ');
    })
    process.stdout.cursorTo(BASE_X + 0, startLine + 13);
    process.stdout.write('═════════════════════════════════════ ' + time.bold.brightMagenta + ' ════════════════════════════════════')

    process.stdout.cursorTo(BASE_X - 2, startLine);
    process.stdout.write('╔'); //└ ┐ └ ↕ ═ ╔ ╗ ╚ ╝ ║
    process.stdout.cursorTo(BASE_X + 95, startLine);
    process.stdout.write('╗');
    for (let line = 1; line < 13; line++) {
        process.stdout.cursorTo(BASE_X - 2, startLine + line);
        process.stdout.write('║')
        process.stdout.cursorTo(BASE_X + 95, startLine + line);
        process.stdout.write('║')
    }
    process.stdout.cursorTo(BASE_X - 2, startLine + 13);
    process.stdout.write('╚');
    process.stdout.cursorTo(BASE_X + 95, startLine + 13);
    process.stdout.write('╝');

    process.stdout.cursorTo(0, 0);
    currValues.time = time;
}
let getStock = (startLine, code) => {
    let currValues = {};
    if (code.indexOf('.') == -1) {
        if (code[0] == '6' || code[0] == '9') code = '1.' + code;
        else code = '0.' + code;
    }

    ess('http://push2.eastmoney.com/api/qt/stock/sse', {
        json: true,
        retry: false,
        request: {
            qs: {
                ut: 'fa5fd1943c7b386f172d6893dbfba10b',
                invt: 2,
                fltt: 2,
                fields: fields.join(','),
                secid: code,
                _: Date.now()
            }
        }
    }).on('data', function(data) {
        if (!data.data) return;
        showStock(startLine, currValues, data.data)
    })
}

let codes = (process.argv[2] || '000063').split(',');
let startLine = 2;
codes.forEach(code => {
    getStock(startLine, code);
    startLine += 15;
})