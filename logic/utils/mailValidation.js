"use strict";

const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/,
    dns = require('dns');

function validate(email, callback) {
    if (email.length > 254) {
        callback("error", null);
        return;
    }

    let valid = tester.test(email);
    if (!valid) {
        callback("error", null);
        return;
    }

    // Further checking of some things regex can't handle
    let parts = email.split("@");
    if (parts[0].length > 64) {
        callback("error", null);
        return;
    }

    let domainParts = parts[1].split(".");
    if (domainParts.some(function (part) {
            return part.length > 63;
        })) {
        callback("error", null);
        return;
    }

    startDNSQueries(email, callback);

}

function startDNSQueries(email, callback) {
    let domain = email.split(/[@]/).splice(-1)[0].toLowerCase();


    dns.resolveMx(domain, (err, addresses) => {
        if (err || (typeof addresses === 'undefined')) {
            callback(err, null);
        }
        else if (addresses && addresses.length <= 0) {
            callback("error", {success: false, info: 'No MX Records'});
        }
        else {
            callback(null, {success: true});
        }

    });
}

module.exports = validate;