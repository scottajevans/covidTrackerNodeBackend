import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
// const bearerToken = require('express-bearer-token');
import {router as globalDataRouter} from './globalData';
import {router as countryDataRouter } from './countryData';
// import {oktaAuth} from './auth'

const app = express()
  .use(cors())
  .use(bodyParser.json())
//   .use(bearerToken())
//   .use(oktaAuth)
  .use(globalDataRouter)
  .use(countryDataRouter);



app.listen(4201, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log('My Node App listening on port 4201');
});