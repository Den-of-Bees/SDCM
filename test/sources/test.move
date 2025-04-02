/*
/// Module: test
module test::test;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


/// Module: hello_world
module test::hello_world {
	use std::string;
	use sui::object::{Self, UID};
	use sui::transfer;
	use sui::tx_context::{Self, TxContext};

    public struct HelloWorldObject has key, store {
        id: UID,
        text: string::String
    }

    public fun mint(ctx: &mut TxContext) {
        let object = HelloWorldObject {
            id: object::new(ctx),
            text: string::utf8(b"Hello World!")
        };
        transfer::public_transfer(object, tx_context::sender(ctx));
    }
}


// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


