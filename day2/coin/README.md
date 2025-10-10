# Coin (Fungible Coin/Token) - Sui Workshop Batch 3

## 📖 Overview

Coin module adalah contoh implementasi **Fungible Coin/Token** di Sui blockchain dengan:

- ✅ **CoinMetadata** - Metadata otomatis untuk wallet & explorer
- ✅ **TreasuryCap** - Kontrol mint & burn coin
- ✅ **Decimals Support** - Presisi hingga 6 desimal

Peserta diharapkan **membangun project** dengan code dari README ini. 😃

---

## 🎯 Learning Objectives

- Implementasi coin dengan metadata otomatis menggunakan `coin::create_currency`
- TreasuryCap untuk kontrol supply coin
- Mint, burn, dan transfer coin

---

## 📋 Prerequisites

Pastikan sudah menyelesaikan **INSTALLATION.md** di root folder:

- ✅ Sui CLI terinstall
- ✅ Wallet setup & punya testnet SUI

---

# Smart Contract Coin

## Step 1: Initialize Sui Move Package

```bash
# Initialize Move package
sui move new coin_contract
cd coin
```

## Step 2: Create Move.toml

**File:** `Move.toml`

```toml
[package]
name = "coin"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move

[addresses]
coin_package = "0x0"

[dev-addresses]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/devnet" }

[dev-dependencies]
```

## Step 3: Create Coin Contract

**File:** `sources/coin.move`

```move
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
```

---

## 📚 Penjelasan Code

### One-Time Witness (OTW)

```move
public struct COIN_MODULE has drop { }
```

**Penjelasan:**

- Struct dengan nama UPPERCASE sama dengan module name
- `has drop`: Ability untuk witness pattern
- Digunakan satu kali di `init` function untuk create currency dengan `coin::create_currency`

### Init Function - Create Currency

```move
fun init(otw: COIN_MODULE, ctx: &mut TxContext)
```

**Parameters di `coin::create_currency`:**

1. **otw**: One-Time Witness (OTW) untuk claim
2. **decimals**: `6` - Coin punya 6 desimal (1.000000 = 1 coin)
3. **symbol**: `b"MORA"` - Ticker symbol (muncul di wallet)
4. **name**: `b"Mora Coin"` - Nama lengkap coin
5. **description**: `b"The currency of Teyvat."` - Deskripsi coin
6. **icon_url**: `option::some(icon_url)` - URL gambar icon coin (optional, bisa `option::none()`)
7. **ctx**: Transaction context

**Output:**

- `treasury_cap`: TreasuryCap untuk mint & burn
- `metadata`: CoinMetadata object (untuk display di wallet)

**💡 Tips:**

- Symbol biasanya 3-5 karakter uppercase
- Decimals umum: 6 (Sui native), 9 (USDC/USDT), 18 (Ethereum)
- Icon URL harus public & accessible
- Gunakan `#[allow(deprecated_usage)]` untuk `url::new_unsafe_from_bytes`
- Bytes string menggunakan prefix `b"..."` bukan `"...".to_string()`

### Mint Function

```move
public fun mint(
    treasury_cap: &mut TreasuryCap<COIN_MODULE>,
    amount: u64,
    ctx: &mut TxContext
)
```

**Penjelasan:**

- `treasury_cap`: Mutable reference - hanya owner yang bisa mint
- `amount`: Jumlah coin (dalam smallest unit, dengan decimals)
- `mint_and_transfer`: Langsung mint & transfer ke sender

### Burn Function

```move
public fun burn(
    treasury_cap: &mut TreasuryCap<COIN_MODULE>,
    coin: Coin<COIN_MODULE>,
)
```

**Penjelasan:**

- Terima coin object untuk dibakar
- Mengurangi total supply secara permanent
- Hanya treasury cap owner yang bisa burn

---

## Step 4: Create Unit Tests

**File:** `tests/coin_tests.move`

