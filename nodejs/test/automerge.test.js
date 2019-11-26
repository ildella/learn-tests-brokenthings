/* eslint-disable max-lines-per-function */
const Automerge = require('automerge')

// Let's say doc1 is the application state on device 1.
let doc1 = Automerge.from({cards: []})

// The doc1 object is treated as immutable -- you must never change it
// directly. To change it, you need to call Automerge.change() with a callback
// in which you can mutate the state. You can also include a human-readable
// description of the change, like a commit message, which is stored in the
// change history (see below).

test('first', () => {
  doc1 = Automerge.change(doc1, 'Add card', doc => {
    doc.cards.push({title: 'Rewrite everything in Clojure', done: false})
  })
  expect(doc1).toEqual({cards: [ {title: 'Rewrite everything in Clojure', done: false} ]})
  // Automerge also defines an insertAt() method for inserting a new element at
  // a particular position in a list. Or you could use splice(), if you prefer.
  doc1 = Automerge.change(doc1, 'Add another card', doc => {
    doc.cards.insertAt(0, {title: 'Rewrite everything in Haskell', done: false})
  })
  const newStatus = {cards:
     [ {title: 'Rewrite everything in Haskell', done: false},
       {title: 'Rewrite everything in Clojure', done: false} ]}
  expect(doc1).toEqual(newStatus)
  // Now let's simulate another device, whose application state is doc2. We
  // initialise it separately, and merge doc1 into it. After merging, doc2 has
  // a copy of all the cards in doc1.
  let doc2 = Automerge.init()
  doc2 = Automerge.merge(doc2, doc1)
  doc1 = Automerge.change(doc1, 'Mark card as done', doc => {
    doc.cards[0].done = true
  })
  // And, unbeknownst to device 1, also make a change on device 2:
  doc2 = Automerge.change(doc2, 'Delete card', doc => {
    delete doc.cards[1]
  })
  // { cards: [ { title: 'Rewrite everything in Haskell', done: false } ] }

  // Now comes the moment of truth. Let's merge the changes from device 2 back
  // into device 1. You can also do the merge the other way round, and you'll get
  // the same result. The merged result remembers that 'Rewrite everything in
  // Haskell' was set to true, and that 'Rewrite everything in Clojure' was
  // deleted:

  const finalDoc = Automerge.merge(doc1, doc2)
  expect(finalDoc).toEqual({cards: [ {title: 'Rewrite everything in Haskell', done: true} ]})

  // As our final trick, we can inspect the change history. Automerge
  // automatically keeps track of every change, along with the "commit message"
  // that you passed to change(). When you query that history, it includes both
  // changes you made locally, and also changes that came from other devices. You
  // can also see a snapshot of the application state at any moment in time in the
  // past. For example, we can count how many cards there were at each point:

  const history = Automerge.getHistory(finalDoc).map(state => [state.change.message, state.snapshot.cards.length])
  expect(history).toEqual(
    [ [ 'Initialization', 0 ],
      [ 'Add card', 1 ],
      [ 'Add another card', 2 ],
      [ 'Mark card as done', 2 ],
      [ 'Delete card', 1 ] ])
})
