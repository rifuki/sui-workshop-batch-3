#[test_only]
module nft_package::nft_module_tests {
    use std::string;
    use sui::test_scenario;

    use nft_package::nft_module;

    const E_NFT_NAME_NOT_VALID: u64 = 1001;
    const E_NFT_STILL_EXISTS: u64 = 1002;

    #[test]
    fun test_mint_nft() {
        let user = @0xFACE;

        let mut scenario = test_scenario::begin(user);
        {
            nft_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            nft_module::mint(
                string::utf8(b"NFT Test Name"),
                string::utf8(b"NFT Test Description"),
                string::utf8(b"https://example.com/image.jpeg"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let nft_object = test_scenario::take_from_sender<nft_module::NFT>(&scenario);
            assert!(nft_module::get_nft_name(&nft_object) == string::utf8(b"NFT Test Name"), E_NFT_NAME_NOT_VALID);

            test_scenario::return_to_sender(&scenario, nft_object);
        };

        test_scenario::end(scenario);
    }


    #[test]
    fun test_burn_nft() {
        let user = @0xFACE;

        let mut scenario = test_scenario::begin(user);
        {
            nft_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            nft_module::mint(
                string::utf8(b"NFT Test Name"),
                string::utf8(b"NFT Test Description"),
                string::utf8(b"https://example.com/image.jpeg"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let nft_object = test_scenario::take_from_sender<nft_module::NFT>(&scenario);
            assert!(nft_module::get_nft_name(&nft_object) == string::utf8(b"NFT Test Name"), E_NFT_NAME_NOT_VALID);

            test_scenario::return_to_sender(&scenario, nft_object);
        };
        
        // Burn the NFT
        test_scenario::next_tx(&mut scenario, user);
        {
            let nft_object = test_scenario::take_from_sender<nft_module::NFT>(&scenario);
            nft_module::burn(nft_object);
        };
        // Ensure the NFT is burned
        test_scenario::next_tx(&mut scenario, user);
        {
            assert!(!test_scenario::has_most_recent_for_sender<nft_module::NFT>(&scenario), E_NFT_STILL_EXISTS);
        };

        test_scenario::end(scenario);
    }

}
