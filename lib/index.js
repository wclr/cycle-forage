'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeForageDriver = exports.methodsParamsMap = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cycleAsyncDriver = require('cycle-async-driver');

var _localforage = require('localforage');

var _localforage2 = _interopRequireDefault(_localforage);

require('localforage-getitems');

require('localforage-setitems');

require('localforage-removeitems');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methodsParamsMap = exports.methodsParamsMap = {
  getItem: ['key'],
  removeItem: ['key'],
  setItem: ['key', 'value'],
  keys: ['keys'],
  length: [],
  clear: [],
  iterate: ['iterator'],
  setItems: ['items'],
  getItems: ['keys'],
  removeItems: ['keys']
};

var findMethodsInRequest = function findMethodsInRequest(request) {
  return Object.keys(request).filter(function (key) {
    return methodsParamsMap[key];
  });
};

var getDriverName = function getDriverName(driver) {
  return driver && driver._driver || driver;
};

var getStoreInstanceKey = function getStoreInstanceKey(storeOptions) {
  return ['store', getDriverName(storeOptions.driver), storeOptions.name, storeOptions.storeName].filter(function (_) {
    return _;
  }).join('_');
};

var storeInstancesMap = {};

var getStoreInstance = function getStoreInstance(options) {
  var key = getStoreInstanceKey(options);
  if (!storeInstancesMap[key]) {
    if (options.hasOwnProperty('driver') && !options.driver) {
      throw new Error('Illegal localforage driver option passed');
    }
    storeInstancesMap[key] = _localforage2.default.createInstance(options);
  }
  return storeInstancesMap[key];
};

var getRequestStoreOptions = function getRequestStoreOptions(options, request) {
  var storeOptions = _extends({}, options);
  var name = request.name;
  var storeName = request.storeName;
  var driver = request.driver;

  driver !== undefined && (storeOptions.driver = driver);
  name !== undefined && (storeOptions.name = name);
  storeName !== undefined && (storeOptions.storeName = storeName);
  return storeOptions;
};

var pickKeysToArray = function pickKeysToArray(keys, obj) {
  return keys.reduce(function (picked, key) {
    return picked.concat(obj.hasOwnProperty(key) ? [obj[key]] : []);
  }, []);
};

var makeForageDriver = exports.makeForageDriver = function makeForageDriver() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  getStoreInstance(options);
  return (0, _cycleAsyncDriver.makeAsyncDriver)({
    getResponse: function getResponse(request) {
      if (!request) {
        throw new Error('Request to localforage can not be nil.');
      }
      var method = request.method;
      if (!method) {
        var methods = findMethodsInRequest(request);
        if (methods > 1) {
          throw new Error('Request to localforage should contain only one valid method.' + ('and it contains ' + methods.length + ': ' + methods));
        }
        method = methods[0];
      }
      var paramsKeys = methodsParamsMap[method];
      if (!paramsKeys) {
        throw new Error('Request method `' + method + '` is not valid localforage method.');
      }
      var storeInstance = getStoreInstance(getRequestStoreOptions(options, request));
      var params = request.method ? pickKeysToArray(paramsKeys, request) : paramsKeys.length > 1 ? Array.isArray(request[method]) ? request[method] : pickKeysToArray(paramsKeys, request[method]) : [request[method]];
      return storeInstance[method].apply(storeInstance, params);
    }
  });
};