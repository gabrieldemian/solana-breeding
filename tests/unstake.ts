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

describe('can unstake a NFT', () => {
  it('can unstake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'G9M6ZotYsGcDJFjL2JX3raM2hwFYYAJ4VDaS7QZ19rQ8'
    )

    /* token account of the user */
    const token = await getTokenWallet(provider.wallet.publicKey, mint)

    /* account that holds our NFT, belongs to the contract */
    const [stakeToken, stakeTokenBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from('stake_token'), mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

    /* get the user stake account using a filter, queried by the token */
    const stakeAccountData = await program.account.stakeAccount.all([
      {
        memcmp: {
          offset: 8 + 4 + 32,
          bytes: token.toBase58()
        }
      }
    ])

    // console.log('stake_account -> ', stakeAccountData)

    const accounts = {
      mint,
      token,
      payer: provider.wallet.publicKey,
      pigMachine,
      stakeToken,
      stakeAccount: stakeAccountData[0].publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    const stakeTokenAccount =
      await provider.connection.getParsedAccountInfo(stakeToken)

    /* if the receiver has a token account, we create it */
    /* if not, we just skip this step */
    const stakeTokenHasToken = !!stakeTokenAccount.value

    let tx = program.methods.unstake(stakeTokenBump).accounts(accounts)

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!stakeTokenHasToken) {
      tx = tx.preInstructions([
        createAssociatedTokenAccountInstruction(
          stakeToken, // new associated account
          provider.wallet.publicKey, // payer
          provider.wallet.publicKey, // wallet address (to)
          mint // mint address
        )
      ])
    }

    console.log('mint ->', mint.toBase58())
    // console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('stakeToken token -> ', stakeToken.toBase58())
    console.log('token -> ', token.toBase58())
    console.log(
      'does the stakeToken has a token address for that NFT? ',
      stakeTokenHasToken
    )

    await tx.rpc()
  })
})
