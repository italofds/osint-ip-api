const express = require('express');
const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;
const dbConfigFile = fs.readFileSync('./db-config.json');
const dbConfigData = JSON.parse(dbConfigFile);
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:ip/:date?', (req, res, next) => {
	const ip = req.params.ip;
	const dateString = req.params.date;		
	var selectedDB = dbConfigData.files[dbConfigData.files.length-1];

	if(dateString) {
		if(!isValidDate(dateString)) {
			var err = {};
			err.name == "DateError";
			err.statusCode = 400;
			err.message = "Invalid date."
			next(err);

		} else {
			const targetDate = new Date(dateString);
			let closestFile = null;
			let smallestDifference = Infinity;

			dbConfigData.files.forEach(file => {
				const fileDate = new Date(file.date);
				const difference = Math.abs(targetDate - fileDate);
				if (difference < smallestDifference) {
					smallestDifference = difference;
					closestFile = file;
				}
			});

			selectedDB = closestFile;
		}
	} 
	
	try {
		const dbBufferASN = fs.readFileSync(selectedDB.asnDB);
		const asnReader = Reader.openBuffer(dbBufferASN);
		asnResponse = asnReader.asn(ip);
		
		const dbBufferCity = fs.readFileSync(selectedDB.cityDB);
		const cityReader = Reader.openBuffer(dbBufferCity);
		cityResponse = cityReader.city(ip);
				
		var response = {};
		var dbDate = selectedDB.date;
		var asn = asnResponse?.autonomousSystemOrganization;
		var city = cityResponse?.city?.names?.en;
		var regionName = cityResponse?.subdivisions?.[0]?.names?.en
		var regionCode = cityResponse?.subdivisions?.[0]?.isoCode;
		var country = cityResponse?.country?.names?.["pt-BR"];
		var locationLat = cityResponse?.location?.latitude;
		var locationLng = cityResponse?.location?.longitude;
	
		response.dbDate = dbDate;
		response.ip = ip;		
		response.asn = asn ? asn : "";
		response.city = city ? city : "";
		response.regionName = regionName ? regionName : "";
		response.regionCode = regionCode ? regionCode : "";
		response.country = country ? country : "";
		response.location = {lat: locationLat ? locationLat : "", lng: locationLng ? locationLng : ""};
		
		res.json(response);
		
	} catch (err) {		
		if (err.name == "ValueError") {
			err.statusCode = 400;
			next(err);
			
		} else if (err.name == "AddressNotFoundError") {
			err.statusCode = 400;
			next(err);
			
		} else {
			console.error(err);
			next(err);
		}
	}
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'An internal error occurred in server.'
  });
});

app.listen(PORT, () => {
    console.log(`The server has started at port ${PORT}`);
});

function isValidDate(dateString) {
    // Check the date format using a regular expression
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(dateString)) {
        return false;
    }

     // Create a date object with the input string
    const date = new Date(dateString);
    const timestamp = date.getTime();

    // Check if the date is valid
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    // Compare the input date with the created date to ensure they match
    return date.toISOString().startsWith(dateString);
}