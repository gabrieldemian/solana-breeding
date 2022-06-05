use crate::error::ErrorCode;
use crate::state::StakeAccountData;

use super::AfterStake;
use anchor_lang::prelude::*;

pub fn handler(
    ctx: Context<AfterStake>,
    data: StakeAccountData,
    stake_interval: u32,
) -> Result<()> {
    let now = Clock::get().unwrap().unix_timestamp as u32;
    let token = &ctx.accounts.token.to_account_info();
    let user = &ctx.accounts.user.to_account_info();
    let mint = &ctx.accounts.mint.to_account_info();
    let stake_account = &mut ctx.accounts.stake_account;
    let stake_interval_account = &mut ctx.accounts.stake_interval_account;

    if now <= stake_interval_account.stake_interval {
        return Err(ErrorCode::IntervalNotOver.into());
    }

    stake_interval_account.stake_interval = stake_interval;

    stake_account.user = user.key.clone();
    stake_account.data.time_to_end_foraging = data.time_to_end_foraging;
    stake_account.data.time_foraging_started = now;
    stake_account.token = token.key.clone();
    stake_account.mint = mint.key.clone();
    stake_account.bump = *ctx.bumps.get("stake_account").unwrap();

    Ok(())
}
