use crate::error::ErrorCode;
use crate::state::{StakeAccount, StakeAccountData, StakeAccountInterval};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(data: StakeAccountData, stake_interval: u32)]
pub struct Stake<'info> {
    #[account(
        init,
        payer = backend_wallet,
        seeds=[b"stake_account", mint.key().as_ref()],
        bump,
        space = 8 + 32 + 4 + 4 + 32 + 32 + 1,
        constraint = stake_account.to_account_info().owner == program_id
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        init,
        space = 8 + 4,
        payer = backend_wallet,
        seeds=[b"stake_interval_account", mint.key().as_ref()],
        bump,
        constraint = stake_interval_account.to_account_info().owner == program_id
    )]
    pub stake_interval_account: Account<'info, StakeAccountInterval>,

    /// CHECK: secure because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority,
        constraint = token.mint == mint.key(),
    )]
    pub token: Box<Account<'info, TokenAccount>>,

    /// CHECK: secure because we are not reading or mutating data
    #[account(
        mut,
        constraint =
            backend_wallet.key().to_string() ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub backend_wallet: Signer<'info>,

    /// CHECK: secure because we are not mutating data
    pub authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,

    #[account(
        init,
        payer = backend_wallet,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
