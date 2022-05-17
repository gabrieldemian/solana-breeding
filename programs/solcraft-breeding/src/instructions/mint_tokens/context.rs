use anchor_lang::prelude::*;
use anchor_spl::{token::{Token, TokenAccount, Mint}};

use crate::state::{PREFIX_PIG, PigMachine};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(bump: u8, seed: String, quantity: u64)]
pub struct MintTokens<'info> {
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
        mut,
        mint::authority = pig_machine,
        mint::decimals = 9,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [seed.as_ref()],
        bump = bump,
        token::mint = mint,
        token::authority = pig_machine,
    )]
    pub token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
