import { PublicKey } from '@solana/web3.js'
import { program } from '../utils'
import idl from '../target/idl/solcraft_program.json'

/**
  This is just a playground for me to quickly test some ideas
*/

describe('-- starting getRarities --', () => {
  it('can get the rarities', async () => {
    const mint = new PublicKey(
      'A8MofnmLuEZvnyfyXmssLsRqmLcN96j7h5G42AuDLJHf'
    )

    const allUserStakes = await program.account.stakeAccount.all([
      {
        memcmp: {
          offset: 8,
          bytes: 'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
        }
      }
    ])

    const [stakeAccountInterval] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_interval_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const stakeAccountIntervalInfo =
      await program.account.stakeAccountInterval.fetch(
        stakeAccountInterval
      )

    console.log('\n-- stake account interval: ', stakeAccountIntervalInfo)

    // console.log(allUserStakes[0].account.mint.toBase58())
    const myStake = allUserStakes.filter(
      (stake) => stake.account.mint.toBase58() === mint.toBase58()
    )
    if (myStake.length) {
      console.log('-- user', myStake[0].account.user.toBase58())
      console.log('-- mint', myStake[0].account.mint.toBase58())
      console.log('-- data', myStake[0].account.data)
    } else {
      console.log(
        '\n !!! no stake account was found for this mint address !!! \n'
      )
    }
  })
})
