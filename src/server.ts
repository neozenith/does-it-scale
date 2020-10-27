import throng from 'throng'
import app from './app'

throng({ master, start: app })

// This will only be called once
function master () {
  console.log('Started master')

  process.on('beforeExit', () => {
    console.log('Master cleanup.')
  })
}
