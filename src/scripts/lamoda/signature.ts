// // @ts-ignore
const crypto = require('crypto');

// salt '38gg6EH8WWR363NEerfYPne5QveEubzB'
const SIGNATURE_SALT = calcSaltValue();

/**
 * Calculate signature salt value.
 * atm this value persitstent.
 *
 * @returns {string}
 */
function calcSaltValue() {
    // $ref - package com.google.android.gms.wallet (WalletConstants.ERROR_CODE_UNSUPPORTED_API_VERSION)
    const data = [
        102, 224, 206, 412 /* $ref*/, 108, 276, 144, 224,
        174, 348, 164, 204, 108, 204, 156, 276,
        202, 456, 204, 356, 160, 440, 202, 212,
        162, 472, 202, 276, 234, 392, 244, 264
    ];
    return data
        .map((value, i) => String.fromCharCode(i % 2 == 0 ? value >> 1 : value >> 2))
        .join('');
}

/**
 *
 * @param {string} inputKey X-Lm-SessionKey
 * @returns {string} X-LM-SessionSignature
 */
export const getSignature = (inputKey:string)=> {
    const sessionKey = inputKey.split('|')[0];
    return crypto
        .createHash('sha1')
        .update(sessionKey + SIGNATURE_SALT)
        .digest('hex');
}

/**
 * NOTE: Move to __tests__
 */
function test() {
    // Salt
    console.assert(SIGNATURE_SALT === '38gg6EH8WWR363NEerfYPne5QveEubzB', 'Unexpected salt value');

    // Key => Signature pairs
    const samples = [
        [
            'hello',
            '0e57f33cd4457c650d532870036eab4a70f7d277'
        ],
        [
            'ODgzZjgxYWQzYTg0MzczODM3YTFjNzk1ZDJkZjNjNmY=|1632321028|9e09ce197bf28351c7607c1f121f6b0e9eef1c0c',
            '1d1f6e5ef54df3e2d7073109783efa3c2408dd73'
        ],
    ];
    for (let [inputKey, expectedResult] of samples) {
        let isMatch = getSignature(inputKey) === expectedResult;
        console.assert(isMatch, 'Calculated signature should match expected');
        console.log(' [%s] %s', isMatch ? 'OK' : 'MISMATCH', inputKey);
    }
}

// module.exports.getSignature = getSignature;