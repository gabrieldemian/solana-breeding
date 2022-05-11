use anchor_lang::prelude::*;
use crate::state::*;
use {
    metaplex_token_metadata,
    anchor_spl::token::{Token, TokenAccount},
};

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        seeds = [PREFIX_CANDY.as_bytes()],
        bump = candy_machine.bump
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authority: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: account checked in CPI
    pub metadata: AccountInfo<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(address = metaplex_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(data: CandyMachineData)]
pub struct InitializeCandyMachine<'info> {
    #[account(
        init,
        seeds=[PREFIX_CANDY.as_bytes()],
        payer = authority,
        space =
            8  +  // discriminator
                  // \/ candy_machine
            8  + 8 + 8 + (40 * 1 /* multiply by n of creators */) + 8 + 2 + 9 +
            32 +  // authority
            32 +  // start date
            1,   // bump + bonus
        bump,
        constraint = candy_machine.to_account_info().owner == program_id
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    /* the authority will also receive SOL from sales fees */
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: PigMachineData)]
pub struct InitializePigMachine<'info> {
    #[account(
        init,
        seeds=[PREFIX_PIG.as_bytes()],
        payer = authority,
        space =
            8  +  // discriminator
            // stake_items, * 6 = number of item for each table of item
            // * 4 number of tables of stake_items
            (( 4 + (1 + 1 + 4 + 15) * 2 ) * 6) * 4 ,
        bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: StakeData)]
pub struct Stake<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: AccountInfo<'info>,

    #[account(mut, constraint = token.owner == authority.key())]
    pub token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub destination: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: AccountInfo<'info>,

    #[account(mut, constraint = token.owner == authority.key())]
    pub token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub destination: AccountInfo<'info>,

    // fee payer
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateCandyMachine<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub candy_machine: Account<'info, CandyMachine>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Breed<'info> {
    #[account(
        mut,
        seeds = [PREFIX_CANDY.as_bytes()],
        bump = candy_machine.bump,
        constraint = candy_machine.to_account_info().owner == program_id
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authority: Signer<'info>,

    #[account(mut)]
    /// CHECK: account checked in CPI
    pub metadata: AccountInfo<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(address = metaplex_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    #[account(constraint = male.owner == authority.key())]
    pub male: Account<'info, TokenAccount>,
    #[account(constraint = female.owner == authority.key())]
    pub female: Account<'info, TokenAccount>,
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
