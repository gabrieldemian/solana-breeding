use super::Breed;
use crate::state::PREFIX_PIG;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use metaplex_token_metadata::{instruction::create_metadata_accounts, state::Creator};

pub fn handler(ctx: Context<Breed>) -> Result<()> {
    // let metadata_account = &ctx.accounts.metadata.to_account_info();
    let pig_machine = &ctx.accounts.pig_machine;
    // let authority = &ctx.accounts.authority.to_account_info();
    // let metadata = Metadata::from_account_info(metadata_account)?;
    // let new_mint = &ctx.accounts.mint.to_account_info();
    // let token = &ctx.accounts.token.to_account_info();
    //   let _male = &ctx.accounts.male.to_account_info();
    //   let _female = &ctx.accounts.male.to_account_info();

    let authority_seeds = [PREFIX_PIG.as_bytes(), &[pig_machine.bump]];

    let creators: Vec<Creator> = vec![Creator {
        address: pig_machine.key(),
        verified: true,
        share: 100,
    }];

    let metadata_infos = vec![
        ctx.accounts.metadata.clone(),
        ctx.accounts.mint.clone(),
        ctx.accounts.authority.to_account_info().clone(),
        ctx.accounts.authority.to_account_info().clone(),
        ctx.accounts.token_metadata_program.clone(),
        ctx.accounts.token_program.to_account_info().clone(),
        ctx.accounts.system_program.to_account_info().clone(),
        ctx.accounts.rent.to_account_info().clone(),
        pig_machine.to_account_info().clone(),
    ];

    /* set the metadata of the NFT */
    invoke_signed(
      &create_metadata_accounts(
          *ctx.accounts.token_metadata_program.key,
          *ctx.accounts.metadata.key,
          *ctx.accounts.mint.key,
          *ctx.accounts.authority.key,
          *ctx.accounts.authority.key,
          pig_machine.key(),
          "Pig Child #1".to_string(),
          "PIG".to_string(),
          "https://spdda7jyig6ja6wwkgt7oz2gf4q4qgy2kqqeqmgmoxyraurv.arweave.net/k8YwfThBvJB61--lGn92dGLyHIGxpUIEgwzHXxEFI1c".to_string(),
          Some(creators),
          500, // royalties percentage in basis point 500 = 5%
          true, // update auth is signer?
          false,             // is mutable?
      ),
      metadata_infos.as_slice(),
      &[&authority_seeds],
  )?;

    /* generating the new NFT child */

    // let authority_seeds = [state::PREFIX.as_bytes(), &[pig_machine.bump]];

    // let mint_to_ix = spl_token::instruction::initialize_mint(
    //     &ctx.accounts.token_program.key(),
    //     &new_mint.key,
    //     &authority.key,
    //     Some(&authority.key),
    //     0
    // )?;

    // invoke(&mint_to_ix, &[
    //     ctx.accounts.token_program.to_account_info().clone(),
    //     new_mint.clone(),
    //     authority.clone(),
    //     ctx.accounts.rent.to_account_info().clone(),
    //     ctx.accounts.system_program.to_account_info().clone(),
    // ],
    // )?;

    // msg!("metadata owner -> {}", metadata_account.owner);
    // // msg!("owner of NFT -> {}", token.owner);
    // msg!("NFT name -> {}", metadata.data.name);
    // msg!("NFT uri -> {}", metadata.data.uri);
    // msg!("NFT metadata mint -> {}", metadata.mint);
    // match metadata.edition_nonce {
    //     Some(v) => msg!("NFT metadata edition_nonce -> {}", v),
    //     None => {}
    // }
    // msg!("NFT metadata update_authority -> {}", metadata.update_authority);
    // msg!("NFT symbol -> {}", metadata.data.symbol);

    // invoke(
    //     &spl_token::instruction::burn(
    //         &ctx.accounts.token_program.key,
    //         &ctx.accounts.token.key(),
    //         &ctx.accounts.mint.key(),
    //         &ctx.accounts.authority.key,
    //         &[&ctx.accounts.authority.key],
    //         1,
    //     )?,
    //     &[
    //         ctx.accounts.token_program.to_account_info().clone(),
    //         ctx.accounts.token.to_account_info().clone(),
    //         ctx.accounts.mint.to_account_info().clone(),
    //         ctx.accounts.authority.to_account_info().clone(),
    //     ],
    // )?;

    Ok(())
}
