const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const jwtServ = require("../core_srv/services/jwt_srv")

const { convertedConfig } = require('../core_srv/config_details.json');
let serverDtl = convertedConfig?.proxy_redirection.find(ele => ele.serviceLob == 'product') ?? {}
const port = serverDtl?.srv_port ?? 3022
const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'))

app.use(jwtServ.bypassFn)

app.use('/', require('./route'));

app.listen(port, () => {
  console.log(`Product Service is running at http://localhost:${port}`);
})
