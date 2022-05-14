use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, Token};
use crate::state::{StakeAccount, PREFIX_PIG, PigMachine};

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    #[account(
        mut,
        seeds=[b"stake_account", mint.key().as_ref(), stake_account.timestamp.to_le_bytes().as_ref()],
        bump,
        constraint = stake_account.to_account_info().owner == program_id,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,

    #[account(
        mut,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,

    // fee payer
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
}