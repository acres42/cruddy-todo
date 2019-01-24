const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let target = exports.dataDir + '/' + id + '.txt';
    fs.writeFile(target, text, (err) => {
      if (err) {
        callback(new Error('No item created.'));
      }
      callback(null, {
        id,
        text
      });
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      callback(new Error('All files not read.'));
    }
    items = _.map(items, (item) => {
      let obj = {};
      obj.id = item.slice(0, 5);
      obj.text = item.slice(0, 5);
      return obj;
    });
    callback(null, items);
  });
};
//TODO:   callback(new Error(`No item with id: ${id}`));
exports.readOne = (id, callback) => {
  let target = exports.dataDir + '/' + id + '.txt';
  fs.readFile(target, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id} found.`));
    } else {
      callback(null, {
        id,
        text: fileData.toString()
      });
    }
  });
};

exports.update = (id, text, callback) => {
  let target = exports.dataDir + '/' + id + '.txt';
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`Item with id: ${id} not updated.`));
    } else {
      fs.writeFile(target, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let target = exports.dataDir + '/' + id + '.txt';
  exports.readOne(id, (err) => {
    if (err) {
      callback(new Error(`Item with id: ${id} not found.`));
    } else {
      fs.unlink(target, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id} deleted.`));
        }
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};