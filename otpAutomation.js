"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Imap = require("node-imap");
var mailparser_1 = require("mailparser");
var test_1 = require("@playwright/test");
var stream_1 = require("stream");
function getLatestOtpEmail() {
    return new Promise(function (resolve, reject) {
        var imap = new Imap({
            user: 'superegoholdingtest@gmail.com',
            password: 'zckn dywa xgwe ejmj',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
        });
        imap.once('ready', function () {
            imap.openBox('INBOX', true, function (err, box) {
                if (err)
                    return reject(err);
                // Ispravan format pretrage u node-imap
                imap.search([['SUBJECT', 'OTP TOKEN']], function (err, results) {
                    if (err || results.length === 0) {
                        imap.end();
                        return reject("Nema OTP emailova.");
                    }
                    var latestEmail = results[results.length - 1];
                    var fetch = imap.fetch([latestEmail], { bodies: '', struct: true });
                    fetch.on('message', function (msg) {
                        var passThrough = new stream_1.PassThrough();
                        msg.on('body', function (stream) {
                            stream.pipe(passThrough);
                            (0, mailparser_1.simpleParser)(passThrough, function (err, parsed) {
                                var _a;
                                if (err)
                                    return reject(err);
                                var otpMatch = (_a = parsed.text) === null || _a === void 0 ? void 0 : _a.match(/ENTER THIS OTP TOKEN IN FORM TO GET LOGIN ACCESS: ([A-Za-z0-9]+)/);
                                if (otpMatch && otpMatch[1]) {
                                    resolve(otpMatch[1]);
                                    imap.end();
                                }
                                else {
                                    reject("OTP nije pronađen u emailu.");
                                    imap.end();
                                }
                            });
                        });
                    });
                    fetch.once('end', function () {
                        console.log('Preuzimanje emaila završeno.');
                    });
                });
            });
        });
        imap.once('error', function (err) { return reject(err); });
        imap.once('end', function () { return console.log('IMAP konekcija zatvorena.'); });
        imap.connect();
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, otp, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                return [4 /*yield*/, test_1.chromium.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto('http://207.154.213.8/login')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.getByRole('textbox', { name: 'Login' }).fill("superegoholdingtest@gmail.com")];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('textbox', { name: 'Password' }).fill("test1234!!")];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Login' }).click()];
            case 6:
                _a.sent();
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
            case 7:
                _a.sent();
                return [4 /*yield*/, getLatestOtpEmail()];
            case 8:
                otp = _a.sent();
                console.log("OTP is:", otp);
                return [4 /*yield*/, page.fill('input[name="otp"]', otp)];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Verify' }).click()];
            case 10:
                _a.sent();
                return [4 /*yield*/, browser.close()];
            case 11:
                _a.sent();
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.error("Došlo je do greške:", err_1);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); })();
