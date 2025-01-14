use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Storage};
use cosmwasm_storage::{singleton, singleton_read, ReadonlySingleton, Singleton};

use secret_toolkit::storage::{Keymap};


pub static CONFIG_KEY: &[u8] = b"config";

pub static ADDRESSES: Keymap<String, Vec<u8>> = Keymap::new(b"addresses");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub owner: Addr,
}

pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<State> {
    singleton_read(storage, CONFIG_KEY)
}
