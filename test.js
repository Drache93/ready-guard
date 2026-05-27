const test = require('brittle')
const ReadyGuard = require('./')

test('basic', async function (t) {
  const b = new ReadyGuard()
  let i = 0

  ready()
  ready()
  await ready()

  t.is(i, 1)

  async function ready() {
    if (!b.enter()) return b.ready()
    await 1
    i++
    b.exit()
  }
})

test('readme - example', async (t) => {
  class CountOnce {
    constructor () {
      this.value = 0
      this.counting = new ReadyGuard()
      this.count()
    }

    async count () {
      if (!this.counting.enter()) return this.counting.ready()

      // Simulate doing something asynchronous
      setTimeout(() => {
        this.value++
        this.counting.exit()
      }, 100)
      return this.counting.ready()
    }
  }

  const counter = new CountOnce()
  await Promise.all([counter.count(), counter.count()])

  t.is(counter.value, 1, 'ran once')
})
