import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
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
    /* mint address */

    // const timestamp = new BN(parseInt((Date.now() / 1000).toString()))
    const mint = new PublicKey(
      '8HcchCr2shSizW9Vfp1PgruPYxeE1KGgpTbUk5RXegnw'
    )

    /* token of the next owner, that will be the current user */
    const token = await getTokenWallet(provider.wallet.publicKey, mint)

    /* account that holds our NFT, belongs to the contract */
    const [destination, destinationBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from('stake_token'), mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

    /* @todo: use the fetch filter to get the stake_account */
    /* and then send it to the unstake instruction */
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
      destination,
      stakeAccount: stakeAccountData[0].publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY
    }

    const destinationAccount =
      await provider.connection.getParsedAccountInfo(destination)

    /* if the receiver has a token account, we create it */
    /* if not, we just skip this step */
    const destinationHasToken = !!destinationAccount.value

    let tx = program.methods.unstake(destinationBump).accounts(accounts)

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!destinationHasToken) {
      tx = tx.preInstructions([
        createAssociatedTokenAccountInstruction(
          destination, // new associated account
          provider.wallet.publicKey, // payer
          provider.wallet.publicKey, // wallet address (to)
          mint // mint address
        )
      ])
    }

    // console.log('mint ->', mint.toBase58())
    // // console.log('stakeAccount -> ', stakeAccount.toBase58())
    // console.log('destination token -> ', destination.toBase58())
    // console.log('token -> ', token.toBase58())
    // console.log(
    //   'does the destination has a token address for that NFT? ',
    //   destinationHasToken
    // )

    await tx.rpc()
  })
})
