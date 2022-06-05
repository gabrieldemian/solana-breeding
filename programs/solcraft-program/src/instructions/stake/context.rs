use crate::error::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Stake<'info> {
    /* USER RELATED ACCOUNTS */
    /// CHECK: secure
    #[account(mut)]
    pub user: Signer<'info>,

    /**
        Mint of the NFT to be staked
    */
    /// CHECK: secure because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    /* token account owned by the user, derived from 'mint' */
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
        constraint = token.mint == mint.key(),
    )]
    pub token: Box<Account<'info, TokenAccount>>,

    /* PROGRAM RELATED ACCOUNTS */
    /// CHECK: secure because Im doing a manual constraint
    #[account(
        mut,
        constraint =
            backend_wallet.key().to_string() ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub backend_wallet: AccountInfo<'info>,

    /**
        Token account owned by the program, derived from 'mint' which is a NFT
    */
    #[account(
        init,
        payer = user,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,

    /* other programs */
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
