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
    const mint = new PublicKey(
      '8arK5NxyQwrNRfTiUVxYPyN2rX8SzuZu9FGJRDToKNHw'
    )
    const to = provider.wallet.publicKey
    /* token of the next owner */
    const destination = await getTokenWallet(to, mint)
    /* token of the current owner */
    const token = await getTokenWallet(pigMachine, mint)

    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(mint.toString().slice(0, 17))],
      new PublicKey(idl.metadata.address)
    )

    /* 4RGk1iswDK99pC2JPns2ByAmv8nKWd1UFt5tMiVfBcyd */
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('destination -> ', destination.toBase58())
    console.log('token -> ', token.toBase58())

    const accounts = {
      mint,
      token,
      payer: to,
      pigMachine,
      destination,
      stakeAccount,
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
