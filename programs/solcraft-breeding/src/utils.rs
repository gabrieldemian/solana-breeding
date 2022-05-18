use anchor_lang::prelude::Pubkey;
use uuid::Uuid;

pub fn rng(now: &u32, seed: &String, sender: &Pubkey) -> u32 {
    const V5NAMESPACE: &Uuid = &Uuid::from_bytes([
        16, 92, 30, 120, 224, 152, 10, 207, 140, 56, 246, 228, 206, 99, 196, 138,
    ]);

    let now = now.to_be_bytes();
    let seed = seed.as_bytes();
    let sender = sender.to_bytes();

    let mut vec = vec![];

    vec.extend_from_slice(&now);
    vec.extend_from_slice(&seed);
    vec.extend_from_slice(&sender);

    let result: u32 = Uuid::new_v5(V5NAMESPACE, &vec)
        .as_bytes()
        .iter()
        .map(|x| *x as u32)
        .map(|x| x * (x * 1682) - x)
        .map(|x| x * (x % 1305 + x.pow(x - 5) * 2) - x)
        .sum();

    let result: u32 = result
        .to_le_bytes()
        .iter()
        .zip(now.iter())
        .map(|(x, y)| x ^ y)
        .map(|x| x as u32)
        .sum();

    result
}
