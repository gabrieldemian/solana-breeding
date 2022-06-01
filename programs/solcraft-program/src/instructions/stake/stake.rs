use crate::state::StakeAccountData;

use super::Stake;
use anchor_lang::prelude::*;

pub fn handler(ctx: Context<Stake>, bump: u8, data: StakeAccountData) -> Result<()> {
    let now = Clock::get().unwrap().unix_timestamp as u32;
    let end = now + (60 * 15);

    msg!("now: {}", now);
    msg!("stake_end: {}", end);

    let token = &ctx.accounts.token.to_account_info();
    let authority = &ctx.accounts.authority.to_account_info();
    let stake_token = &ctx.accounts.stake_token.to_account_info();
    let backend_wallet = &ctx.accounts.backend_wallet.to_account_info();
    let mint = &ctx.accounts.mint.to_account_info();
    let stake_account = &mut ctx.accounts.stake_account;

    stake_account.user = authority.key.clone();
    stake_account.data.stake_interval = data.stake_interval;
    stake_account.data.time_to_end_foraging = data.time_to_end_foraging;
    stake_account.data.time_foraging_started = now;
    stake_account.token = token.key.clone();
    stake_account.mint = mint.key.clone();
    stake_account.bump = *ctx.bumps.get("stake_account").unwrap();

    let mint_key = ctx.accounts.mint.key();

    let signers_seeds = [b"stake_token", mint_key.as_ref(), &[bump]];

    /* transfer the token from the user token account to the program's */
    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: token.clone(),               // from: token of the current owner
                to: stake_token.clone(),           // to: token of the program
                authority: backend_wallet.clone(), // the current authority, which is the user
            },
            &[&signers_seeds],
        ),
        1,
    )?;

    Ok(())
}
