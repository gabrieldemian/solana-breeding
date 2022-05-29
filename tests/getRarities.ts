import { PublicKey } from '@solana/web3.js'
import { program, provider } from '../utils'

describe('-- starting getRarities --', () => {
  it('can get the rarities', async () => {
    // const data = await provider.connection.getParsedTokenAccountsByOwner(
    //   // provider.wallet.publicKey,
    //   new PublicKey('CrjhY2672FWvKodjKNmi34VwkLcgEA8VqdEatLCY9U58'),
    //   {
    //     mint: new PublicKey('9fEzXLrAxukNHvgfHbV795MACfGWHBnpyv3FiLefsVmT')
    //   }
    // )

    const allUserStakes = await program.account.stakeAccount.all([
      {
        memcmp: {
          offset: 8 + 4 + 4 + 1,
          bytes: 'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
        }
      }
    ])

    // const publicKeys = allUserStakes.map((stake) =>
    //   stake.account.token.toBase58()
    // )

    // fetch('api-devnet.magiceden.dev/v2/tokens/')

    // console.log(publicKeys)

    // console.log(data.value[0].account.data)
    console.log(allUserStakes)
  })
})
