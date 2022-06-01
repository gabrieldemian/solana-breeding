use crate::error::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Approve<'info> {
    /// CHECK: safe because Im doing a manual constraint
    #[account(
        mut,
        constraint =
            backend_wallet.key().to_string() ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub backend_wallet: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
