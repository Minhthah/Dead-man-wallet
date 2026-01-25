module dead_man_wallet::inheritance {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use std::vector;

    // --- CÁC MÃ LỖI (ERRORS) ---
    const ENotLawyer: u64 = 0;
    const EWillNotApproved: u64 = 1;
    const ETimeNotReached: u64 = 2;
    const EPercentageMismatch: u64 = 3;
    const EEmptyAssets: u64 = 4;

    // --- CẤU TRÚC DI CHÚC (SỔ CÁI) ---
    // QUAN TRỌNG: Phải có chữ 'public' ở đầu struct
    public struct Will has key {
        id: UID,
        owner: address,
        lawyer: address,
        is_approved: bool,
        beneficiaries: vector<address>,
        percentages: vector<u64>,
        unlock_time: u64,
        assets: Balance<SUI>
    }

    // --- 1. TẠO DI CHÚC ---
    public entry fun create_will(
        lawyer: address,
        beneficiaries: vector<address>,
        percentages: vector<u64>,
        unlock_time: u64,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(vector::length(&beneficiaries) == vector::length(&percentages), EPercentageMismatch);

        let len = vector::length(&percentages);
        let mut i = 0;
        let mut sum = 0;
        while (i < len) {
            sum = sum + *vector::borrow(&percentages, i);
            i = i + 1;
        };
        assert!(sum == 100, EPercentageMismatch);

        let will = Will {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            lawyer: lawyer,
            is_approved: false,
            beneficiaries: beneficiaries,
            percentages: percentages,
            unlock_time: unlock_time,
            assets: coin::into_balance(payment)
        };

        transfer::share_object(will);
    }

    // --- 2. LUẬT SƯ DUYỆT ---
    public entry fun approve_will(will: &mut Will, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == will.lawyer, ENotLawyer);
        will.is_approved = true;
    }

    // --- 3. PHÂN CHIA TÀI SẢN ---
    public entry fun distribute(will: &mut Will, clock: &Clock, ctx: &mut TxContext) {
        assert!(will.is_approved, EWillNotApproved);
        assert!(sui::clock::timestamp_ms(clock) >= will.unlock_time, ETimeNotReached);

        let total_value = balance::value(&will.assets);
        assert!(total_value > 0, EEmptyAssets);

        let len = vector::length(&will.beneficiaries);
        let mut i = 0;

        while (i < len) {
            let beneficiary = *vector::borrow(&will.beneficiaries, i);
            let percent = *vector::borrow(&will.percentages, i);
            let amount = (total_value * percent) / 100;

            if (amount > 0) {
                let split_balance = balance::split(&mut will.assets, amount);
                transfer::public_transfer(coin::from_balance(split_balance, ctx), beneficiary);
            };
            i = i + 1;
        };
    }
}