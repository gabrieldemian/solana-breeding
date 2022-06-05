import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  getTokenWallet,
  program,
  provider
} from '../utils'
import { symbolToRewardDevnet } from '../constants'

/**
  Mint new fungible tokens
*/

describe('starting initialize mint tokens', () => {
  it('can mint tokens', async () => {
    const user = new PublicKey(
      'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
    )

    /* mint account of the game itself */
    const mint = new PublicKey(symbolToRewardDevnet.SCROP)

    /* token account of the user */
    const token = await getTokenWallet(user, mint)

    const preInstructions = []
    const tokenAccountInfo =
      await provider.connection.getParsedAccountInfo(token)

    const isTokenAccountCreated = Boolean(tokenAccountInfo?.value)

    console.log('isTokenAccountCreated? ', isTokenAccountCreated)

    /* if the user doesnt have a token account for that reward */
    /* we will create it, before the transfer */
    if (!isTokenAccountCreated) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey, // payer
          token, // new associated account
          user, // owner of this token account
          mint // mint address
        )
      )
    }

    const accounts = {
      payer: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      token,
      mint,
      user
    }

    /* mint 3 new items to the user */
    let tx = program.methods.mintTokens(new BN(3)).accounts(accounts)

    if (preInstructions.length > 0) {
      tx = tx.preInstructions(preInstructions)
    }

    await tx.rpc()

    console.log('mint ->', mint.toBase58())
    console.log('token ->', token.toBase58())
    console.log('user -> ', user.toBase58())
    console.log(
      'provider.wallet.publicKey -> ',
      provider.wallet.publicKey.toBase58()
    )
  })
})
