use super::InitializePigMachine;
use crate::state::PigMachineData;
pub use anchor_lang::prelude::*;

pub fn handler(ctx: Context<InitializePigMachine>, data: PigMachineData) -> Result<()> {
    let pig_machine = &mut ctx.accounts.pig_machine;

    msg!("pubkey {}", pig_machine.key());

    pig_machine.data = data;
    pig_machine.authority = *ctx.accounts.authority.key;
    pig_machine.bump = *ctx.bumps.get("pig_machine").unwrap();

    Ok(())
}
