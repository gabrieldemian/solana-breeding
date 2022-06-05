import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import idl from '../target/idl/solcraft_program.json'
import { getTokenWallet, program, provider } from '../utils'

describe('this will on the backend after the stake transaction', () => {
  it('can do after stake transaction', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'A8MofnmLuEZvnyfyXmssLsRqmLcN96j7h5G42AuDLJHf'
    )

    const user = new PublicKey(
      'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
    )

    const backendWallet = provider.wallet.publicKey

    /* token account of the user */
    const token = await getTokenWallet(user, mint)

    /* we will transfer the user NFT to this token account */
    /* which is owned by the program */
    const [stakeToken] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_token'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const [stakeIntervalAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_interval_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const stakeAccountInfo =
      await provider.connection.getParsedAccountInfo(stakeAccount)

    if (stakeAccountInfo.value) {
      throw new Error(
        `
          You are probably staking a NFT that is already staked, because 
          the stake account is deleted at the end of the unstake.
          And your are passing a stake account that already exists.
        `
      )
    }

    const accounts = {
      user,
      backendWallet,
      mint,
      token,
      stakeToken,
      stakeAccount,
      stakeIntervalAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    }

    console.log('mint -> ', mint.toBase58())
    console.log('stakeToken -> ', stakeToken.toBase58())
    console.log('token -> ', token.toBase58())
    console.log('\n')

    const data = {
      timeToEndForaging: 6667,
      timeForagingStarted: 6667 // this will be replaced on the contract
    }

    const stakeInterval = 6667

    await program.methods
      .afterStake(data, stakeInterval)
      .accounts(accounts)
      .rpc()
  })
})

// spl-token approve 9DTReNPRdNqRcX5VT8PPLxQSSi85Cgg59XBh4MnGScGi 1 BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr
