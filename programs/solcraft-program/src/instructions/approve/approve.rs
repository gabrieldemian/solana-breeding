use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

use super::Approve;

pub fn handler(ctx: Context<Approve>) -> Result<()> {
    let user = &ctx.accounts.user;
    let backend_wallet = &ctx.accounts.backend_wallet;
    let token = &ctx.accounts.token;

    /* pay fee to the backend wallet */
    invoke(
        &system_instruction::transfer(user.key, backend_wallet.key, 6900000),
        &[
            user.to_account_info(),
            backend_wallet.to_account_info(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    /* borrow the NFT of the user to the backend wallet */
    anchor_spl::token::approve(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Approve {
                to: token.to_account_info().clone(),
                delegate: backend_wallet.clone(),
                authority: user.to_account_info().clone(),
            },
        ),
        1,
    )?;

    Ok(())
}
