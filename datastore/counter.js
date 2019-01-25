const fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};
// var getGitHubProfileAsync = Promise.promisify(getGitHubProfile);
var readCounterAsync = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

var writeCounterAsync = Promise.promisify(writeCounter);
// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, count) => {
    if (err) {
      callback(null, 0);
    } else {
      writeCounter(count + 1, (err, counterString) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, counterString);
        }
      });
    }
  });
};

var getNextUniqueIdAsync = Promise.promisify(exports.getNextUniqueId);
// exports.getNextUniqueIdPromise = () => {
//   return new Promise((resolve, reject)=>{
//     readCounter((err, count) => if (err) reject(error))
//     .then((count) =>{
//       writeCounter(count+1, )
//     }

//   });
// };

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
