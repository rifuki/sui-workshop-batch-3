module coin_package::coin_module;

use sui::{coin::{Self, Coin, TreasuryCap}, url};

public struct COIN_MODULE has drop { }

#[allow(deprecated_usage)]
fun init(otw: COIN_MODULE, ctx: &mut TxContext) {
    let icon_url = url::new_unsafe_from_bytes(b"https://static.wikia.nocookie.net/gensin-impact/images/8/84/Item_Mora.png/revision/latest?cb=20210106073715");

    let (treasury_cap, metadata) = coin::create_currency(
        otw,
        6,
        b"MORA",
        b"Mora Coin",
        b"The currency of Teyvat.",
        option::some(icon_url),
        ctx
    );

    transfer::public_transfer(metadata, ctx.sender());
    transfer::public_transfer(treasury_cap, ctx.sender());
}


public fun mint(
    treasury_cap: &mut TreasuryCap<COIN_MODULE>,
    amount: u64,
    ctx: &mut TxContext
) {
    coin::mint_and_transfer(treasury_cap, amount, ctx.sender(), ctx);
}


 public fun burn(
    treasury_cap: &mut TreasuryCap<COIN_MODULE>,
    coin: Coin<COIN_MODULE>,
) {
    coin::burn(treasury_cap, coin);
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(COIN_MODULE {}, ctx)
}
