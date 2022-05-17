import { Accounts } from '@project-serum/anchor'
import { IdlAccountItem } from '@project-serum/anchor/dist/cjs/idl'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import idl from '../target/idl/solcraft_breeding.json'
import { program, provider } from '../utils'
import { pigMachine } from '../constants'

const runes = ['ice', 'fire', 'sand', 'earth']

describe('starting initialize init runes', () => {
  it('can initialize init runes', async () => {
    const mint = Keypair.generate()
    const [token, tokenBump] = await PublicKey.findProgramAddress(
      [Buffer.from(runes[0]), mint.publicKey.toBuffer()],
      new PublicKey(idl.metadata.address)
    )
    // const token = await getTokenWallet(
    //   provider.wallet.publicKey,
    //   mint.publicKey
    // )

    const accounts = {
      payer: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      pigMachine,
      token,
      mint: mint.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId
    } as Accounts<IdlAccountItem>

    await program.methods
      .initializeRunes(tokenBump, runes[0])
      .accounts(accounts)
      .signers([mint])
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
