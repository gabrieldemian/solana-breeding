use anchor_lang::prelude::*;
use anchor_spl::{token::{Token, TokenAccount, Mint}};

use crate::state::{PREFIX_PIG, PigMachine};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(bump_token: u8, bump_mint: u8, seed: String)]
pub struct InitializeRunes<'info> {
    #[account(
        seeds=[PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id,
    )]
    pub pig_machine: Account<'info, PigMachine>,
    
    #[account(
        mut,
        constraint = 
            payer.key().to_string()
            ==
            "5gwMw4a7ugtBj1F5HBAjnBZx51nwMVHgWNq7sHQPqCNa".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [seed.as_bytes()],
        bump,
        mint::decimals = 9,
        mint::authority = pig_machine,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        seeds = [mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = pig_machine,
    )]
    pub token: Account<'info, TokenAccount>,
    
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
