import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  ParsedAccountData,
  PublicKey,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import { pigMachine } from '../constants'
import idl from '../target/idl/solcraft_breeding.json'
import { getTokenWallet, program, provider } from '../utils'

// ADDRESS DO BACKEND: BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr

describe('can stake a NFT', () => {
  it('can stake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'BuXs3UEarSDtSLhnJCj1HnqnQa5BVBSqFDZFypAuR39J'
    )

    /* token account of the user */
    const token = await getTokenWallet(provider.wallet.publicKey, mint)

    const [stakeToken, stakeTokenBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from('stake_token'), mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

    /* generating a PDA for the stake account */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const accounts = {
      mint,
      token,
      pigMachine,
      stakeToken,
      stakeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: provider.wallet.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      backendWallet: new PublicKey(
        'BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr'
      )
    }

    const tx = program.methods.stake(stakeTokenBump).accounts(accounts)

    // const tokenInfo = await provider.connection.getParsedAccountInfo(token)
    // console.log(tokenInfo.value.data.parsed.info)

    console.log('stakeTokenBump bump ->', stakeTokenBump)
    console.log('mint -> ', mint.toBase58())
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('stakeToken token -> ', stakeToken.toBase58())
    // console.log('token -> ', token.toBase58())
    // console.log(
    //   'is token delegated? -> ',
    //   !!tokenInfo.value.data.parsed.info.delegate
    // )
    // if (tokenInfo.value.data.parsed.info.delegate) {
    //   console.log(
    //     'delegated to: ',
    //     tokenInfo.value.data.parsed.info.delegate
    //   )
    // }
    console.log('\n')

    await tx.rpc()

    // const stakeAccountData = await program.account.stakeAccount.fetch(
    //   stakeAccount
    // )
    // console.log('stake data:', stakeAccountData)
  })
})
