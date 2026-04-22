const winston = require('winston');

const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Create a logger
const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.json(), // Log format
  transports: [
    // Console transport
    new winston.transports.Console(),
    // File transport
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});

let cust_details = [["John","Kate","Ross","Joseph","Maria","Christina","Jim","Dan","Emma","Elijah"],
["Doe","Smith","Taylor","Anderson","Martinex","Johnson","Walker","Williams","Turner","Foster"],
["Miami","Houston","Los Angeles","North Dakota","Chicago","Dallas","Denver","Atlanta","San Francisco","New York"]]

// for (const [index, firstname] of cust_details[0].entries()) {
//     const lastname = cust_details[1][index];
//     const city = cust_details[2][index];
// 	logger.info(firstname+" "+lastname+", "+city);
// }

readline.question(`\nThere are 10 records. Enter the record number you would like to see\n`, number => {
    debugger;
    if (isNaN(number)) {
        logger.error("Input not a number")
        logger.warn("Only numbers can be entered.")
    } else {
        if (number >= 1 && number <= 10) {
            logger.info(
                cust_details[0][number - 1] + " " +
                cust_details[1][number - 1] + ", " +
                cust_details[2][number - 1]
            );
        } else {
            logger.error("Record not found");
            logger.warn("Record number has to be within 1 to 10");
        }
    }
    readline.close();
});

