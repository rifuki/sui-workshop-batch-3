module 0x0::counter_module {
    use sui::event;

    const E_COUNTER_VALUE_INVALID: u64 = 888; 

    public struct CounterObject has key, store { 
        id: sui::object::UID,
        value: u64
    }

    public struct CounterCreateEvent has copy, drop {
        counter_object: ID
    }

    public struct CounterChangedEvent has copy, drop {
        new_value: u64
    }

    #[allow(lint(self_transfer))]
    public fun create(ctx: &mut TxContext) {
        let counter_object = CounterObject {
            id: object::new(ctx),
            value: 0
        };

        event::emit(CounterCreateEvent {
            counter_object: object::uid_to_inner(&counter_object.id)
        });

        transfer::public_transfer(counter_object, tx_context::sender(ctx));
    }

    public fun increment(counter: &mut CounterObject) {
        counter.value = counter.value + 1;

        event::emit(CounterChangedEvent {
            new_value: counter.value
        });
    }

    public fun decrement(counter: &mut CounterObject) {
        assert!(counter.value >= 1, E_COUNTER_VALUE_INVALID);

        counter.value = counter.value - 1;

        event::emit(CounterChangedEvent {
            new_value: counter.value
        });
    }

    // === Getters ===
    public fun get_counter_value(counter: &CounterObject): u64 { counter.value }
}
