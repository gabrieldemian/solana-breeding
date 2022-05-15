use anchor_lang::prelude::*;
use super::Unstake;

pub fn handler(ctx: Context<Unstake>, bump: u8) -> Result<()> {

  let _now = Clock::get().unwrap().unix_timestamp as u32;
  let token = &ctx.accounts.token.to_account_info();
  let stake_account = &mut ctx.accounts.stake_account;
  let payer = &mut ctx.accounts.payer.to_account_info();
  let stake_token = &ctx.accounts.stake_token.to_account_info();

  // if now < stake_account.end {
  //     return Err(ErrorCode::StakeNotReady.into());
  // }

  msg!("stake will end in: {}", stake_account.end);

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
                from: stake_token.clone(), // from: token of the current owner
                to: token.clone(), // to: token of the program
                authority: stake_token.clone(), // the current authority, which is the user
            },
            &[&signers_seeds],
        ),
        1
    )?;

    ctx.accounts.stake_token.reload()?;

    /* closes the stake_token account */
    /* and send the account's SOL to the caller */
    anchor_spl::token::close_account(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        anchor_spl::token::CloseAccount {
            account: stake_token.to_account_info(),
            destination: payer.clone(),
            authority: stake_token.to_account_info(),
        },
        &[&signers_seeds],
    ))?;

    let stake_account_balance = stake_account.to_account_info().try_lamports()?;

    /* send the SOL to the payer and erase the data of stake_account */
    **stake_account.to_account_info().try_borrow_mut_lamports()? -= stake_account_balance;
    **payer.to_account_info().try_borrow_mut_lamports()? += stake_account_balance;
    stake_account.to_account_info().try_borrow_mut_data()?.fill(0);

  Ok(())
}