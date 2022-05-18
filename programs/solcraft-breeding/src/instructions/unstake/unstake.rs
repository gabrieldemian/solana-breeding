use anchor_lang::prelude::*;
use crate::{utils, state::PREFIX_PIG};

use super::Unstake;

pub fn handler(ctx: Context<Unstake>, stake_token_bump: u8, mint_element_bump: u8, seed: String) -> Result<()> {

    let now = Clock::get().unwrap().unix_timestamp as u32;
    let user_token = &ctx.accounts.user_token.to_account_info();
    let stake_account = &mut ctx.accounts.stake_account;
    let payer = &mut ctx.accounts.payer.to_account_info();
    let pig_machine = &ctx.accounts.pig_machine;
    let stake_token = &ctx.accounts.stake_token.to_account_info();
  let mint_element = &mut ctx.accounts.mint_element.to_account_info();
  let token_element = &ctx.accounts.token_element.to_account_info();

  // if now < stake_account.end {
  //     return Err(ErrorCode::StakeNotReady.into());
  // }

    msg!("stake will end in: {}", stake_account.end);

    let mint_key = ctx.accounts.mint.key();

    let signers_seeds = [
        b"stake_token",
        mint_key.as_ref(),
        &[stake_token_bump]
    ];

    /* transfer the token from the user token account to the program's */
    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer{
                from: stake_token.clone(), // from: token of the current owner
                to: user_token.clone(), // to: token of the program
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

    let random_number = utils::rng(
        &now, 
        &"unstake-x4s56d7f".to_string(), 
        &payer.key()
    );

    msg!("my random number is: {}", random_number);

    let signers_seeds_pig = [
        PREFIX_PIG.as_bytes(),
        &[pig_machine.bump]
    ];

    let signers_seeds_mint = [
        seed.as_bytes(),
        &[mint_element_bump]
    ];

    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::MintTo{
                mint: mint_element.clone(),
                to: token_element.clone(),
                authority: pig_machine.to_account_info().clone()
            },
            &[&signers_seeds_pig, &signers_seeds_mint],
        ),
        1000000000 * 1
    )?;

    Ok(())
}