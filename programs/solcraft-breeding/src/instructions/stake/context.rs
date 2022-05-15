use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, Token};
use crate::state::{StakeAccount, PREFIX_PIG, PigMachine};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Stake<'info> {
    #[account(
        init,
        seeds=[b"stake_account", mint.key().as_ref()],
        payer = authority,
        bump,
        space = 8 + 4 + 32 + 32 + 1,
        constraint = stake_account.to_account_info().owner == program_id
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority,
        constraint = token.owner == authority.key(),
        constraint = token.mint == mint.key(),
    )]
    pub token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,

    #[account(
        init,
        payer = authority,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}