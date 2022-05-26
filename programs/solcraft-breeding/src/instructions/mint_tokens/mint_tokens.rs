use crate::state::PREFIX_PIG;
use anchor_lang::prelude::*;

use super::MintTokens;

pub fn handler(
    ctx: Context<MintTokens>,
    _bump_token: u8,
    bump_mint: u8,
    seed: String,
    quantity: u64,
) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let token = &ctx.accounts.token.to_account_info();
    let pig_machine = &ctx.accounts.pig_machine;

    let signers_seeds_pig = [PREFIX_PIG.as_bytes(), &[pig_machine.bump]];

    let signers_seeds_mint = [seed.as_bytes(), &[bump_mint]];

    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::MintTo {
                mint: mint.clone(),
                to: token.clone(),
                authority: pig_machine.to_account_info().clone(),
            },
            &[&signers_seeds_pig, &signers_seeds_mint],
        ),
        1000000000 * quantity,
    )?;

    Ok(())
}
