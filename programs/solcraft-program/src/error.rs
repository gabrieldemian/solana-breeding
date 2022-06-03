use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("You don't have enough SOL to mint this NFT")]
    NotEnoughSOL,

    #[msg("You do not own one of the NFTs sent")]
    NotOwnerOfNFT,

    #[msg("You can't unstake before the due time")]
    StakeNotReady,

    #[msg("Only the backend wallet is allowed to call this transaction")]
    RespectMyAuthority,

    #[msg("You passed a mint which the authority is not the wallet of the backend")]
    MintWrongAuthority,

    #[msg("The stake interval is not over yet")]
    IntervalNotOver,
}
