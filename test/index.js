const {of, merge} = require('rx-factory')
const test = require('tape')
const {makeForageDriver} = require('../lib')
const localForage = require('localforage')

let driver = makeForageDriver({
  name: 'test',
  storeName: 'testStore',
  driver: localForage.LOCALSTORAGE
})

test('setItem array', (t) => {
  localStorage.removeItem('test/testStore/value')
  driver(of({setItem: ['value', 'test']}))
    .mergeAll()
    .subscribe(x => {
      t.is(localStorage.getItem('test/testStore/value'), JSON.stringify('test'))
      t.end()
    })
})

test('setItem map', (t) => {
  localStorage.removeItem('test/testStoreMap/value2')
  driver(of({
    storeName: 'testStoreMap',
    setItem: {key: 'value2', value: 'test2'}
  }))
    .mergeAll()
    .subscribe(x => {
      t.is(localStorage.getItem('test/testStoreMap/value2'), JSON.stringify('test2'))
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


test('illegal driver in request', (t) => {
  t.throws(() => {
    driver(of({
      storeName: 'testStore2',
      driver: '',
      method: 'setItem',
      key: 'should', value: 'throw'
    })).mergeAll()
      .subscribe(x => {
      })
  })
  t.end()
})

test('illegal driver on init', (t) => {
  t.throws(() => {
    let driver = makeForageDriver({
      name: 'test',
      storeName: 'testStore',
      driver: ''
    })
  })
  t.end()
})