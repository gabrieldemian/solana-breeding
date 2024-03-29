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
    pub foraging_time: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct PigMachineData {
    /// each stake item vec will have 6 items
    pub common: Vec<StakeItem>,
    pub rare: Vec<StakeItem>,
    pub legendary: Vec<StakeItem>,
    pub mythical: Vec<StakeItem>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct StakeAccountData {
    pub time_to_end_foraging: u32,
    pub time_foraging_started: u32,
}

#[account]
#[derive(Default)]
pub struct StakeAccountInterval {
    pub stake_interval: u32,
}

#[account]
#[derive(Default)]
pub struct StakeAccount {
    pub user: Pubkey,
    pub data: StakeAccountData,
    pub token: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
}

/* seeds of the PDA, can be anything you want */
/* remember to change them on the JS too (utils.ts file) */
pub static PREFIX_PIG: &str = "solcraft_pigmachine";
