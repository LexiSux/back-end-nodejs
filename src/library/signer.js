import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey=fs.readFileSync('./key/private.pem');
const publicKey=fs.readFileSync('./key/public.pem');
const signerOptions= {expiresIn:'5h', audience:'HKNet', subject:'WebTelex', algorithm:'RS256'};

// verify token
export const verifyToken=(aToken)=>{
    return jwt.verify(aToken, publicKey, signerOptions);
}

// sign in token
export const signer=(uData)=>{
    return jwt.sign(uData, privateKey, signerOptions);
}

// decode token
export const decode=(aToken)=>{
    try {
        return verifyToken(aToken) && jwt.decode(aToken, {complete:false});       
    } catch (error) {
        return false;
    }
}

// refresh token
export const refreshToken=(aToken)=>{
    const {aud, exp, iat, sub, ...uData}=decode(aToken);
    return uData && signer(uData);
}