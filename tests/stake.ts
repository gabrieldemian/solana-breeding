import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { pigMachine } from '../constants'
import idl from '../target/idl/solcraft_breeding.json'
import { getTokenWallet, program, provider } from '../utils'

describe('can stake a NFT', () => {
  it('can stake', async () => {
    // eslint-disable-next-line radix
    const timestamp = new BN(parseInt((Date.now() / 1000).toString()))
    const mint = new PublicKey(
      '8HcchCr2shSizW9Vfp1PgruPYxeE1KGgpTbUk5RXegnw'
    )

    const token = await getTokenWallet(provider.wallet.publicKey, mint)

    const [destination, destinationBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from('stake_token'), mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

    /* generating a PDA for the stake account */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [
        Buffer.from('stake_account'),
        mint.toBuffer(),
        timestamp.toBuffer('le', 8)
      ],
      new PublicKey(idl.metadata.address)
    )

    const accounts = {
      mint,
      token,
      pigMachine,
      destination,
      stakeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: provider.wallet.publicKey,
      rent: SYSVAR_RENT_PUBKEY
    }

    const tx = program.methods
      .stake(destinationBump, timestamp)
      .accounts(accounts)

    console.log('destinationBump bump ->', destinationBump)
    console.log('mint -> ', mint.toBase58())
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('destination token -> ', destination.toBase58())
    console.log('token -> ', token.toBase58())
    console.log('\n')

    await tx.rpc()

    const stakeAccountData = await program.account.stakeAccount.fetch(
      stakeAccount
    )
    console.log('stake data:', stakeAccountData)
  })
})
