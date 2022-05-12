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
    const mint = new PublicKey(
      'H24zjW47Gvf4pKJb39ZTFegSNxaxVFjGK86oihBJhfV1'
    )
    /* to whom the token will be given */
    const to = pigMachine
    /* token account of the pig PDA */
    const destination = await getTokenWallet(to, mint)
    /* token of the current owner */
    const token = await getTokenWallet(provider.wallet.publicKey, mint)

    /* generating a PDA for the stake account */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(mint.toString().slice(0, 17))],
      new PublicKey(idl.metadata.address)
    )

    const accounts = {
      mint,
      token,
      pigMachine,
      destination,
      stakeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: provider.wallet.publicKey
    }

    const destinationAccount =
      await provider.connection.getParsedAccountInfo(destination)

    /* if the receiver has a token account, we create it */
    /* if not, we just skip this step */
    const destinationHasToken = !!destinationAccount.value

    let tx = program.methods.stake().accounts(accounts)

    let preInstructions = []

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

    console.log('mint -> ', mint.toBase58())
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('destination token -> ', destination.toBase58())
    console.log('token -> ', token.toBase58())
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
