use crate::error::ErrorCode;
use crate::state::{StakeAccount, StakeAccountData, StakeAccountInterval};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

#[derive(Accounts)]
#[instruction(data: StakeAccountData, stake_interval: u32)]
pub struct AfterStake<'info> {
    /* USER RELATED ACCOUNTS */
    /// CHECK: secure because we don't read or write from this account
    pub user: AccountInfo<'info>,

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
    pub backend_wallet: Signer<'info>,

    /**
        Account that stores useful information about the stake
    */
    #[account(
        init,
        payer = backend_wallet,
        seeds=[b"stake_account", mint.key().as_ref()],
        bump,
        space = 8 + 32 + 4 + 4 + 32 + 32 + 1,
        constraint = stake_account.to_account_info().owner == program_id
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /**
        Account that stores the interval constraint between stakes
    */
    #[account(
        init,
        space = 8 + 4,
        payer = backend_wallet,
        seeds=[b"stake_interval_account", mint.key().as_ref()],
        bump,
        constraint = stake_interval_account.to_account_info().owner == program_id
    )]
    pub stake_interval_account: Account<'info, StakeAccountInterval>,

    /* other programs */
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
