import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_WALLET, getTokenWallet, program } from '../utils'

describe('will breed 2 pigs', () => {
  it('can breed', async () => {
    const mint = new PublicKey(
      'EcEhyCbKvedMNGzdDFByU1kAKzYkFzHyUkHYyhbzv9Sj'
    )

    // get the associated account
    const token = await getTokenWallet(DEVNET_WALLET.publicKey, mint)

    // console.log('token is', token.toBase58())

    const accounts = {
      authority: DEVNET_WALLET.publicKey,
      mint,
      token,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    // const largestAccounts =
    //   await provider.connection.getTokenLargestAccounts(male)

    // const largestAccountInfo =
    //   await provider.connection.getParsedAccountInfo(
    //     largestAccounts.value[0].address
    //   )
    // console.log('owner ', largestAccountInfo.value.data)

    await program.methods.breed().accounts(accounts).rpc()
  })
})
