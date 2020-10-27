import throng from 'throng'
import worker from './app'

throng({ master, worker, count: 4 })

// This will only be called once
function master () {
  console.log('Started master')

  process.on('beforeExit', () => {
    console.log('Master cleanup.')
  })
}
