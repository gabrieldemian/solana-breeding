import { pigMachine } from '../constants'
import { program, provider } from '../utils'

describe('log pig machine', () => {
  it('can log pig machine', async () => {
    const pigMachineState = await program.account.pigMachine.fetch(
      pigMachine
    )

    const pigMachineInfo = await provider.connection.getParsedAccountInfo(
      pigMachine
    )

    console.log('\n')
    console.log(
      'pig machine owner: ',
      pigMachineInfo.value.owner.toBase58()
    )
    console.log('pig machine info: ', pigMachineInfo)

    console.log('\n')
    console.log('pig machine state: ')
    console.log(pigMachineState)
    console.log('pig machine authority: ')
    console.log(pigMachineState.authority.toBase58())
    console.log('\n')

    console.log('\n')
    console.log('pig machine data: ')
    console.log(pigMachineState.data)
    console.log('\n')
  })
})
