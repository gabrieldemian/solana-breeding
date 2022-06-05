## Solcraft program

Program (smart contract) of Solcraft, features:

- Stake Battle Pig, and pay fees
- Unstake Battle Pig
- Mint tokens
- Create tokes
- Breed (in development)

## My architecture

├─ src <br />
│ &emsp; ├─ instructions/ -> contains all the intructions of the program <br />
│ &emsp; ├─ error.rs -> error structs <br />
│ &emsp; ├─ lib.rs -> my entrypoint <br />
│ &emsp; ├─ state.rs -> state structs <br />
│ &emsp; ├─ context.rs -> structs used on instructions arguments <br />
│ &emsp; ├─ utils.rs -> helpers functions <br />

## How to use

- Change the cluster and wallet you want to run on `Anchor.toml`
- Run `yarn` `anchor build` and `anchor deploy` to install the dependencies and build the program.

## Testing

Open the package.json file to see all the available tests, e.g:

- `yarn test-stake` will try to test a stake
