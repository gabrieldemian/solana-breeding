import { BN } from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'

import { PREFIX } from '../constants'
import idl from '../target/idl/solcraft_breeding.json'
import { DEVNET_WALLET, parsePrice, program, provider } from '../utils'

const initializeCandyMachine = async () => {
  /* generating a PDA */
  const [candyMachine] = await PublicKey.findProgramAddress(
    [Buffer.from(PREFIX)],
    new PublicKey(idl.metadata.address)
  )

  const params = {
    price: new BN(parsePrice(0.01)),
    nftsMinted: new BN(0),
    goLiveDate: new BN(1640889000),
    creators: [
      { address: DEVNET_WALLET.publicKey, verified: true, share: 100 }
    ],
    symbol: 'PIG',
    sellerFeeBasisPoints: 500, // 500 = 5%
    maxSupply: new BN(48)
  }

  console.log('\n take this address and replace on /constants.ts')
  console.log('\n candyMachine address: ', candyMachine.toBase58(), '\n')

  const accounts = {
    candyMachine,
    authority: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId
  }

  await program.methods
    .initializeCandyMachine(params)
    .accounts(accounts)
    .rpc()
}

export default initializeCandyMachine
