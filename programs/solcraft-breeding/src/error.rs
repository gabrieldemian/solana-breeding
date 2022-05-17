use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("You don't have enough SOL to mint this NFT")]
    NotEnoughSOL,

    #[msg("The launch date has not come yet")]
    CandyMachineNotLiveYet,

    #[msg("There are no more NFTs to mint in this collection")]
    CandyMachineEmpty,

    #[msg("You need to pass the candy machine PDA")]
    CandyMachineWrongAddress,

    #[msg("You do not own one of the NFTs sent")]
    NotOwnerOfNFT,

    #[msg("You can't unstake before the due time")]
    StakeNotReady,

    #[msg("You are not allowed to do this!")]
    RespectMyAuthority,
}
