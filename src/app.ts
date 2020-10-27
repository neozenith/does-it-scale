import throng from 'throng'

export default function worker (id: number, disconnect: throng.ProcessCallback) {
  let exited = false

  console.log(`Started worker ${id}`)
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  async function shutdown () {
    if (exited) return
    exited = true

    await new Promise(r => setTimeout(r, 300)) // simulate async cleanup work
    console.log(`Worker ${id} cleanup done.`)
    disconnect()
  }
}
