import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import idl from '../target/idl/solcraft_breeding.json'
import { program, provider } from '../utils'
import { pigMachine } from '../constants'

const runes = ['ice_rune', 'fire_rune', 'sand_rune', 'earth_rune']

describe('starting initialize mint tokens', () => {
  it('can mint tokens', async () => {
    /* how many toksn to mint, in decimals */
    const quantity = 400

    /* mint account of the game itself */
    const [mint, mintBump] = await PublicKey.findProgramAddress(
      [Buffer.from(runes[0])],
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
      mint
    }

    await program.methods
      .mintTokens(tokenBump, mintBump, runes[0], new BN(quantity))
      .accounts(accounts)
      .rpc()

    console.log('mint ->', mint.toBase58())
    console.log('token ->', token.toBase58())
  })
})
