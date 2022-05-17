import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import idl from '../target/idl/solcraft_breeding.json'
import { program, provider } from '../utils'
import { pigMachine } from '../constants'

const runes = ['ice', 'fire', 'sand', 'earth']

describe('starting initialize mint tokens', () => {
  it('can mint tokens', async () => {
    /* how many toksn to mint, in decimals */
    const quantity = 99
    const mint = new PublicKey(
      '9dko9RF6Wcxty3M4DaGTp4NK7HTAS9i6f1DzSBQp4iWo'
    )

    // const mintInfo = await provider.connection.getParsedAccountInfo(mint)
    // console.log('mint info', mintInfo.value.data.parsed)

    /* token account of the game itself */
    const [token, tokenBump] = await PublicKey.findProgramAddress(
      [Buffer.from(runes[1])],
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
      .mintTokens(tokenBump, runes[1], new BN(quantity))
      .accounts(accounts)
      .rpc()

    console.log('mint ->', mint.toBase58())
    console.log('token ->', token.toBase58())
  })
})
