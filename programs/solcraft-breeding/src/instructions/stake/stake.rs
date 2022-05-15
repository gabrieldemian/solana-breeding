use anchor_lang::prelude::*;
use super::Stake;

pub fn handler(ctx: Context<Stake>, bump: u8, timestamp: u64) -> Result<()> {

  let now = Clock::get().unwrap().unix_timestamp as u32;
  let end = now + (60 * 15);

  msg!("now: {}", now);
  msg!("stake_end: {}", end);
  
  let token = &ctx.accounts.token.to_account_info();
  let authority = &ctx.accounts.authority.to_account_info();
  let stake_token = &ctx.accounts.stake_token.to_account_info();
  let stake_account = &mut ctx.accounts.stake_account;

  stake_account.end = end;
  stake_account.user = authority.key.clone();
  stake_account.token = token.key.clone();
  stake_account.bump = *ctx.bumps.get("stake_account").unwrap();
  stake_account.timestamp = timestamp;

  let mint_key = ctx.accounts.mint.key();

  let signers_seeds = [
      b"stake_token",
      mint_key.as_ref(),
      &[bump]
  ];

  /* transfer the token from the user token account to the program's */
  anchor_spl::token::transfer(
      CpiContext::new_with_signer(
          ctx.accounts.token_program.to_account_info(),
          anchor_spl::token::Transfer{
              from: token.clone(), // from: token of the current owner
              to: stake_token.clone(), // to: token of the program
              authority: authority.clone(), // the current authority, which is the user
          },
          &[&signers_seeds],
      ),
      1
  )?;

  Ok(())
}