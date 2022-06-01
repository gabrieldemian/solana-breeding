import { PublicKey } from '@solana/web3.js'
import idl from './target/idl/solcraft_program.json'

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

export const pigMachine = new PublicKey(
  '4Pn68E6SUA3dXRkwwLikzDhgXrXKE2QCTFp8uou5Aot2'
)

export const programId = new PublicKey(idl.metadata.address)

/* MAINNET */
export const symbolToRewardMintMainnet = {
  FIRE: 'GdTXHhRr9UoqaYj2MC9hPz4mjE3vigGbUEfjaDCU2onq',
  EARTH: '8hHra5o2LYCUrog9KrR39uT6WW4meTBtHKCDJbyr44ox',
  ICE: 'JAJGBFCgN8YBP1ked9yRd5j52gWfyrkJAHEPQa4UUPDr',
  SAND: 'A1iT9r65MpvabW47nfvKwBDhwMjrja2ub6Fs9iD2k46U',
  DRGN: 'EUvo8GYTf2ntMGVkRqpWdN4DjAfyxkPvCKfguSuRNpK2',
  CORN: 'HEqxKLV8kW2XYd8XxCH7nPxCa5AYxhF1EqpsXCMUWDpa',
  PRICK: '4LW9ELPQg45772qU7ZT9q8BP19o3fuXcv8P15fs1MYuX',
  HOLLY: 'EdWYL5Z4tCCsMtdxPXT5iV9Ycg46U6mvCJDsQV9zQkCm',
  MAGM: 'FyctSeF2E7pcM3GRQdtfeAYsCPeHNWkgmdYGebB3y97A',
  PINEH: '6EMv9MPiTL5oWzkBHr9XmHHtRpUk12nKGfqboDFyY87P',
  SCROP: 'FjJyWJfnb39fdsswQmzNbVxCsH976SQZGFPzXvN5ufwc',
  HARE: 'CnSNBakQSv2MW7pdvdcAHpmUTmvPoChg3NfRtZ7HSaGA',
  MICE: 'HvCbPvCoDhynUffEYP8DeNDxDQ7hetnBxqFWFM6Svsa4'
}

/* DEVNET */
export const symbolToRewardDevnet = {
  FIRE: '5fTet6EwgTSy6TSQL83GYhszg3AfnzWdhpm4Q7jqNGCT',
  EARTH: 'D3ubTMajSBgJKbwkSEK9Mf6u3q8ihHprfxzTZk1waFgu',
  ICE: '7hxSXBCH9avADgKu6xvwBeBSjUBAdmb4yMiqSyYm2Xk5',
  SAND: 'CH7UwD4yj7LjenPMx3TL1SdJboqLBaNfrV8u3gzKiZRp',
  DRGN: 'AMTRapzxwYehTAsdsQQ4PnDZQzLhJHKfvJkacdQrpbWV',
  CORN: 'CPm2g1aCjjo6HLUEpjNDigVPr7wombR7MCPAPzCiJiHd',
  PRICK: '5KGrMnG9tXqiyr9SdAtXYPtLkiL2eUUezsZe6QwGXmsX',
  HOLLY: '6XCh9KixGN2ZPY1sfUzpbWTntCpLhEjed13H1GWbkEsm',
  MAGM: 'BEhSVzKsqzfn4m8hKtnTPEJohp5CiYsoXUvb9U7svfyH',
  PINEH: '2kkbA2xSMXVokkmz8LvR5hy8RvydTdpD93ZTnpy5xHXd',
  SCROP: '4jK8xBMX5io1CPf2yxmWXRoAZVQAkg7hLxC8ZX2GtHp7',
  HARE: '4C6QVYhqjJd76iLRA1mcBzybLrKBhHnCLCyA49jPF2p5',
  MICE: 'CAPeRoWxgJKQU6z6MwqpfQRSyscgG5WVa2Br66CWHwMb'
}

export const symbols = Object.keys(symbolToRewardMintMainnet)
