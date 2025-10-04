module token_package::token_module {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::coin_registry;

    public struct TOKEN_MODULE has drop { }

    fun init(witness: TOKEN_MODULE, ctx: &mut TxContext) {
        let (builder, treasury_cap) = coin_registry::new_currency_with_otw(
            witness,
            6,
            b"SWB3".to_string(),
            b"Sui Workshop Batch 3".to_string(),
            b"This is example token creation for demo sui workshop batch 3".to_string(),
            b"https://strapi-dev.scand.app/uploads/sui_c07df05f00.png".to_string(),
            ctx
        );

        let metadata_cap = builder.finalize(ctx);

        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::public_transfer(metadata_cap, tx_context::sender(ctx));
    }

    public fun mint(
        treasury_cap: &mut TreasuryCap<TOKEN_MODULE>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        treasury_cap.mint_and_transfer(amount, ctx.sender(), ctx);
    }

    public fun burn(
        treasury_cap: &mut TreasuryCap<TOKEN_MODULE>,
        token: Coin<TOKEN_MODULE>,
    ) {
        coin::burn(treasury_cap, token);
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(TOKEN_MODULE {}, ctx)
    }
}