```move
#[test_only]
module coin_package::coin_module_test {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::test_scenario;
    use coin_package::coin_module;

    const E_MINT_AMOUNT_NOT_VALID: u64 = 9001;

    #[test]
    fun mint() {
        let user = @0xCAFE;

        let mut scenario = test_scenario::begin(user);
        {
            coin_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<coin_module::COIN_MODULE>>(&scenario);

            coin_module::mint(&mut treasury_cap_object, 100, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin = test_scenario::take_from_sender<Coin<coin_module::COIN_MODULE>>(&scenario);
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
            coin_module::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<coin_module::COIN_MODULE>>(&scenario);

            coin_module::mint(&mut treasury_cap_object, 100, test_scenario::ctx(&mut scenario));
            coin_module::mint(&mut treasury_cap_object, 500, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin_object1 = test_scenario::take_from_sender<Coin<coin_module::COIN_MODULE>>(&scenario);

            let coin_object2 = test_scenario::take_from_sender<Coin<coin_module::COIN_MODULE>>(&scenario);
            assert!(coin::value(&coin_object1) == 500, E_MINT_AMOUNT_NOT_VALID);
            assert!(coin::value(&coin_object2) == 100, E_MINT_AMOUNT_NOT_VALID);

            test_scenario::return_to_sender(&scenario, coin_object1);
            test_scenario::return_to_sender(&scenario, coin_object2);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut treasury_cap_object = test_scenario::take_from_sender<TreasuryCap<coin_module::COIN_MODULE>>(&scenario);
            let coin_object1 = test_scenario::take_from_sender<Coin<coin_module::COIN_MODULE>>(&scenario);

            coin_module::burn(&mut treasury_cap_object, coin_object1);

            test_scenario::return_to_sender(&scenario, treasury_cap_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let coin_object2 = test_scenario::take_from_sender<Coin<coin_module::COIN_MODULE>>(&scenario);
            assert!(coin::value(&coin_object2) == 500, E_MINT_AMOUNT_NOT_VALID);

            test_scenario::return_to_sender(&scenario, coin_object2);
        };
        test_scenario::end(scenario);
    }

}
```

---

## 📚 Penjelasan Unit Tests

### Test Structure

```move
#[test_only]
module coin_package::coin_module_test
```

**Penjelasan:**

- `#[test_only]`: Module ini hanya di-compile saat testing
- Import `Coin` dan `TreasuryCap` dari `sui::coin`

### Test 1: mint()

**Flow:**

1. Setup user `@0xCAFE`
2. Init module - mendapat TreasuryCap
3. **Take TreasuryCap** dari sender (mutable reference)
4. Mint 100 coins menggunakan TreasuryCap
5. Return TreasuryCap ke sender
6. **Take Coin** dari sender
7. Assert coin value = 100
8. Return Coin ke sender

**Key Concepts:**

- `take_from_sender<TreasuryCap<...>>`: Take treasury capability
- `take_from_sender<Coin<...>>`: Take coin object
- `coin::value(&coin)`: Check coin balance
- Mutable borrow (`&mut`) untuk TreasuryCap

### Test 2: burn()

**Flow:**

1. Setup & init module
2. Mint **2 coins**: 100 dan 500 coins
3. **Take both coins** - verify values (500 dan 100)
4. Return both coins
5. **Burn coin pertama** (500 coins)
6. Verify coin kedua masih ada (100 coins)

**Key Concepts:**

- Multiple `take_from_sender` untuk ambil multiple coins
- Burn tidak return coin object (consumed)
- Verify burn berhasil dengan checking remaining coin

**💡 Important:**

- Order coins di `take_from_sender`: Last minted = first taken (LIFO)
- coin_object1 = 500 (last minted)
- coin_object2 = 100 (first minted)

---

## Step 5: Run Tests

```bash
# Run all tests
sui move test

# Run specific test
sui move test mint

# Run with verbose output
sui move test --verbose
```

**Expected Output:**

```
Running Move unit tests
[ PASS    ] coin_package::coin_module_test::mint
[ PASS    ] coin_package::coin_module_test::burn
Test result: OK. Total tests: 2; passed: 2; failed: 0
```

---

## Step 6: Build Contract

```bash
# Build contract
sui move build
```

**Expected Output:**

```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING coin
Build Successful
```

## Step 7: Deploy to Testnet

```bash
# Deploy/Publish contract
sui client publish
```

**⚠️ PENTING - Simpan Output Ini:**

Dari output, catat:

