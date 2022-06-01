use anchor_lang::prelude::*;

use super::InitializeRunes;

pub fn handler(ctx: Context<InitializeRunes>) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let token = &ctx.accounts.token.to_account_info();
    let payer = &ctx.accounts.payer.to_account_info();

    anchor_spl::token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::MintTo {
                mint: mint.clone(),
                to: token.clone(),
                authority: payer.clone(),
            },
        ),
        1000000000 * 50000,
    )?;

    Ok(())
}
