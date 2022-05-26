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
export const PREFIX_CANDY = 'solcraft_breeding'

export const PREFIX_PIG = 'solcraft_pigmachine'

/* replace the following with your own pubkeys */
export const candyMachine = new PublicKey(
  'AhvRPxJN42sQ8f7ZpWhMBERen7kZdp8Q7V9W1krE8Lvv'
)

export const pigMachine = new PublicKey(
  '2WM6MfwgmZjf5vvym1HbgmsxhY4uwwL6uWTHzeQpaPaa'
)

export const programId = new PublicKey(
  '6B9CZ3n15nPLcwAvZLrMrYSRjJK1BquqZLky9RCLLJte'
)
