import {
  AnchorProvider,
  Program,
  setProvider,
  workspace
} from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID
} from './constants'
import { SolcraftProgram } from './target/types/solcraft_program'

export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

export const getTokenWallet = async (
  wallet: PublicKey,
  mint: PublicKey
) => {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

export function parsePrice(
  price: number,
  mantissa: number = LAMPORTS_PER_SOL
) {
  return Math.ceil(price * mantissa)
}

export const provider = AnchorProvider.env()
setProvider(provider)

export const DEVNET_WALLET = provider.wallet
export const program =
  workspace.SolcraftProgram as Program<SolcraftProgram>
