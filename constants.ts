import { PublicKey } from '@solana/web3.js'

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

/* metaplex program */
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

/* seed of the PDA, can be anything you want */
/* remember to change them on the contract too (state.rs file) */
export const PREFIX = 'solcraft_breeding'

/* replace the following with your own pubkeys */
export const candyMachine = new PublicKey(
  'AhvRPxJN42sQ8f7ZpWhMBERen7kZdp8Q7V9W1krE8Lvv'
)

export const programId = new PublicKey(
  'F4FfKsLLJjNR8WB6wpGufabkZFG6McptNuewPFSfKQM1'
)
