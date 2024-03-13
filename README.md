# osint-ip-api

A RESTful application developed in Node.js, designed to provide a simple and efficient IP query interface. Using the free MaxMind IP database (https://www.maxmind.com/) as a base, this API allows users to obtain detailed information about connection providers and approximate locations for specific IP addresses.

## Key Features

- **IP Information Query:** Provides detailed data about the connection provider and the approximate location of IP addresses.
- **MaxMind Database Support:** Natively integrated with MaxMind's GeoLite2 database, ensuring accurate and up-to-date information.
- **Data Flexibility:** Allows integration with other IP databases, making the necessary adjustments, offering versatility for specific needs.
- **Easy Setup:** Simplified configuration for quick deployment and use in various development environments.

## Prerequisites

Before starting to use the **osint-ip-api**, it is necessary to have Node.js installed on your machine. Additionally, you must download the IP database from MaxMind or any other provider of your choice, which should be added to the `db` folder and mapped on `db-config.json` file.

> [!NOTE]
> Detailed instructions for downloading and setting up the MaxMind database are available in the official documentation (https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).

## Installation and Configuration

1. Clone the project repository to your local machine:

```bash
git clone https://github.com/italofds/osint-ip-api.git
cd osint-ip-api
```

2. Install the project dependencies:

```bash
npm install
```

3. Add the MaxMind IP database (or from another supplier) to the project. Consult the MaxMind documentation for detailed setup instructions.

4. Start the API to receive requests:

```bash
node server
```

## Usage

After setup, the API is ready to be used. To perform an IP query, simply access the API through your preferred browser, informing the IP address to be consulted:

Example: http://localhost:3000/2001:0d1b:85a3:0:0:8A2E:0370:7354

If the IP is valid and listed in the consulted database, the response should be presented in the following format:

```json
{
  "dbDate" : "0000-00-00",
  "asn": "CONNECTION PROVIDER",
  "city": "CITY NAME",
  "subdivisionName": "SUBDIVISION NAME",
  "subdivisionCode": "SUBDIVISION CODE",
  "country": "COUNTRY NAME",
  "location": {
    "lat": -00.0000,
    "lng": -00.0000
  }
}
```

If you wish to perform an IP search on a specific date, simply enter the date in the YYYY-MM-DD format right after the IP. This way, the API will search the database for a date closest to the one provided, to carry out a more accurate query. For example:

http://localhost:3000/2001:0d1b:85a3:0:0:8A2E:0370:7354/2024-03-12


## Contributing

Contributions to **osint-ip-api** are always welcome. Whether adding support for new IP databases, improving query efficiency, or documenting the project, your help is valuable in making this tool even more powerful.

## License

This project is licensed under the GNU General Public License (GPL), a free software license that guarantees users the freedom to run, study, share, and modify the software.

The GPL is a copyleft license, which means that any modified versions of the software must also be distributed under the same terms of the license. This promotes a free software community, encouraging collaboration and the sharing of improvements.

For more information about the GPL and its terms and conditions of use, visit [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html).
