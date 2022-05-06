import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import { candyMachine, TOKEN_METADATA_PROGRAM_ID } from '../constants'
import {
  createAssociatedTokenAccountInstruction,
  DEVNET_WALLET,
  getMetadata,
  getTokenWallet,
  program,
  provider
} from '../utils'

const mintNFT = async () => {
  /* our PDA */
  const candyMachineState = await program.account.candyMachine.fetch(
    candyMachine
  )

  /* the mint account is unique for each token */
  /* for each NFT one mint account is generated */
  /* for a fungible token, only one is created */

  /* the authority use this account to mint tokens */
  /* for himself or other people */
  const mint = Keypair.generate()

  /* the associated token account between the wallet of the user */
  /* and the mint account */

  /* this token account is unique for each wallet */
  /* this account simply stores how many tokens a user has */
  /* for which token type (mint account) */
  const token = await getTokenWallet(
    DEVNET_WALLET.publicKey,
    mint.publicKey
  )
  const metadata = await getMetadata(mint.publicKey)
  const rent = await provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  )

  const accounts = {
    candyMachine,
    authority: candyMachineState.authority,
    mint: mint.publicKey,
    metadata,
    mintAuthority: DEVNET_WALLET.publicKey,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY
  }

  console.log(MintLayout.span)

  await program.methods
    .mintNft(
      'Pig #1',
      'https://spdda7jyig6ja6wwkgt7oz2gf4q4qgy2kqqeqmgmoxyraurv.arweave.net/k8YwfThBvJB61--lGn92dGLyHIGxpUIEgwzHXxEFI1c'
    )
    .accounts(accounts)
    .signers([mint])
    .preInstructions([
      /* create an account and pay the rent */
      SystemProgram.createAccount({
        fromPubkey: DEVNET_WALLET.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID
      }),
      /* make that account into a mint account */
      /* this could also be an ERC20 miint account */
      /* if the decimals is more than 0 */
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0, // decimals
        DEVNET_WALLET.publicKey, // mint authority
        DEVNET_WALLET.publicKey // freeze authority
      ),
      /* create an associated token account between your wallet */
      /* and the mint account */
      /* create a token account that will hold your mint account */
      /* you'll own this account */
      /* in another words, an account that holds your NFT */
      createAssociatedTokenAccountInstruction(
        token, // associated account
        DEVNET_WALLET.publicKey, // payer
        DEVNET_WALLET.publicKey, // wallet address (to)
        mint.publicKey // mint address
      ),
      /* mint one token (NFT) to your associated token account */
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey, // from
        token, // account that will receive the metadata
        DEVNET_WALLET.publicKey, // authority
        [],
        1 // amount
      )
    ])
    .rpc()

  console.log('your NFT mint addr is: ', mint.publicKey.toBase58())
}

export default mintNFT
