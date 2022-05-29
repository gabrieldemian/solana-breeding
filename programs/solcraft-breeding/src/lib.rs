use anchor_lang::prelude::*;
use instructions::*;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;
use crate::state::{PigMachineData, StakeAccountData};

declare_id!("4fM7kubepyzaNe5JypWehLy5YTk5gHNSvymTDbbpnoRg");

#[program]
pub mod solcraft_breeding {

    use super::*;

    pub fn breed(ctx: Context<Breed>) -> Result<()> {
        instructions::breed::handler(ctx)
    }

    pub fn stake(ctx: Context<Stake>, bump: u8, data: StakeAccountData) -> Result<()> {
        instructions::stake::handler(ctx, bump, data)
    }

    pub fn unstake(ctx: Context<Unstake>, stake_token_bump: u8) -> Result<()> {
        instructions::unstake::handler(ctx, stake_token_bump)
    }

    pub fn initialize_runes(ctx: Context<InitializeRunes>) -> Result<()> {
        instructions::initialize_runes::handler(ctx)
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, quantity: u64) -> Result<()> {
        instructions::mint_tokens::handler(ctx, quantity)
    }

    pub fn initialize_pig_machine(
        ctx: Context<InitializePigMachine>,
        data: PigMachineData,
    ) -> Result<()> {
        instructions::initialize_pig_machine::handler(ctx, data)
    }
}

/* RENT TABLE */
/* use this to calculate the space necessary of your accounts */

/*
    bool	        1 byte	    1 bit rounded up to 1 byte.
    u8 or i8	    1 byte
    u16 or i16	    2 bytes
    u32 or i32	    4 bytes
    u64 or i64	    8 bytes
    u128 or i128	16 bytes
    [u16; 32]	    64 bytes	32 items x 2 bytes. [itemSize; arrayLength]
    PubKey	        32 bytes	Same as [u8; 32]
    vec<u16>	    Any multiple of 2 bytes + 4 bytes for the prefix	Need to allocate the maximum amount of item that could be required.
    String	        Any multiple of 1 byte + 4 bytes for the prefix	Same as vec<u8>
*/
