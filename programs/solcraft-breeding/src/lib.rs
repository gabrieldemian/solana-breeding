use {
    crate::{
        error::ErrorCode,
        state::{CandyMachineData, PigMachineData, StakeData}
    },
    anchor_lang::prelude::*,
    context::*
};
pub mod context;
pub mod error;
pub mod state;
pub mod utils;

declare_id!("F4FfKsLLJjNR8WB6wpGufabkZFG6McptNuewPFSfKQM1");

#[program]
pub mod solcraft_breeding {

    use super::*;
    use metaplex_token_metadata::{instruction::{create_metadata_accounts, update_metadata_accounts}, state::{Creator}};
    use anchor_lang::solana_program::{program::{invoke_signed, invoke}, system_instruction};

    pub fn mint_nft(ctx: Context<MintNFT>, nft_name: String, nft_uri: String) -> Result<()> {

        let candy_machine = &mut ctx.accounts.candy_machine;
        let now = Clock::get()?.unix_timestamp;

        if let Some(go_live_date) = candy_machine.data.go_live_date {
            /* only the authority can mint before the launch date */
            if now < go_live_date && *ctx.accounts.mint_authority.key != candy_machine.authority {
                return Err(ErrorCode::CandyMachineNotLiveYet.into());
            }
        }

        /* check if the payer (mint_authority) has enough SOL to pay the mint cost */
        if ctx.accounts.mint_authority.lamports() < candy_machine.data.price {
            return Err(ErrorCode::NotEnoughSOL.into());
        }

        /* check if the collection still has NFTs to mint */
        if let Some(max_supply) = candy_machine.data.max_supply {
            if candy_machine.data.nfts_minted >= max_supply {
                return Err(ErrorCode::CandyMachineEmpty.into());
            }
        }

        /* pay fees - transfer SOL from the buyer to the authority account */
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.mint_authority.key,
                ctx.accounts.authority.key,
                candy_machine.data.price,
            ),
            &[
                ctx.accounts.mint_authority.to_account_info().clone(),
                ctx.accounts.authority.clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        /* increment the counter of total mints by 1 */
        candy_machine.data.nfts_minted += 1;

        let authority_seeds = [state::PREFIX_CANDY.as_bytes(), &[candy_machine.bump]];

        let mut creators: Vec<Creator> = vec![Creator {
            address: candy_machine.key(),
            verified: true,
            share: 0,
        }];

        /* add the creators that will receive royalties from secondary sales */
        for c in &candy_machine.data.creators {
            creators.push(Creator {
                address: c.address,
                verified: false,
                share: c.share,
            });
        }

        let metadata_infos = vec![
            ctx.accounts.metadata.clone(),
            ctx.accounts.mint.clone(),
            ctx.accounts.mint_authority.to_account_info().clone(),
            ctx.accounts.mint_authority.to_account_info().clone(),
            ctx.accounts.token_metadata_program.clone(),
            ctx.accounts.token_program.to_account_info().clone(),
            ctx.accounts.system_program.to_account_info().clone(),
            ctx.accounts.rent.to_account_info().clone(),
            candy_machine.to_account_info().clone(),
        ];

        /* set the metadata of the NFT */
        invoke_signed(
            &create_metadata_accounts(
                *ctx.accounts.token_metadata_program.key,
                *ctx.accounts.metadata.key,
                *ctx.accounts.mint.key,
                *ctx.accounts.mint_authority.key,
                *ctx.accounts.mint_authority.key,
                candy_machine.key(),
                nft_name,
                candy_machine.data.symbol.to_string(),
                nft_uri,
                Some(creators),
                candy_machine.data.seller_fee_basis_points, // royalties percentage in basis point 500 = 5%
                true,             // update auth is signer?
                false,                         // is mutable?
            ),
            metadata_infos.as_slice(),
            &[&authority_seeds],
        )?;

        /* at this point the NFT is already minted with the metadata */
        /* this invoke call will disable more mints to the account */
        invoke(
            &spl_token::instruction::set_authority(
                &ctx.accounts.token_program.key(),
                &ctx.accounts.mint.key(),
                None,
                spl_token::instruction::AuthorityType::MintTokens,
                &ctx.accounts.mint_authority.key(),
                &[&ctx.accounts.mint_authority.key()],
            )?,
            &[
                ctx.accounts.mint_authority.to_account_info().clone(),
                ctx.accounts.mint.clone(),
                ctx.accounts.token_program.to_account_info().clone(),
            ],
        )?;

        /* denote that the primary sale has happened */
        /* and disable future updates to the NFT, so it is truly immutable */
        invoke_signed(
            &update_metadata_accounts(
                *ctx.accounts.token_metadata_program.key,
                *ctx.accounts.metadata.key,
                candy_machine.key(),
                None,
                None,
                Some(true),
            ),
            &[
                ctx.accounts.token_metadata_program.clone(),
                ctx.accounts.metadata.clone(),
                candy_machine.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
            &[&authority_seeds],
        )?;

        Ok(())
    }

    pub fn breed(ctx: Context<Breed>) -> Result<()> {

        // let metadata_account = &ctx.accounts.metadata.to_account_info();
        let candy_machine = &ctx.accounts.candy_machine;
        // let authority = &ctx.accounts.authority.to_account_info();
        // let metadata = Metadata::from_account_info(metadata_account)?;
        // let new_mint = &ctx.accounts.mint.to_account_info();
        // let token = &ctx.accounts.token.to_account_info();
        let _male = &ctx.accounts.male.to_account_info();
        let _female = &ctx.accounts.male.to_account_info();

        let authority_seeds = [state::PREFIX_CANDY.as_bytes(), &[candy_machine.bump]];

        let mut creators: Vec<Creator> = vec![Creator {
            address: candy_machine.key(),
            verified: true,
            share: 0,
        }];

        /* add the creators that will receive royalties from secondary sales */
        for c in &candy_machine.data.creators {
            creators.push(Creator {
                address: c.address,
                verified: false,
                share: c.share,
            });
        }

        let metadata_infos = vec![
            ctx.accounts.metadata.clone(),
            ctx.accounts.mint.clone(),
            ctx.accounts.authority.to_account_info().clone(),
            ctx.accounts.authority.to_account_info().clone(),
            ctx.accounts.token_metadata_program.clone(),
            ctx.accounts.token_program.to_account_info().clone(),
            ctx.accounts.system_program.to_account_info().clone(),
            ctx.accounts.rent.to_account_info().clone(),
            candy_machine.to_account_info().clone(),
        ];

        /* set the metadata of the NFT */
        invoke_signed(
            &create_metadata_accounts(
                *ctx.accounts.token_metadata_program.key,
                *ctx.accounts.metadata.key,
                *ctx.accounts.mint.key,
                *ctx.accounts.authority.key,
                *ctx.accounts.authority.key,
                candy_machine.key(),
                "Pig Child #1".to_string(),
                candy_machine.data.symbol.to_string(),
                "https://gateway.pinata.cloud/ipfs/QmVtfXP8LWCm1pvmznJ4tige28Tm3FMmA81KfsVm31k8ES".to_string(),
                Some(creators),
                candy_machine.data.seller_fee_basis_points, // royalties percentage in basis point 500 = 5%
                true,             // update auth is signer?
                false,                         // is mutable?
            ),
            metadata_infos.as_slice(),
            &[&authority_seeds],
        )?;
        
        // require!(
        //     metadata.update_authority.key() == candy_machine.key(),
        //     ErrorCode::CandyMachineWrongAddress
        // );
        
        /* generating the new NFT child */

        // let authority_seeds = [state::PREFIX.as_bytes(), &[candy_machine.bump]];

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

    pub fn initialize_candy_machine(
        ctx: Context<InitializeCandyMachine>,
        data: CandyMachineData,
    ) -> Result<()> {

        let candy_machine = &mut ctx.accounts.candy_machine;

        msg!("pubkey {}", candy_machine.key());

        candy_machine.data = data;
        candy_machine.authority = *ctx.accounts.authority.key;
        candy_machine.bump = *ctx.bumps.get("candy_machine").unwrap();

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {

        let _now = Clock::get().unwrap().unix_timestamp as u32;
        let mint = &ctx.accounts.mint;
        let token = &ctx.accounts.token.to_account_info();
        let authority = &ctx.accounts.authority.to_account_info();
        let pig_machine = &ctx.accounts.pig_machine;
        let token_program = &ctx.accounts.token_program.to_account_info();
        let destination = &ctx.accounts.destination.to_account_info();

        let account_infos = vec![
            token_program.clone(),
            authority.clone(),
            mint.clone(),
            token.clone(),
            pig_machine.to_account_info().clone(),
            destination.clone(),
        ];

        let signers_seeds = [
            state::PREFIX_PIG.as_bytes(),
            &[pig_machine.bump]
        ];

        invoke_signed(
            &spl_token::instruction::transfer_checked(
                &token_program.key(),
                token.key, // token of the current owner
                mint.key,
                destination.key, // token (ATA) of the receiver
                authority.key, // the current owner
                &[authority.key],
                1,
                0
            )?,
            account_infos.as_slice(),
            &[&signers_seeds],
        )?;

        Ok(())
    }

    pub fn stake(
        ctx: Context<Stake>,
        data: StakeData,
    ) -> Result<()> {

        let now = Clock::get().unwrap().unix_timestamp as u32;
        msg!("days to stake: {}", data.duration);
        msg!("now timestamp: {}", now);

        let mint = &ctx.accounts.mint;
        let token = &ctx.accounts.token.to_account_info();
        let authority = &ctx.accounts.authority.to_account_info();
        // let _pig_machine = &ctx.accounts.pig_machine.to_account_info();
        let token_program = &ctx.accounts.token_program.to_account_info();
        let destination = &ctx.accounts.destination.to_account_info();

        let account_infos = vec![
            token_program.clone(),
            authority.clone(),
            mint.clone(),
            token.clone(),
            destination.clone(),
        ];

        invoke(
            &spl_token::instruction::transfer_checked(
                &token_program.key(),
                token.key, // token of the current owner
                mint.key,
                destination.key, // token (ATA) of the receiver
                authority.key, // the current owner
                &[authority.key],
                1,
                0
            )?,
            account_infos.as_slice()
        )?;

        Ok(())
    }

    pub fn update_candy_machine(
        ctx: Context<UpdateCandyMachine>,
        price: Option<u64>,
        go_live_date: Option<i64>,
    ) -> Result<()> {

        let candy_machine = &mut ctx.accounts.candy_machine;

        if let Some(p) = price {
            msg!("Price changed from {}", candy_machine.data.price);
            msg!("Price changed to {}", p);
            candy_machine.data.price = p;
        };

        if let Some(go_l) = go_live_date {
            msg!("Go live date from {:#?}", candy_machine.data.go_live_date);
            msg!("Go live date changed to {}", go_l);
            candy_machine.data.go_live_date = Some(go_l);
        };

        Ok(())
    }

    pub fn initialize_pig_machine(
        ctx: Context<InitializePigMachine>,
        data: PigMachineData,
    ) -> Result<()> {

        let pig_machine = &mut ctx.accounts.pig_machine;

        msg!("pubkey {}", pig_machine.key());

        pig_machine.data = data;
        pig_machine.authority = *ctx.accounts.authority.key;
        pig_machine.bump = *ctx.bumps.get("pig_machine").unwrap();

        Ok(())
    }
}
