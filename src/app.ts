
export default async function startupApp (id: number): Promise<void> {
  let exited = false

  console.log(`Started worker ${id}`)
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  async function shutdown () {
    if (exited) return
    exited = true

    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`Worker ${id} cleanup done.`)
  }
}
