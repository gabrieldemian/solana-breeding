use anchor_lang::prelude::*;
use anchor_spl::{token::{Token, TokenAccount, Mint}, associated_token::AssociatedToken};

use crate::state::{PREFIX_PIG, PigMachine};

#[derive(Accounts)]
#[instruction(bump: u8, rune: String)]
pub struct InitializeRunes<'info> {
    #[account(
        mut,
        seeds=[PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id,
    )]
    pub pig_machine: Account<'info, PigMachine>,
    
    #[account(mut)]
    /// CHECK: account checked in CPI
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = payer,
    )]
    /// CHECK: account checked in CPI
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        seeds = [rune.as_ref(), mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = payer,
    )]
    pub token: Account<'info, TokenAccount>,
    
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    // pub associated_token_program: Program<'info, AssociatedToken>,
}
