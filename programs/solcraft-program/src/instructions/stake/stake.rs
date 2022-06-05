use super::Stake;
use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

pub fn handler(ctx: Context<Stake>) -> Result<()> {
    let token = &ctx.accounts.token.to_account_info();
    let user = &ctx.accounts.user.to_account_info();
    let stake_token = &ctx.accounts.stake_token.to_account_info();
    let backend_wallet = &ctx.accounts.backend_wallet.to_account_info();

    let mint_key = ctx.accounts.mint.key();

    let signers_seeds = [
        b"stake_token",
        mint_key.as_ref(),
        &[*ctx.bumps.get("stake_token").unwrap()],
    ];

    /* transfer the token from the user token account to the program's */
    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: token.clone(),     // from: token of the current owner
                to: stake_token.clone(), // to: token of the program
                authority: user.clone(), // the current authority, which is the user
            },
            &[&signers_seeds],
        ),
        1,
    )?;

    /* pay fee to the backend wallet */
    invoke(
        &system_instruction::transfer(user.key, backend_wallet.key, 69000000),
        &[
            user.to_account_info(),
            backend_wallet.to_account_info(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    Ok(())
}
