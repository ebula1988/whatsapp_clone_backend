import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants.js";

function createAccessToken(user){
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 2); // Expira en 2 hora
    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}


function createRefreshToken(user) {
    const expToken = new Date();
    expToken.setDate(expToken.getDate() + 1); // Expira en 1 días
    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}

function decoded(token) {
    return jsonwebtoken.decode(token, JWT_SECRET_KEY,true);
}

function hasExpiredToken(token) {
    const {exp} = decoded(token);
    const currentData = new Date().getTime();
    if (exp < currentData) {
        return true; // El token ha expirado
    }
    return false; // El token es válido

    ;  
}


export const jwt = { 
    createAccessToken,
    createRefreshToken,
    decoded,
    hasExpiredToken,
 };