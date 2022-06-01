use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(quantity: u64)]
pub struct MintTokens<'info> {
    #[account(
        constraint = 
            payer.key().to_string()
            ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub payer: Signer<'info>,

    /// CHECK: not dangerous becouse we dont mutate or read data
    pub user: AccountInfo<'info>,

    #[account(
        mut,
        mint::authority = payer,
        mint::decimals = 9,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = user,
    )]
    pub token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
