# cycle-forage

> [Mozilla localForage](https://github.com/mozilla/localForage) driver for [Cycle.js](http://cycle.js.org/). Tested and ready.

*Based on generic [cycle-async-driver](https://github.com/whitecolor/cycle-async-driver)*

API is absolutely compatible:
* https://github.com/mozilla/localForage
* https://github.com/localForage-extensions/localForage-setItems
* https://github.com/localForage-extensions/localForage-getItems
* https://github.com/localForage-extensions/localForage-removeItems

## Install

```
npm instlal cycle-forage
```

## Usage

#### Driver init 
```js
import {makeForageDriver} from 'cycle-forage'
import localForage from 'localforage'

let driver = makeForageDriver({
  name: 'test', // default db name
  storeName: 'testStore', // default store name
  driver: localforage.WEBSQL // localForage.LOCALSTORAGE, localForage.INDEXEDDB
})
```

By default if driver not passed localForage uses indexeddb as storage engine. 

#### Request

 ```js
 {
    // you may override default db and store for particular request
    name: 'anotherDB',
    storeName: 'anotherStore'
    method: 'setItem', // explicit method
    key: 'author',
    value: 'Lewis Carol'
 }
 ```
Or this way (params for methods with more then one param may come as array):
 ```js
 {
    setItem: ['author', 'Lewis Carol'], 
    // setItem: {key: 'author', value: 'Lewis Carol'} is also supported
 }
 ```
for methods with one arg, put no array 
 ```js
 {
    getItem: 'author',
 }
 ```
 
#### `setItems`
 
`setItems` supports `key/value` array:
 ```js
  {
     setItems: [
        {key: 'author', value: 'Lewis Carol'},  
        {title: 'Through the Looking-Glass'}
     ],
  }
  ```
or map:
 ```js
 {
    setItems: {'author': 'Lewis Carol', title: 'Through the Looking-Glass'},
 }
 ```

#### `getItems`

`getItems` returns `key/value` map

#### Methods - params map
```js
{
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
```

## Licence 
ISC