"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const logger = require('tracer').console();
class CustomCors {
    constructor(validOrigins) {
        return (request, response, next) => {
            const origin = request.get('origin');
            if (!origin) {
                return next();
            }
            let approved = false;
            validOrigins.forEach(function (ori) {
                if (ori == '*')
                    approved = true;
                if (origin.includes(ori))
                    approved = true;
            });
            logger.trace(origin, approved);
            if (approved) {
                response.setHeader('Access-Control-Allow-Origin', origin);
                return next();
            }
            response.status(403).end();
        };
    }
    static getReqAsOrigin(req) {
        let proto = req.connection.encrypted ? 'https' : 'http';
        const host = req.hostname;
        let original = req.originalUrl;
        logger.trace(original);
        let origin = proto + '://' + host;
        return origin;
    }
}
exports.CustomCors = CustomCors;
class ExpressRPC {
    get appInst() { return ExpressRPC._appInst; }
    makeInstance(origins) {
        if (ExpressRPC._appInst)
            throw new Error('one instance of express app already exists');
        console.log('Allowed >>> ', origins);
        const cors = new CustomCors(origins);
        ExpressRPC._appInst = express();
        ExpressRPC._appInst.use(cors);
        ExpressRPC._appInst.use(bodyParser.urlencoded({ extended: false }));
        ExpressRPC._appInst.use(formidable());
        return ExpressRPC._appInst;
    }
    serveStatic(path) {
        ExpressRPC._appInst.use(express.static(path));
    }
}
exports.ExpressRPC = ExpressRPC;
class RPCBasicAuth {
    auth(user, password) {
        let buffUser = new Buffer(user);
        user = buffUser.toString('base64');
        let buffPwd = new Buffer(password);
        password = buffPwd.toString('base64');
        return (request, response, next) => {
            if (typeof request.fields.user === 'undefined'
                || typeof request.fields.pswd === 'undefined') {
                console.info('user or pswd not exist');
                response.status(401).send();
            }
            else if (request.fields.user !== user
                || request.fields.pswd !== password) {
                console.info('user or pswd are not correct');
                response.status(401).send();
            }
            else {
                console.info('basic auth: success');
                return next();
            }
        };
    }
    ;
}
exports.RPCBasicAuth = RPCBasicAuth;
module.exports = {
    ExpressRPC, RPCBasicAuth
};
