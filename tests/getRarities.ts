import { PublicKey } from '@solana/web3.js'
import { provider } from '../utils'

describe('-- starting getRarities --', () => {
  it('can get the rarities', async () => {
    const runeToken =
      await provider.connection.getParsedTokenAccountsByOwner(
        // provider.wallet.publicKey,
        new PublicKey('3HDtfiSSsrEUyb456iWCsWSUztQYNnshNfrT1gemtZKA'),
        {
          mint: new PublicKey(
            'GdTXHhRr9UoqaYj2MC9hPz4mjE3vigGbUEfjaDCU2onq'
          )
        }
      )

    console.log(runeToken.value[0].account.data.parsed)
  })
})
