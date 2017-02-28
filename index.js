'use strict';

const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const url = require('url')

exports.register = (server, options, next) => {

    const config = options.config;
    const compiler = Webpack(config);
    server.app.webpackCompiler = compiler;
    const middleware = WebpackDevMiddleware(compiler, options.options);

    server.ext('onRequest', (request, reply) => {

        const req = request.raw.req;
        const res = request.raw.res;
        const nreq = options.indexMask && options.indexMask.test(req.url)
            ? Object.assign(Object.create(req), {
                url: url.resolve(config.output.publicPath || '', 'index.html')
              })
            : req;

        middleware(nreq, res, (err) => {

            if (err) {
                return reply(err);
            }

            return reply.continue();
        });
    });

    next();
};


exports.register.attributes = {
    pkg: require('./package.json')
};
