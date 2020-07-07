import { Router, Request, Response, NextFunction } from 'express';
// import * as covidJson from './worldData.json';


const fs = require('fs');
const path = require('path');
const re = require('request');

export const router : Router = Router();

router.get('/country/:country', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let country = req.params.country;
        let fullPath = path.resolve(__dirname, './countryDataFiles/' + country + '.json')
        var countryData = null;
        try {
          if (fs.existsSync(fullPath)) {
            let rawdata = fs.readFileSync(fullPath);
            countryData = JSON.parse(rawdata);
          }
        } catch (err) {
          console.error(err);
        }
        if (countryData != null){
          let mostRecent = countryData[countryData.length - 1];
          let mostRecentDate = new Date(mostRecent.Date);
          let mostRecentDateFormatted = mostRecentDate.getUTCDate() + "/" + (mostRecentDate.getUTCMonth() + 1) + "/" + mostRecentDate.getUTCFullYear();
          var date = new Date();
          date.setDate(date.getDate() - 1);
          let dateFormatted = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
          console.log(mostRecentDateFormatted);
          console.log(dateFormatted);
          if (mostRecentDateFormatted != dateFormatted){
            countryData = null;
          } else {
            console.log("sending early");
          }
        }

        if (countryData == null){
          countryData = await update(country);
        }

        res.send(countryData);   
    }
    catch (err) {
      return next(err);
    }
  });


function update(country) {
  return new Promise((resolve) => {
    console.log("updating file for " + country)
    re('https://api.covid19api.com/total/country/' + country.replace(/ /g, "-"), { json: true }, (err, res, body) =>{
        if (err) { return console.log(err) }
        // console.log(body);
        fs.writeFileSync('./dist/countryDataFiles/' + country + '.json', JSON.stringify(body));
        fs.writeFileSync('./src/countryDataFiles/' + country + '.json', JSON.stringify(body));
        console.log("File updated");
        resolve(body)
    })
  })
}