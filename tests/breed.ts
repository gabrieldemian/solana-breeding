import { MintLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import {
  // createAssociatedTokenAccountInstruction,
  DEVNET_WALLET,
  getMetadata,
  // getTokenWallet,
  program,
  provider
} from '../utils'
import { pigMachine, TOKEN_METADATA_PROGRAM_ID } from '../constants'

/**
  Not being used right now
*/

describe('will breed 2 pigs', () => {
  it('can breed', async () => {
    const rent =
      await provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      )

    // const male = new PublicKey(
    //   '9a57Z1LkkkZvoLCGh7mEuFKZGzrxLWT35ymYsmeHFAbJ'
    // )

    // const female = new PublicKey(
    //   'ybJcqxwr1i3s8BiSWo2xw77FDNs89GK9CtdDzWKuP7Z'
    // )

    const newMint = Keypair.generate()
    // const newToken = await getTokenWallet(
    //   DEVNET_WALLET.publicKey,
    //   newMint.publicKey
    // )

    const newMetadata = await getMetadata(newMint.publicKey)

    // const male = await getTokenWallet(DEVNET_WALLET.publicKey, maleMint)

    const accounts = {
      authority: DEVNET_WALLET.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      mint: newMint.publicKey,
      metadata: newMetadata,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      pigMachine,
      // male,
      // female,
      rent: SYSVAR_RENT_PUBKEY
    }

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
        })
        // Token.createInitMintInstruction(
        //   TOKEN_PROGRAM_ID,
        //   newMint.publicKey,
        //   0, // decimals
        //   DEVNET_WALLET.publicKey, // mint authority
        //   DEVNET_WALLET.publicKey // freeze authority
        // ),
        // createAssociatedTokenAccountInstruction(
        //   newToken, // associated account
        //   DEVNET_WALLET.publicKey, // payer
        //   DEVNET_WALLET.publicKey, // wallet address (to)
        //   newMint.publicKey // mint address
        // ),
        // Token.createMintToInstruction(
        //   TOKEN_PROGRAM_ID,
        //   newMint.publicKey, // from
        //   newToken, // account that will receive the metadata
        //   DEVNET_WALLET.publicKey, // authority
        //   [],
        //   1 // amount
        // )
      ])
      .rpc()

    console.log('new mint: ', newMint.publicKey.toBase58())
  })
})
