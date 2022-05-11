import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { pigMachine } from '../constants'
// import idl from '../target/idl/solcraft_breeding.json'
import {
  createAssociatedTokenAccountInstruction,
  getTokenWallet,
  program,
  provider
} from '../utils'

describe('can stake a NFT', () => {
  it('can stake', async () => {
    const to = new PublicKey(
      '4ex7epxzVcegw1UAgasNfU3skayJNAB6VJfydJZGmt3D'
    )

    const mint = new PublicKey(
      'BjVaSyuz6nq4RJqpoY3QYmUZpMFE385ghrix16RCe5U4'
    )

    const token = await getTokenWallet(provider.wallet.publicKey, mint)
    const destination = await getTokenWallet(to, mint)

    /* generating a PDA for the stake account */
    /* unique for each mint */

    /*
      todo: data do PDA
      - start (timestamp)
      - end (timestamp)
      - mint
      - authority
    */
    // const [stakeAccount] = await PublicKey.findProgramAddress(
    //   [Buffer.from(mint.toBase58())],
    //   new PublicKey(idl.metadata.address)
    // )

    const accounts = {
      // pigMachine,
      mint,
      token,
      destination,
      authority: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    const params = {
      /* in days */
      duration: 1
    }

    console.log('mint: ', mint.toBase58())
    console.log('token: ', token.toBase58())

    console.log('destination token: ', destination.toBase58())

    const destinationAccount =
      await provider.connection.getParsedAccountInfo(destination)

    const destinationHasToken = !!destinationAccount.value

    console.log(
      'does the destination has a token address for that NFT? ',
      destinationHasToken
    )

    let tx = program.methods.stake(params).accounts(accounts)

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!destinationHasToken) {
      tx = tx.preInstructions([
        createAssociatedTokenAccountInstruction(
          destination, // new associated account
          provider.wallet.publicKey, // payer
          to, // wallet address (to)
          mint // mint address
        )
      ])
    }

    await tx.rpc()
  })
})
