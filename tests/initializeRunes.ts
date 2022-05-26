import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import idl from '../target/idl/solcraft_breeding.json'
import { program, provider } from '../utils'
import { pigMachine } from '../constants'

const runes = ['ice_rune', 'fire_rune', 'sand_rune', 'earth_rune']

describe('starting initialize init runes', () => {
  it('can initialize init runes', async () => {
    runes.forEach(async (rune) => {
      /* token account of the game itself */
      const [mint, mintBump] = await PublicKey.findProgramAddress(
        [Buffer.from(rune)],
        new PublicKey(idl.metadata.address)
      )

      /* token account of the game itself */
      const [token, tokenBump] = await PublicKey.findProgramAddress(
        [mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

      const accounts = {
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        pigMachine,
        token,
        mint,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId
      }

      await program.methods
        .initializeRunes(tokenBump, mintBump, rune)
        .accounts(accounts)
        .rpc()

      console.log(`${rune} mint ->`, mint.toBase58())
      console.log(`${rune} token ->`, token.toBase58())
    })
  })
})
