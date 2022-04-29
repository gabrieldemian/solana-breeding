import { PublicKey } from '@solana/web3.js'
import { DEVNET_WALLET, getTokenWallet, program, provider } from '../utils'

describe('will breed 2 pigs', () => {
  it('can breed', async () => {
    const male = new PublicKey(
      '65MDWmWByWSohBZGb5mKxiB6qjFSL3cQCofxMRQZAbMN'
    )

    // get the associated account
    const token = await getTokenWallet(DEVNET_WALLET.publicKey, male)

    console.log('token is', token.toBase58())

    const accounts = {
      authority: DEVNET_WALLET.publicKey,
      male
    }

    const largestAccounts =
      await provider.connection.getTokenLargestAccounts(male)

    const largestAccountInfo =
      await provider.connection.getParsedAccountInfo(
        largestAccounts.value[0].address
      )
    console.log('owner ', largestAccountInfo.value.data)

    await program.methods.breed().accounts(accounts).rpc()
  })
})
