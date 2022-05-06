import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  DEVNET_WALLET,
  getMetadata,
  getTokenWallet,
  program,
  provider
} from '../utils'
import { candyMachine, TOKEN_METADATA_PROGRAM_ID } from '../constants'

describe('will breed 2 pigs', () => {
  it('can breed', async () => {
    const rent =
      await provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      )

    await provider.connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    )
    const mint = new PublicKey(
      '95HB9nxTrMFuj32zeN77rNGyHBT4sRgn7LCX9P3yAiCT'
    )

    // get the associated account
    // const token = await getTokenWallet(DEVNET_WALLET.publicKey, mint)
    // const nsei = await provider.connection.getAccountInfo(token)
    // console.log(nsei)

    // console.log('token is', token.toBase58())

    const metadata = await getMetadata(mint)

    console.log('meta', metadata.toBase58())

    const male = new PublicKey(
      'BodBeWwYx13aC4e2gnCKgYXj8yienvauqTx7zGpzKsxp'
    )

    const female = new PublicKey(
      '3NkxNJAwuBnvn6HSs4cyXacqCns1mWmZsJaSEYHnmzLE'
    )

    const newMint = Keypair.generate()
    const newToken = await getTokenWallet(
      DEVNET_WALLET.publicKey,
      newMint.publicKey
    )

    const newMetadata = await getMetadata(newMint.publicKey)

    // const male = await getTokenWallet(DEVNET_WALLET.publicKey, maleMint)

    const accounts = {
      authority: DEVNET_WALLET.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      mint: newMint.publicKey,
      // token,
      metadata: newMetadata,
      // newMetadata,
      // newMint: newMint.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      candyMachine,
      male,
      female,
      rent: SYSVAR_RENT_PUBKEY
    }

    // const largestAccounts =
    //   await provider.connection.getTokenLargestAccounts(male)

    // const largestAccountInfo =
    //   await provider.connection.getParsedAccountInfo(
    //     largestAccounts.value[0].address
    //   )
    // console.log('owner ', largestAccountInfo.value.data)

    await program.methods
      .breed()
      .accounts(accounts)
      .signers([newMint])
      .preInstructions([
        SystemProgram.createAccount({
          fromPubkey: DEVNET_WALLET.publicKey,
          newAccountPubkey: newMint.publicKey,
          space: MintLayout.span,
          lamports: rent,
          programId: TOKEN_PROGRAM_ID
        }),
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          newMint.publicKey,
          0, // decimals
          DEVNET_WALLET.publicKey, // mint authority
          DEVNET_WALLET.publicKey // freeze authority
        ),
        createAssociatedTokenAccountInstruction(
          newToken, // associated account
          DEVNET_WALLET.publicKey, // payer
          DEVNET_WALLET.publicKey, // wallet address (to)
          newMint.publicKey // mint address
        ),
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          newMint.publicKey, // from
          newToken, // account that will receive the metadata
          DEVNET_WALLET.publicKey, // authority
          [],
          1 // amount
        )
      ])
      .rpc()
  })
})
