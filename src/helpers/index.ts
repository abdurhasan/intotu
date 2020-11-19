import * as crypto from 'crypto';


export function parseJson(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return null;
    }
    return JSON.parse(str);
}


// SHA384(SHA256(partnerCode + email) + Intotu2020!)
export function generateToken(partnerCode: string, email: string) {
    const pwd: string = partnerCode + email + 'Intotu2020';
    const layerOne = crypto.createHash('sha256').update(pwd, 'utf8').digest('hex');
    const finalEncryption = crypto.createHash('sha384').update(layerOne, 'utf8').digest('hex');
    return finalEncryption;
}
