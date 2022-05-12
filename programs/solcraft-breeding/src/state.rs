use anchor_lang::prelude::*;

#[repr(C)]
#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Debug, Clone)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}

#[account]
#[derive(Default)]
pub struct CandyMachine {
    pub authority: Pubkey,
    pub bump: u8,
    pub data: CandyMachineData,
}

#[account]
#[derive(Default)]
pub struct PigMachine {
    pub authority: Pubkey,
    pub bump: u8,
    pub data: PigMachineData,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct StakeItem {
    pub name: String,
    /// in percentage
    pub success_rate: u8,
    /// in hours
    pub foraging_time: u8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct PigMachineData {
    /// each stake item vec will have 6 items
    pub common: Vec<StakeItem>,
    pub rare: Vec<StakeItem>,
    pub legendary: Vec<StakeItem>,
    pub mythical: Vec<StakeItem>,
}

#[account]
#[derive(Default)]
pub struct StakeAccount {
    /// timestamp in seconds
    pub end: u32,
    pub user: Pubkey,
    pub token: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct CandyMachineData {
    pub price: u64,
    pub nfts_minted: u64,
    pub go_live_date: Option<i64>,
    pub creators: Vec<Creator>,
    pub symbol: String,
    pub seller_fee_basis_points: u16,
    pub max_supply: Option<u64>,
}

/* seeds of the PDA, can be anything you want */
/* remember to change them on the JS too (utils.ts file) */
pub static PREFIX_CANDY: &str = "solcraft_breeding";
pub static PREFIX_PIG: &str = "solcraft_pigmachine";
