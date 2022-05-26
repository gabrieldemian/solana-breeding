import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { pigMachine } from '../constants'
import idl from '../target/idl/solcraft_breeding.json'
import {
  createAssociatedTokenAccountInstruction,
  getTokenWallet,
  program,
  provider
} from '../utils'

const runes = ['ice_rune', 'fire_rune', 'sand_rune', 'earth_rune']

describe('can unstake a NFT', () => {
  it('can unstake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'BuXs3UEarSDtSLhnJCj1HnqnQa5BVBSqFDZFypAuR39J'
    )

    /* token account of the user */
    const userToken = await getTokenWallet(provider.wallet.publicKey, mint)

    /* mint PDA of the element to be given as rewards */
    const [mintElement, mintElementBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from(runes[0])],
        new PublicKey(idl.metadata.address)
      )

    const tokenElement = await getTokenWallet(
      provider.wallet.publicKey,
      mintElement
    )

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
    const stakeTokenHasToken = !!stakeTokenInfo.value
    const tokenElementHasToken = !!tokenElementInfo.value

    const accounts = {
      tokenElement,
      mintElement,
      mint,
      userToken,
      pigMachine,
      stakeToken,
      stakeAccount,
      payer: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    let tx = program.methods
      .unstake(stakeTokenBump, mintElementBump, runes[0])
      .accounts(accounts)

    const preInstructions = []

    if (!tokenElementHasToken) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          tokenElement, // new associated account
          provider.wallet.publicKey, // payer
          provider.wallet.publicKey, // wallet address (to)
          mintElement // mint address
        )
      )
    }

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!stakeTokenHasToken) {
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
    console.log('stakeToken token -> ', stakeToken.toBase58())
    console.log('userToken -> ', userToken.toBase58())
    console.log('tokenElement -> ', tokenElement.toBase58())
    console.log(
      'does the stakeToken has a token address for that NFT? ',
      stakeTokenHasToken
    )

    await tx.rpc()
  })
})
