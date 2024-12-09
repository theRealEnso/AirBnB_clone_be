import jwt from "jsonwebtoken";

// jwt.sign(payload, secretOrPrivateKey, [options, callback])
export const generateToken = async (payload, secretKey, expiryTime) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, {expiresIn: expiryTime}, (error, token) => {
            if(error){
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};

// jwt.verify(token, secretOrPublicKey, [options, callback])
export const verifyToken = async (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decodedUser) => {
            if(error){
                reject(error);
            } else {
                resolve(decodedUser)
            }
        });
    });
};