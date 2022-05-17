use anchor_lang::prelude::*;
// use anchor_lang::solana_program::program::{invoke, invoke_signed};
use crate::state::PREFIX_PIG;

use super::InitializeRunes;

pub fn handler(ctx: Context<InitializeRunes>, _bump: u8, _rune: String) -> Result<()> {
  // let _mint = &ctx.accounts.mint;
  let pig_machine = &ctx.accounts.pig_machine;
  let _payer = &ctx.accounts.payer;
  let _rent = &ctx.accounts.rent;

  let _signers_seeds = [
      PREFIX_PIG.as_bytes(),
      &[pig_machine.bump]
  ];

  // anchor_spl::token::initialize_mint(
  //   CpiContext::new_with_signer(
  //     ctx.accounts.token_program.to_account_info(),
  //       anchor_spl::token::InitializeMint{
  //         mint: mint.to_account_info().clone(),
  //         rent: rent.to_account_info().clone(),
  //         },
  //         &[&signers_seeds]
  //       ),
  //       8,
  //       &pig_machine.key(),
  //       Some(&pig_machine.key()),
  // )?;

  Ok(())
}