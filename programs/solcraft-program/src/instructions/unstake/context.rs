use crate::error::ErrorCode;
use crate::state::{StakeAccount, StakeAccountInterval};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(stake_token_bump: u8)]
pub struct Unstake<'info> {
    /* USER RELATED ACCOUNTS */
    /// CHECK: Not dangerous, we dont mutate this account
    pub user: AccountInfo<'info>,

    /**
        Mint of the staked NFT
    */
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: Account<'info, Mint>,

    /**
        Token account of the user, derived from the mint of the reward
    */
    #[account(
        mut,
        token::mint = mint_element,
        token::authority = user,
    )]
    pub token_element: Box<Account<'info, TokenAccount>>,

    /**
       Token account owned by the user, derived from 'mint' which is the staked NFT
    */
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_token: Account<'info, TokenAccount>,

    /* PROGRAM RELATED ACCOUNTS */
    #[account(
        mut,
        constraint =
            backend_wallet.key().to_string() ==
            "BcZMhAvQCz1XXErtW748YNebBsTmyRfytikr6EAS3fRr".to_string()
            @ ErrorCode::RespectMyAuthority
    )]
    pub backend_wallet: Signer<'info>,

    /**
        Mint of the reward, which is a fungible token
    */
    #[account(
        mut,
        mint::authority = backend_wallet,
        mint::decimals = 9,
    )]
    pub mint_element: Account<'info, Mint>,

    /**
        Token account owned by the program, derived from 'mint'
    */
    #[account(
        mut,
        seeds = [b"stake_token", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stake_token,
    )]
    pub stake_token: Account<'info, TokenAccount>,

    /**
        Account that stores useful information about the stake
    */
    #[account(
        mut,
        seeds=[b"stake_account", mint.key().as_ref()],
        bump,
        constraint = stake_account.to_account_info().owner == program_id,
        // close account at th end of the ix and send SOL to the backend wallet
        close = backend_wallet
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /**
        Account that stores the interval constraint between stakes
    */
    #[account(
        mut,
        seeds=[b"stake_interval_account", mint.key().as_ref()],
        bump,
        constraint = stake_interval_account.to_account_info().owner == program_id,
        // close account at th end of the ix and send SOL to the backend wallet
        close = backend_wallet
    )]
    pub stake_interval_account: Account<'info, StakeAccountInterval>,

    /* other programs */
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}
