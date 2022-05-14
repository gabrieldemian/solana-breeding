use anchor_lang::prelude::*;
use crate::state::{PigMachine, PREFIX_PIG, PigMachineData};

#[derive(Accounts)]
#[instruction(data: PigMachineData)]
pub struct InitializePigMachine<'info> {
    #[account(
        init,
        seeds=[PREFIX_PIG.as_bytes()],
        payer = authority,
        space =
            8  +  // discriminator
            // stake_items, * 6 = number of item for each table of item
            // * 4 number of tables of stake_items
            (( 4 + (1 + 1 + 4 + 15) * 2 ) * 6) * 4 ,
        bump,
        constraint = pig_machine.to_account_info().owner == program_id
    )]
    pub pig_machine: Account<'info, PigMachine>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}