1. **Package ID**: `0xabcd1234...`
2. **TreasuryCap Object ID**: `0x...` (type: `TreasuryCap<COIN_MODULE>`)
3. **CoinMetadata Object ID**: `0x...` (type: `CoinMetadata<COIN_MODULE>` - metadata coin)

**Copy Package ID & TreasuryCap Object ID ke notepad!**

---

## 🧪 Step 8: Test via CLI

### 8.1 View Coin Metadata

```bash
# Lihat metadata coin (CoinMetadata object)
sui client object <METADATA_OBJECT_ID>

# Atau dengan JSON format
sui client object <METADATA_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**

```json
{
  "decimals": 6,
  "description": "The currency of Teyvat.",
  "icon_url": "https://static.wikia.nocookie.net/gensin-impact/images/8/84/Item_Mora.png/...",
  "name": "Mora Coin",
  "symbol": "MORA"
}
```

### 8.2 Mint Coins

Mari mint beberapa kali untuk testing:

```bash
# Mint pertama - 100 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 100

# Mint kedua - 200 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 200

# Mint ketiga - 300 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 300
```

**Simpan Coin Object IDs dari setiap output!**

### 8.3 Check Your Coin Balance

```bash
# Lihat semua coins di wallet
sui client balance

# Lihat semua objects (termasuk coins)
sui client objects
```

### 8.4 View Coin Details

```bash
# Lihat details coin object
sui client object <COIN_OBJECT_ID>

# Dengan JSON format
sui client object <COIN_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**

```json
{
  "balance": "700",
  "id": { "id": "0x..." }
}
```

### 8.5 Burn Coins

```bash
# Burn/Destroy coin (permanent!)
# Burn coin pertama (100 coins)
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function burn \
  --args <TREASURY_CAP_OBJECT_ID> <COIN_OBJECT_ID>
```

⚠️ **Warning:** Burning permanent! Coin tidak bisa di-recover & total supply berkurang.

**Verify:** Setelah burn, cek balance - seharusnya coin 100 coins sudah hilang.

### 8.6 Split Coins

```bash
# Split coin 300 coins - ambil 150 coins
sui client split-coin \
  --coin-id <COIN_300_COINS_ID> \
  --amounts 150

# Sekarang Anda punya:
# - Original coin: 150 coins (sisa)
# - New coin: 150 coins (hasil split)
```

### 8.7 Merge Coins

```bash
# Gabungkan coin 200 coins + coin 150 coins (hasil split)
sui client merge-coin \
  --primary-coin <COIN_200_COINS_ID> \
  --coin-to-merge <COIN_150_COINS_ID>

# Hasilnya:
# - Primary coin: 350 coins (200 + 150)
# - Coin yang di-merge: hilang (deleted)
```

### 8.8 Transfer Coins

```bash
# Transfer coin ke address lain
sui client transfer \
  --object-id <COIN_OBJECT_ID> \
  --to <RECIPIENT_ADDRESS>
```

**Contoh recipient address:** Second wallet / teman di sebelah!

**Note:** Transfer akan mengirim seluruh coin object.

### 8.9 View di Explorer

1. Buka https://suiscan.xyz/testnet
2. Paste **Coin Object ID** atau **Package ID**
3. Lihat:
   - Coin metadata (symbol, name, decimals, icon)
   - Total supply
   - Transfer history
   - Holders (jika sudah ditransfer ke banyak address)

---

## ✅ Coin Contract Checklist

- [x] Build successful
- [x] Deploy successful & dapat Package ID
- [x] Mint coins via CLI
- [x] View coin metadata
- [x] Check balance di wallet
- [x] Split coins
- [x] Merge coins
- [x] Transfer coins ke address lain
- [x] Burn coins
- [x] Coin metadata terlihat di Explorer

---

# 🔧 Troubleshooting

### Error: "Invalid TreasuryCap"

- **Solusi**: Pastikan gunakan TreasuryCap Object ID yang benar
- Verify dengan: `sui client object <TREASURY_CAP_ID>`
- Type harus: `TreasuryCap<PACKAGE_ID::coin_module::COIN_MODULE>`

### Error: "Arithmetic error, overflow"

- **Solusi**: Amount terlalu besar
- Max u64: `18,446,744,073,709,551,615`
- Dengan 6 decimals = max ~18 triliun coins

