import { Router, Request, Response, NextFunction } from 'express';


const fs = require('fs');
const path = require('path');
const re = require('request');

export const router : Router = Router();

router.get('/global', async function (req : Request, res: Response, next : NextFunction){
    try {
        var date = new Date();
        let fullPath = path.resolve(__dirname, './worldData.json')
        var covidJson = null;
        try {
          if (fs.existsSync(fullPath)) {
            let rawdata = fs.readFileSync(fullPath);
            covidJson = JSON.parse(rawdata);
          }
        } catch (err){
            console.error(err);
        }
        if (covidJson != null){
            var jsonDate = covidJson.Date;
            var date2 = new Date(jsonDate);
            var date2Formatted = date2.getUTCDate() + "/" + (date2.getUTCMonth() + 1) + "/" + date2.getUTCFullYear();
            var dateFormatted = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
            console.log("Date 1 - " + date2Formatted +  "/n date2 - " + dateFormatted);
            if (date2Formatted != dateFormatted){
                covidJson = null;
            } else {
                console.log("sending early");
            }
        }
        
        if (covidJson == null){
            covidJson = await update();
        }

        res.send(covidJson);
    } catch (err) {
        return next(err);
    }
})

function update(){
    return new Promise((resolve) => {
        console.log("File requires updating...");
        re('https://api.covid19api.com/summary', { json: true }, (err, res, body) =>{
            if (err) { return console.log(err) }
            // console.log(body);
            fs.writeFileSync('./dist/worldData.json', JSON.stringify(body));
            fs.writeFileSync('./src/worldData.json', JSON.stringify(body));
            console.log("File updated");
            resolve(body);
        })   
    })
    
}
