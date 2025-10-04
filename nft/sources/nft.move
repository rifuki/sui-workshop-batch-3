module nft_package::nft_module {
    use sui::display;
    use sui::package;
    use sui::url::{Self, Url};
    use std::string::{Self, String};

    public struct NFT_MODULE has drop { }

    /// ==================================
    /// Structs
    /// ==================================
    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        creator: address
    }

    fun init(witness: NFT_MODULE, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"creator")
        ];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{creator}")
        ];

        let publisher = package::claim(witness, ctx);
        let mut display = display::new_with_fields<NFT>(&publisher, keys, values, ctx);
        display::update_version(&mut display);

        transfer::public_transfer(display, tx_context::sender(ctx));
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    /// ==================================
    /// Transaction functions
    /// ==================================

    /// Mint a new NFT owned by the transaction sender
    #[allow(lint(self_transfer))]
    public fun mint(
        name: String,
        description: String,
        url: String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            image_url: url::new_unsafe_from_bytes(url.into_bytes()),
            creator: tx_context::sender(ctx)
        };

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Burn an existing NFT owned by the transaction sender
    public fun burn(
        nft: NFT
    ) {
        let NFT { id, name: _, description: _, image_url: _, creator: _ } = nft;

        object::delete(id);
    }

    /// ==================================
    /// View functions
    /// ==================================
    public fun get_nft_name(nft: &NFT): String {
        nft.name
    }

    /// ==================================
    /// Testing
    /// ==================================
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(NFT_MODULE {}, ctx);
    }

}
