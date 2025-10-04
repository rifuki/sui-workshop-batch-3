#[test_only]
module token_package::token_module_test {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::test_scenario;
    use token_package::token_module;

    const E_MINT_AMOUNT_NOT_VALID: u64 = 9001;

    #[test]
    fun mint() {
        let user = @0xCAFE;
        
        let mut scenario = test_scenario::begin(user);
        {
            token_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<token_module::TOKEN_MODULE>>(&scenario);

            token_module::mint(&mut treasury_cap_object, 100, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin = test_scenario::take_from_sender<Coin<token_module::TOKEN_MODULE>>(&scenario);
            assert!(coin::value(&coin) == 100, E_MINT_AMOUNT_NOT_VALID);

            test_scenario::return_to_sender(&scenario, coin);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun burn() {
        let user = @0xCAFE;
        
        let mut scenario = test_scenario::begin(user);
        {
            token_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<token_module::TOKEN_MODULE>>(&scenario);

            token_module::mint(&mut treasury_cap_object, 100, test_scenario::ctx(&mut scenario));
            token_module::mint(&mut treasury_cap_object, 500, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin_object1 = test_scenario::take_from_sender<Coin<token_module::TOKEN_MODULE>>(&scenario);

            let coin_object2 = test_scenario::take_from_sender<Coin<token_module::TOKEN_MODULE>>(&scenario);
            assert!(coin::value(&coin_object1) == 500, E_MINT_AMOUNT_NOT_VALID);
            assert!(coin::value(&coin_object2) == 100, E_MINT_AMOUNT_NOT_VALID);

            test_scenario::return_to_sender(&scenario, coin_object1);
            test_scenario::return_to_sender(&scenario, coin_object2);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<token_module::TOKEN_MODULE>>(&scenario);
            let coin_object1 = test_scenario::take_from_sender<Coin<token_module::TOKEN_MODULE>>(&scenario);

            token_module::burn(&mut treasury_cap_object, coin_object1);

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin_object2 = test_scenario::take_from_sender<Coin<token_module::TOKEN_MODULE>>(&scenario);
            assert!(coin::value(&coin_object2) == 500, E_MINT_AMOUNT_NOT_VALID);

            test_scenario::return_to_sender(&scenario, coin_object2);
        };
        test_scenario::end(scenario);
    }

}
