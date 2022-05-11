import { pigMachine } from '../constants'
import { program } from '../utils'

describe('log pig machine', () => {
  it('can log pig machine', async () => {
    const pigMachineState = await program.account.pigMachine.fetch(
      pigMachine
    )

    console.log('\n')
    console.log('pig machine state: ')
    console.log(pigMachineState)
    console.log('\n')

    console.log('\n')
    console.log('pig machine data: ')
    console.log(pigMachineState.data)
    console.log('\n')
  })
})
