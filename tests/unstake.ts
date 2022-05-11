import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { pigMachine } from '../constants'
import {
  createAssociatedTokenAccountInstruction,
  getTokenWallet,
  program,
  provider
} from '../utils'

describe('can unstake a NFT', () => {
  it('can unstake', async () => {
    const mint = new PublicKey(
      'DEVwZPgwTp83x7vws7uhJMWH6XsJ2JeTMGRGWeSSvjZd'
    )
    const to = provider.wallet.publicKey
    /* token of the next owner */
    const destination = await getTokenWallet(to, mint)
    /* token of the current owner */
    const token = await getTokenWallet(pigMachine, mint)

    console.log('destination -> ', destination.toBase58())
    console.log('token -> ', token.toBase58())

    const accounts = {
      payer: to,
      mint,
      token,
      destination,
      pigMachine,
      authority: pigMachine,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    const destinationAccount =
      await provider.connection.getParsedAccountInfo(destination)
    const destinationHasToken = !!destinationAccount.value

    // console.log('destinationAccount -> ', destinationAccount.value.data)
    console.log(
      'does the destination has a token address for that NFT? ',
      destinationHasToken
    )

    let tx = program.methods.unstake().accounts(accounts)

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
