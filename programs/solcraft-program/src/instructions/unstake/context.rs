use crate::error::ErrorCode;
use crate::state::{StakeAccount, StakeAccountInterval};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(stake_token_bump: u8)]
pub struct Unstake<'info> {
    #[account(
        mut,
        mint::authority = payer,
        mint::decimals = 9,
    )]
    pub mint_element: Account<'info, Mint>,

    #[account(
        mut,
        seeds=[b"stake_account", mint.key().as_ref()],
        bump,
        constraint = stake_account.to_account_info().owner == program_id,
        // close account at th end of the ix and send SOL to the backend wallet
        close = payer
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        seeds=[b"stake_interval_account", mint.key().as_ref()],
        bump,
        constraint = stake_interval_account.to_account_info().owner == program_id,
        // close account at th end of the ix and send SOL to the backend wallet
        close = payer
    )]
    pub stake_interval_account: Account<'info, StakeAccountInterval>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub user: AccountInfo<'info>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_token: Account<'info, TokenAccount>,

    /* token account of the user */
    #[account(
        mut,
        token::mint = mint_element,
        token::authority = user,
    )]
    pub token_element: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,

    #[account(
        mut,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint =
            payer.key().to_string() ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
}
