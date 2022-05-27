import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
// eslint-disable-next-line max-len
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
import { program, provider } from '../utils'
import { symbols } from '../constants'

describe('starting initialize init runes', () => {
  it('can initialize init runes', async () => {
    for (const symbol of symbols) {
      /* token account of the game itself */
      const mint = new Keypair()

      /* token account of the game itself */
      // eslint-disable-next-line no-await-in-loop
      const token = await getAssociatedTokenAddress(
        mint.publicKey,
        provider.wallet.publicKey
      )

      const accounts = {
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        token,
        mint: mint.publicKey,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID
      }

      // eslint-disable-next-line no-await-in-loop
      await program.methods
        .initializeRunes()
        .signers([mint])
        .accounts(accounts)
        .rpc()

      console.log(`${symbol} mint ->`, mint.publicKey.toBase58())
    }
  })
})