### Coin tidak muncul di wallet

- **Solusi**:
  - Tunggu 10-20 detik (indexing delay)
  - Refresh wallet
  - Pastikan CoinMetadata object sudah di-create saat deploy
  - Check di CLI: `sui client objects`

### Error saat split/merge

- **Solusi**:
  - Pastikan amount split ≤ balance coin
  - Pastikan kedua coins adalah type yang sama
  - Verify type args sama dengan deployed package

### Balance tidak update setelah mint

- **Solusi**:
  - Check apakah mint berhasil: `sui client object <COIN_OBJECT_ID>`
  - Pastikan address tujuan benar
  - Refresh wallet & tunggu indexing

---

# 💡 Concepts Learned

## Sui Move Concepts

- ✅ **Fungible Coin** - Coin yang dapat ditukar 1:1
- ✅ **CoinMetadata** - Metadata otomatis untuk display di wallet
- ✅ **TreasuryCap** - Capability untuk mint & burn
- ✅ **Decimals** - Presisi coin (6, 9, atau 18)
- ✅ **Merge/Split** - Coin operations yang unik di Sui
- ✅ **One-Time Witness (OTW)** - Init pattern untuk create currency

## Coin Operations

| Operation    | Fungsi                     | Membutuhkan           |
| ------------ | -------------------------- | --------------------- |
| **Mint**     | Create coin baru           | TreasuryCap           |
| **Burn**     | Destroy coin               | TreasuryCap + Coin    |
| **Transfer** | Kirim coin ke address lain | Coin ownership        |
| **Split**    | Pecah 1 coin jadi 2        | Coin ownership        |
| **Merge**    | Gabung 2 coin jadi 1       | Ownership kedua coins |

# 🎨 Challenge (Opsional)

### Level 1: Basic

1. Ubah symbol & name coin sesuai kreasi Anda
2. Mint 1000 coins ke wallet Anda
3. Split menjadi 2 coins (500 + 500)
4. Transfer salah satu ke teman

### Level 2: Intermediate

5. Buat icon coin sendiri (upload ke Imgur/Pinata)
6. Mint dengan berbagai amount (1, 10, 100, 1000)
7. Praktik merge 3+ coins jadi 1
8. View total supply di explorer

### Level 3: Advanced

9. Tambah fungsi `transfer_custom` dengan amount parameter
10. Implementasi `airdrop` function untuk batch transfer
11. Tambah access control - hanya address tertentu bisa mint
12. Implementasi max supply cap (tidak bisa mint lebih dari X)

---

# 🎯 Real-World Use Cases

1. **DeFi Coins** - Governance coin untuk DAO
2. **Stablecoins** - USDC, USDT equivalents
3. **Reward Points** - Loyalty program dengan coin
4. **In-Game Currency** - Gold, gems, credits dalam game
5. **Utility Coins** - Access ke platform/service
6. **Wrapped Assets** - Wrapped Bitcoin, Wrapped ETH

---

# 📚 Resources

- **Sui Coin Standard**: https://docs.sui.io/standards/coin
- **Coin Module Docs**: https://docs.sui.io/references/framework/sui-framework/coin
- **Explorer**: https://suiscan.xyz/testnet
- **Icon Upload**: https://imgur.com, https://pinata.cloud

---

# 🔄 NFT vs Coin Comparison

Setelah mempelajari NFT dan Coin, berikut perbedaan praktisnya:

| Aspek            | NFT                                  | Coin                              |
| ---------------- | ------------------------------------ | --------------------------------- |
| **Fungibility**  | Non-fungible (setiap NFT berbeda)    | Fungible (dapat ditukar 1:1)      |
| **Metadata**     | Rich (name, image, description, etc) | Simple (symbol, decimals, icon)   |
| **Transfer**     | Transfer object langsung             | Transfer, merge, split operations |
| **Use Case**     | Art, collectibles, tickets           | Currency, governance, payment     |
| **Object Model** | Standalone object dengan UID         | Coin object dengan balance & UID  |
| **Minting**      | Biasanya 1 per call                  | Bisa mint amount besar per call   |

---

**Selamat! Anda sudah berhasil membuat Coin di Sui! 🎉**
