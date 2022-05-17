import { Accounts } from '@project-serum/anchor'
import { IdlAccountItem } from '@project-serum/anchor/dist/cjs/idl'
import { MintLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import idl from '../target/idl/solcraft_breeding.json'
import { getTokenWallet, program, provider } from '../utils'
import { pigMachine } from '../constants'

describe('starting initialize init runes', () => {
  it('can initialize init runes', async () => {
    const rent =
      await provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      )

    const mint = Keypair.generate()
    // const token = await getTokenWallet(
    //   provider.wallet.publicKey,
    //   mint.publicKey
    // )

    const accounts = {
      payer: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      pigMachine,
      // token,
      // mint: mint.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId
    } as Accounts<IdlAccountItem>

    await program.methods
      .initializeRunes()
      .accounts(accounts)
      // .signers([mint])
      // .preInstructions([
      //   SystemProgram.createAccount({
      //     fromPubkey: provider.wallet.publicKey,
      //     newAccountPubkey: mint.publicKey,
      //     space: MintLayout.span,
      //     lamports: rent,
      //     programId: TOKEN_PROGRAM_ID
      //   })
      // ])
      .rpc()
  })
})
