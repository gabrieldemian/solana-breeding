import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { getTokenWallet, program, provider } from '../utils'

describe('initializing approve test', () => {
  it('can approve and pay fees', async () => {
    /* mint address of the NFT to be staked */
    const mint = new PublicKey(
      'BHtRmRuWNpHMPX1jNwgJtKoooeesPPFGiQ9T9bYAbsU2'
    )

    /* change the wallet of Anchor.toml to update this wallet */
    const user = provider.wallet.publicKey

    const backendWallet = new PublicKey(
      'BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr'
    )

    /* token account of the user */
    const token = await getTokenWallet(user, mint)

    const accounts = {
      mint,
      token,
      user,
      backendWallet,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }

    await program.methods.approve().accounts(accounts).rpc()
  })
})
