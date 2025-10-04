#[test_only]
module counter_package::counter_tests_module {
    use sui::test_scenario;

    use counter_package::counter_module;

    const E_COUNTER_INIT_VALUE_NOT_VALID: u64 = 90001;
    const E_COUNTER_INCREMENT_VALUE_NOT_VALID: u64 = 90002;
    const E_COUNTER_DECREMENT_VALUE_NOT_VALID: u64 = 90003;

    #[test]
    fun create_counter() {
        let user = @0xBEEF;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun increment_counter() {
        let user = @0xDEAD;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
           counter_module::create(scenario.ctx());
        };
        
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            counter_module::increment(&mut counter_object);
            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 1, E_COUNTER_INCREMENT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun decrement_counter() {
        let user = @0xDEAF;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            // Increment 3 times
            counter_module::increment(&mut counter_object);
            counter_module::increment(&mut counter_object);
            counter_module::increment(&mut counter_object);
            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 3, E_COUNTER_INCREMENT_VALUE_NOT_VALID);

            counter_module::decrement(&mut counter_object);
            
            test_scenario::return_to_sender(&scenario, counter_object);
        };
        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 2, E_COUNTER_DECREMENT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::end(scenario);
    }
}
