import { BN } from '@project-serum/anchor'

import { candyMachine } from '../constants'
import { DEVNET_WALLET, parsePrice, program } from '../utils'

describe('will update the candy machine', () => {
  it('can update the candy machine', async () => {
    const accounts = {
      candyMachine,
      authority: DEVNET_WALLET.publicKey
    }

    await program.methods
      .updateCandyMachine(new BN(parsePrice(0.7)), new BN(1640889000))
      .accounts(accounts)
      .rpc()
  })
})
