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

 Request format:
 ```js
 {
    method: 'setItem',
    key: 'author',
    value: 'Lewis Carol'
 }
 ```
or (params array for methods with more then one param)
 ```js
 {
    setItem: ['author', 'Lewis Carol'],
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