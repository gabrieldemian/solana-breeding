use anchor_lang::prelude::*;
// use anchor_lang::solana_program::program::{invoke, invoke_signed};
use crate::state::PREFIX_PIG;

use super::InitializeRunes;

pub fn handler(ctx: Context<InitializeRunes>, _bump: u8, _rune: String) -> Result<()> {
  let mint = &ctx.accounts.mint.to_account_info();
  let token = &ctx.accounts.token.to_account_info();
  let pig_machine = &ctx.accounts.pig_machine;
  let payer = &ctx.accounts.payer.to_account_info();
  let _rent = &ctx.accounts.rent;

  let signers_seeds = [
      PREFIX_PIG.as_bytes(),
      &[pig_machine.bump]
  ];

  anchor_spl::token::mint_to(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        anchor_spl::token::MintTo{
            mint: mint.clone(),
            to: token.clone(),
            authority: payer.clone()
        },
        &[&signers_seeds],
    ),
    100000000
  )?;

  Ok(())
}