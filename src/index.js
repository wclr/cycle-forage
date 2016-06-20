import {makeAsyncDriver} from 'cycle-async-driver'
import localforage from 'localforage'
import 'localforage-getitems'
import 'localforage-setitems'
import 'localforage-removeitems'

export const methodsParamsMap = {
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
}

const findMethodsInRequest = (request) =>
  Object.keys(request).filter(key => methodsParamsMap[key])

const getDriverName = (driver) => {
  return (driver && driver._driver) || driver
}

const getDriver = (driver) =>
  typeof driver == 'string'
    ? localforage[driver]
    : driver


const getStoreInstanceKey = (storeOptions) => {
  return [
    'store',
    getDriverName(storeOptions.driver),
    storeOptions.name,
    storeOptions.storeName
  ].filter(_ => _).join('_')
}

const storeInstancesMap = {}

const getStoreInstance = (options) => {
  var key = getStoreInstanceKey(options)
  if (!storeInstancesMap[key]){
    let opts = {...options, driver: getDriver(options.driver)}
    storeInstancesMap[key] = localforage.createInstance(opts)
  }
  return storeInstancesMap[key]
}

let getRequestStoreOptions = (options, request) => {
  let storeOptions = {...options}
  let {name, storeName} = request
  name && (storeOptions.name = name)
  storeName && (storeOptions.storeName = storeName)
  return storeOptions
}

export const makeForageDriver = (options = {}) => {
  getStoreInstance(options)
  return makeAsyncDriver({
    getResponse: (request) => {
      if (!request){
        throw new Error(`Request to localforage can not be nil.`)
      }
      let method = request.method
      if (!method){
        let methods = findMethodsInRequest(request)
        if (methods > 1){
          throw new Error(`Request to localforage should contain only one valid method.`
            + `and it contains ${methods.length}: ${methods}`)
        }
        method = methods[0]
      }
      let paramsKeys = methodsParamsMap[method]
      if (!paramsKeys){
        throw new Error(`Request method \`${method}\` is not valid localforage method.`)
      }
      let storeInstance = getStoreInstance(
        getRequestStoreOptions(options, request)
      )
      let params = request.method
        ? paramsKeys.reduce((params, paramName) =>
            params.concat([request[paramName]])
          , [])
        : (paramsKeys.length > 1 ? request[method] : [request[method]])
      return storeInstance[method].apply(storeInstance, params)
    }
  })
}
