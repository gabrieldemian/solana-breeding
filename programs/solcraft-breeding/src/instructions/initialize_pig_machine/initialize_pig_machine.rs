pub use anchor_lang::prelude::*;
use crate::state::PigMachineData;
use super::InitializePigMachine;

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
