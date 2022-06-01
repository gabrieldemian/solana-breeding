import { PublicKey, SystemProgram } from '@solana/web3.js'

import { PREFIX_PIG } from '../constants'
import idl from '../target/idl/solcraft_program.json'
import { program, provider } from '../utils'

describe('starting initialize pig machine', () => {
  it('can initialize pig machine', async () => {
    /* generating a PDA */
    const [pigMachine] = await PublicKey.findProgramAddress(
      [Buffer.from(PREFIX_PIG)],
      new PublicKey(idl.metadata.address)
    )

    const params = {
      common: [
        {
          name: 'Mud',
          successRate: 30,
          foragingTime: 16
        },
        {
          name: 'Ocean',
          successRate: 30,
          foragingTime: 16
        },
        {
          name: 'Steam',
          successRate: 30,
          foragingTime: 16
        },
        {
          name: 'Pressure',
          successRate: 30,
          foragingTime: 16
        },
        {
          name: 'Heat',
          successRate: 30,
          foragingTime: 16
        }
      ],
      rare: [
        {
          name: 'Energy',
          successRate: 50,
          foragingTime: 12
        },
        {
          name: 'Sun',
          successRate: 50,
          foragingTime: 12
        },
        {
          name: 'Lava',
          successRate: 50,
          foragingTime: 12
        },
        {
          name: 'Stone',
          successRate: 50,
          foragingTime: 12
        },
        {
          name: 'Wind',
          successRate: 50,
          foragingTime: 12
        },
        {
          name: 'Earthquake',
          successRate: 50,
          foragingTime: 12
        }
      ],
      legendary: [
        {
          name: 'Volcano',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Dust',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Atmosphere',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Rain',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Frost',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Ice',
          successRate: 30,
          foragingTime: 8
        }
      ],
      mythical: [
        {
          name: 'Volcano',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Dust',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Atmosphere',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Rain',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Frost',
          successRate: 80,
          foragingTime: 8
        },
        {
          name: 'Ice',
          successRate: 30,
          foragingTime: 8
        }
      ]
    }

    console.log('\n take this address and replace on /constants.ts')
    console.log('\n pigMachine address: ', pigMachine.toBase58(), '\n')

    const accounts = {
      pigMachine,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    }

    await program.methods
      .initializePigMachine(params)
      .accounts(accounts)
      .rpc()
  })
})
