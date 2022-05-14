use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token};
use crate::state::{PREFIX_PIG, PigMachine};

#[derive(Accounts)]
pub struct Breed<'info> {
    #[account(
        seeds = [PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authority: Signer<'info>,

    #[account(mut)]
    /// CHECK: account checked in CPI
    pub metadata: AccountInfo<'info>,

    /// CHECK: account checked in CPI
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