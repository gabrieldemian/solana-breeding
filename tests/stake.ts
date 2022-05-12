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

describe('can stake a NFT', () => {
  it('can stake', async () => {
    const to = pigMachine
    const mint = new PublicKey(
      '8arK5NxyQwrNRfTiUVxYPyN2rX8SzuZu9FGJRDToKNHw'
    )
    const token = await getTokenWallet(provider.wallet.publicKey, mint)
    /* token account of the pig PDA */
    const destination = await getTokenWallet(to, mint)

    /* generating a PDA for the stake account */
    /* unique for each mint */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(mint.toString().slice(0, 17))],
      new PublicKey(idl.metadata.address)
    )

    console.log('stakeAccount -> ', stakeAccount.toBase58())

    const accounts = {
      stakeAccount,
      mint,
      token,
      destination,
      authority: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }

    const destinationAccount =
      await provider.connection.getParsedAccountInfo(destination)

    const destinationHasToken = !!destinationAccount.value

    let tx = program.methods.stake().accounts(accounts)

    let preInstructions = []

    // if (!existStakeAccount) {
    //   const rent =
    //     await provider.connection.getMinimumBalanceForRentExemption(
    //       8 + 4 + 32 + 32
    //     )
    //   preInstructions = [
    //     ...preInstructions,
    //     SystemProgram.createAccount({
    //       fromPubkey: provider.wallet.publicKey,
    //       newAccountPubkey: stakeAccount,
    //       space: 8 + 4 + 32 + 32,
    //       lamports: rent,
    //       programId: TOKEN_PROGRAM_ID
    //     })
    //   ]
    // }

    /* if the target doesn't have an associated token account */
    /* first, we need to create one for him, and then transfer the token */
    if (!destinationHasToken) {
      preInstructions = [
        ...preInstructions,
        createAssociatedTokenAccountInstruction(
          destination, // new associated account
          provider.wallet.publicKey, // payer
          to, // wallet address (to)
          mint // mint address
        )
      ]
    }

    if (preInstructions.length > 0) {
      tx = tx.preInstructions(preInstructions)
    }

    console.log('\n')
    console.log('mint: ', mint.toBase58())
    console.log('token: ', token.toBase58())
    console.log('destination token: ', destination.toBase58())
    console.log('\n')
    console.log(
      'does the destination has a token address for that NFT? ',
      destinationHasToken
    )
    console.log('\n')

    await tx.rpc()

    const stakeAccountData = await program.account.stakeAccount.fetch(
      stakeAccount
    )
    console.log('stake data:', stakeAccountData)
  })
})
