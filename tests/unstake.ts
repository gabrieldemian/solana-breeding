import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { symbolToRewardDevnet } from '../constants'
import idl from '../target/idl/solcraft_program.json'
import {
  createAssociatedTokenAccountInstruction,
  getTokenWallet,
  program,
  provider
} from '../utils'

describe('can unstake a NFT', () => {
  it('can unstake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'BHtRmRuWNpHMPX1jNwgJtKoooeesPPFGiQ9T9bYAbsU2'
    )

    const user = new PublicKey(
      'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
    )

    /* token account of the user */
    const userToken = await getTokenWallet(user, mint)

    /* mint of the element to be given as rewards */
    const mintElement = new PublicKey(symbolToRewardDevnet.FIRE)

    /* token of the user from the mint */
    const tokenElement = await getTokenWallet(user, mintElement)

    /* token account of the mint element that will belong to the user */

    /* account that holds our NFT, belongs to the contract */
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

    const stakeTokenInfo = await provider.connection.getParsedAccountInfo(
      stakeToken
    )

    const tokenElementInfo =
      await provider.connection.getParsedAccountInfo(tokenElement)

    /* if the receiver has a token account, we create it */
    /* if not, we just skip this step */
    const isStakeTokenCreated = !!stakeTokenInfo.value
    const tokenElementHasToken = !!tokenElementInfo.value

    const accounts = {
      tokenElement,
      mintElement,
      mint,
      user,
      userToken,
      stakeToken,
      stakeAccount,
      payer: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    let tx = program.methods.unstake(stakeTokenBump).accounts(accounts)

    const preInstructions = []

    if (!tokenElementHasToken) {
      console.log('!tokenElementHasToken')
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          tokenElement, // new associated account
          provider.wallet.publicKey, // payer
          user, // wallet address (to)
          mintElement // mint address
        )
      )
    }

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!isStakeTokenCreated) {
      console.log('!isStakeTokenCreated')
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          stakeToken, // new associated account
          provider.wallet.publicKey, // payer
          provider.wallet.publicKey, // wallet address (to)
          mint // mint address
        )
      )
    }

    if (preInstructions.length > 0) {
      tx = tx.preInstructions(preInstructions)
    }

    console.log('mint ->', mint.toBase58())
    console.log('stakeToken -> ', stakeToken.toBase58())
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('userToken -> ', userToken.toBase58())
    console.log('mintElement -> ', mintElement.toBase58())
    console.log('tokenElement -> ', tokenElement.toBase58())
    console.log(
      'does the stakeToken has a token address for that NFT? ',
      isStakeTokenCreated
    )

    // const stakeAccountData = await program.account.stakeAccount.fetch(
    //   stakeAccount
    // )
    // console.log('stake data:', stakeAccountData)

    await tx.rpc()
  })
})
