import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import idl from '../target/idl/solcraft_breeding.json'
import { getMetadata, getTokenWallet, program, provider } from '../utils'

// ADDRESS DO BACKEND: BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr

describe('can stake a NFT', () => {
  it('can stake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'BHtRmRuWNpHMPX1jNwgJtKoooeesPPFGiQ9T9bYAbsU2'
    )

    const user = new PublicKey(
      'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
    )

    /* token account of the user */
    const token = await getTokenWallet(user, mint)
    console.log('token -> ', token.toBase58())

    const [stakeToken, stakeTokenBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from('stake_token'), mint.toBuffer()],
        new PublicKey(idl.metadata.address)
      )

    /* generating a PDA for the stake account */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const stakeAccountInfo =
      await provider.connection.getParsedAccountInfo(stakeAccount)

    console.log(stakeAccountInfo.value)

    if (stakeAccountInfo.value) {
      throw new Error(
        `The stake_account should be erased before calling stake again.
        Did you forgot to delete it?
        `
      )
    }

    const result: any = await provider.connection.getParsedAccountInfo(
      token
    )

    /* aqui eu descubro se o usuario fez uma transacao de 'approve' */
    /* para aprovar a nossa wallet a mover o token do dono, sem a assinatura dele */

    const isDelegated = !!result.value

    console.log(result.value.data.parsed)
    if (!isDelegated) {
      throw new Error(
        'The token owner did not gave anyone the authority to move it'
      )
    }
    if (
      isDelegated &&
      result.value.data.parsed.info.delegate !==
        provider.wallet.publicKey.toBase58()
    )
      throw new Error(
        `The token owner gave someone the approval to move this token,
        but it was not to our backend wallet`
      )

    const accounts = {
      mint,
      token,
      stakeToken,
      stakeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: user,
      rent: SYSVAR_RENT_PUBKEY,
      backendWallet: provider.wallet.publicKey
    }

    console.log('stakeTokenBump bump ->', stakeTokenBump)
    console.log('mint -> ', mint.toBase58())
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('stakeToken token -> ', stakeToken.toBase58())
    console.log('token -> ', token.toBase58())
    console.log('\n')

    const metadata = await getMetadata(mint)
    const metadataAccount = await Metadata.fromAccountAddress(
      provider.connection,
      metadata
    )

    console.log(metadataAccount.data.uri.replace(/[^\x20-\x7E]/g, ''))

    const data = {
      timeToEndForaging: 999,
      stakeInterval: 222,
      amountOfItems: 4
      // metadata: metadataAccount.data.uri
    }

    const test = new Keypair()

    await program.methods
      .test(metadataAccount.data.uri.replace(/[^\x20-\x7E]/g, ''))
      .accounts({
        backendWallet: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        test: test.publicKey
      })
      .signers([test])
      .rpc()

    // await program.methods
    //   .stake(stakeTokenBump, data)
    //   .accounts(accounts)
    //   .rpc()
  })
})

// spl-token approve 9DTReNPRdNqRcX5VT8PPLxQSSi85Cgg59XBh4MnGScGi 1 BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr
