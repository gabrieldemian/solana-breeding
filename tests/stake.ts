import {
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import idl from '../target/idl/solcraft_program.json'
import { getTokenWallet, program, provider } from '../utils'

// ADDRESS DO BACKEND: BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr

describe('can stake a NFT', () => {
  it('can stake', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'A8MofnmLuEZvnyfyXmssLsRqmLcN96j7h5G42AuDLJHf'
    )

    const user = new PublicKey(
      'HL6iD5WZtn1m4Vzz3dwnkD553LVp9T9bLXZSarcLmhLn'
    )

    const backend_wallet = new PublicKey(
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

    /* generating a PDA for the stake account */
    const [stakeAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    /* generating a PDA for the stake interval account */
    const [stakeIntervalAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('stake_interval_account'), mint.toBuffer()],
      new PublicKey(idl.metadata.address)
    )

    const stakeAccountInfo =
      await provider.connection.getParsedAccountInfo(stakeAccount)

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

    if (!isDelegated) {
      throw new Error(
        'The token owner did not gave anyone the authority to move it'
      )
    }
    if (
      isDelegated &&
      result.value.data.parsed.info.delegate !==
        'BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr'
    )
      throw new Error(
        `The token owner gave someone the approval to move this token,
        but it was not to our backend wallet`
      )

    const stakeTokenInfo = await provider.connection.getParsedAccountInfo(
      stakeToken
    )

    const stakeTokenExist = !!stakeTokenInfo.value

    const accounts = {
      mint,
      token,
      stakeToken,
      stakeAccount,
      stakeIntervalAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: user,
      rent: SYSVAR_RENT_PUBKEY,
      backendWallet: provider.wallet.publicKey
    }

    console.log('mint -> ', mint.toBase58())
    console.log(
      'stakeIntervalAccount -> ',
      stakeIntervalAccount.toBase58()
    )
    console.log('stakeAccount -> ', stakeAccount.toBase58())
    console.log('stakeToken token -> ', stakeToken.toBase58())
    console.log('token -> ', token.toBase58())
    console.log('\n')

    // const metadata = await getMetadata(mint)
    // const metadataAccount = await Metadata.fromAccountAddress(
    //   provider.connection,
    //   metadata
    // )
    // console.log(metadataAccount.data.uri.replace(/[^\x20-\x7E]/g, ''))

    const data = {
      timeToEndForaging: 999,
      timeForagingStarted: 999 // this will be replaced on the contract
    }

    const stakeInterval = 999

    let tx = program.methods.stake(data, stakeInterval).accounts(accounts)

    const preInstructions = []

    if (!stakeTokenExist) {
      console.log('!stakeTokenExist')
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey, // payer
          stakeToken, // new associated account
          backend_wallet, // owner / wallet address (to)
          mint // mint address
        )
      )
    }

    if (preInstructions.length > 0) {
      tx = tx.preInstructions(preInstructions)
    }

    await tx.rpc()
  })
})

// spl-token approve 9DTReNPRdNqRcX5VT8PPLxQSSi85Cgg59XBh4MnGScGi 1 BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr
