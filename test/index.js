const {of, merge} = require('rx-factory')
const test = require('tape')
const {makeForageDriver} = require('../lib')

let driver = makeForageDriver({
  name: 'test',
  storeName: 'testStore',
  driver: 'LOCALSTORAGE'
})

test('setItem', (t) => {
  localStorage.removeItem('test/testStore/value')
  driver(of({setItem: ['value', 'test']}))
    .mergeAll()
    .subscribe(x => {
      t.is(localStorage.getItem('test/testStore/value'), JSON.stringify('test'))
      t.end()
    })
})

test('setItems', (t) => {
  localStorage.removeItem('test2/testStore2/items1')
  localStorage.removeItem('test2/testStore2/items2')
  const items = {item1: 'test1', item2: 'test2'}
  driver(of({
    name: 'test2',
    storeName: 'testStore2',
    method: 'setItems',
    items
  })).mergeAll()
    .subscribe(x => {
      t.is(localStorage.getItem('test2/testStore2/item1'), JSON.stringify('test1'))
      t.is(localStorage.getItem('test2/testStore2/item2'), JSON.stringify('test2'))
      t.end()
    })
})
