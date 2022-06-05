import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import idl from '../target/idl/solcraft_program.json'
import { getTokenWallet, program, provider } from '../utils'

describe('can stake a NFT', () => {
  it('can stake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'A8MofnmLuEZvnyfyXmssLsRqmLcN96j7h5G42AuDLJHf'
    )

    const user = provider.wallet.publicKey

    const backendWallet = new PublicKey(
      'BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr'
    )

    /* token account of the user */
    const token = await getTokenWallet(user, mint)

    /* we will transfer the user NFT to this token account */
    /* which is owned by the program */
    const [stakeToken] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_token'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const accounts = {
      user,
      backendWallet,
      mint,
      token,
      stakeToken,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY
    }

    console.log('mint -> ', mint.toBase58())
    console.log('stakeToken -> ', stakeToken.toBase58())
    console.log('token -> ', token.toBase58())
    console.log('\n')

    // const metadata = await getMetadata(mint)
    // const metadataAccount = await Metadata.fromAccountAddress(
    //   provider.connection,
    //   metadata
    // )
    // console.log(metadataAccount.data.uri.replace(/[^\x20-\x7E]/g, ''))

    const signature = await program.methods
      .stake()
      .accounts(accounts)
      .rpc()

    console.log('signature: ', signature)
  })
})

// spl-token approve 9DTReNPRdNqRcX5VT8PPLxQSSi85Cgg59XBh4MnGScGi 1 BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr
