use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};

use crate::state::{PREFIX_PIG, PigMachine};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(bump_token: u8, bump_mint: u8, seed: String, quantity: u64)]
pub struct MintTokens<'info> {
    #[account(
        seeds=[PREFIX_PIG.as_bytes()],
        bump = pig_machine.bump,
        constraint = pig_machine.to_account_info().owner == program_id,
    )]
    pub pig_machine: Account<'info, PigMachine>,
    
    #[account(
        constraint = 
            payer.key().to_string()
            ==
            "5gwMw4a7ugtBj1F5HBAjnBZx51nwMVHgWNq7sHQPqCNa".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [seed.as_bytes()],
        bump = bump_mint,
        mint::authority = pig_machine,
        mint::decimals = 9,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [mint.key().as_ref()],
        bump = bump_token,
        token::mint = mint,
        token::authority = pig_machine,
    )]
    pub token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
