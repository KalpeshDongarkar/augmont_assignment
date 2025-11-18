const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const proxy_redirection = require('http-proxy-middleware')
const cluster = require('cluster');
const os = require('os');
const path = require("path");

const { userSrv_Lmter } = require('./services/limiter_srv');
const convertedConfig = require('./config_details.json');

const numCpu = os.cpus().length;

const app = express()
const router = express.Router();

const port = convertedConfig.corePort

app.disable('x-powered-by')
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))

app.use('/media', express.static(path.join(__dirname, '../media')));

app.use('/userauth/v1', userSrv_Lmter)

convertedConfig.proxy_redirection.forEach(element => {
  app.use(element.pathSet,
    proxy_redirection.createProxyMiddleware({
      target: element.targetUrl,
      changeOrigin: element.changeOrigin,
      pathRewrite: element.pathRewrt,
      logLevel: element.logLevel,
      secure: false,
      ws: element.webSckt,
      cookieDomainRewrite: element.cookieDomainRewrite,
      xfwd: element.xforwardHedr
    }));
});

app.use('/', router);


if (cluster.isMaster) {
  console.log(`Number of threads:${numCpu}`);
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on("exit", (Worker) => {
    console.log(`worker ${Worker.process.pid} died`);
    cluster.fork();
  })
} else {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  })
}
