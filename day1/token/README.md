# Token (Fungible Token/Coin) - Sui Workshop Batch 3

## 📖 Overview

Token module adalah contoh implementasi **Fungible Token** (Coin) di Sui blockchain dengan:
- ✅ **Coin Registry** - Metadata otomatis untuk wallet & explorer
- ✅ **TreasuryCap** - Kontrol mint & burn token
- ✅ **Decimals Support** - Presisi hingga 6 desimal

Peserta diharapkan **membangun project** dengan code dari README ini. 😃

---

## 🎯 Learning Objectives

- Implementasi Coin Registry untuk metadata otomatis
- TreasuryCap untuk kontrol supply token
- Mint, burn, dan transfer token

---

## 📋 Prerequisites

Pastikan sudah menyelesaikan **INSTALLATION.md** di root folder:
- ✅ Sui CLI terinstall
- ✅ Wallet setup & punya testnet SUI

---

# Smart Contract Token

## Step 2: Initialize Sui Move Package

```bash
# Initialize Move package
sui move new token
cd token
```

## Step 3: Create Move.toml

**File:** `Move.toml`

```toml
[package]
name = "token"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move

[addresses]
token_package = "0x0"

[dev-addresses]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[dev-dependencies]
```

## Step 4: Create Token Contract

**File:** `sources/token.move`

```move
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
```

---

## 📚 Penjelasan Code

### One-Time Witness (OTW)

```move
public struct TOKEN_MODULE has drop { }
```

**Penjelasan:**
- Struct dengan nama UPPERCASE sama dengan module name
- `has drop`: Ability untuk witness pattern
- Digunakan satu kali di `init` function untuk claim Publisher

### Init Function - Coin Registry

```move
fun init(witness: TOKEN_MODULE, ctx: &mut TxContext)
```

**Parameters di `new_currency_with_otw`:**
1. **witness**: One-Time Witness untuk claim Publisher
2. **decimals**: `6` - Token punya 6 desimal (1.000000 = 1 token)
3. **symbol**: `"SWB3"` - Ticker symbol (muncul di wallet)
4. **name**: `"Sui Workshop Batch 3"` - Nama lengkap token
5. **description**: Deskripsi token
6. **icon_url**: URL gambar icon token (optional)

**Output:**
- `builder`: Untuk finalize metadata
- `treasury_cap`: Capability untuk mint & burn
- `metadata_cap`: Capability untuk update metadata (opsional)

**💡 Tips:**
- Symbol biasanya 3-5 karakter uppercase
- Decimals umum: 6 (Sui native), 9 (USDC/USDT), 18 (Ethereum)
- Icon URL harus public & accessible

### Mint Function

```move
public fun mint(
    treasury_cap: &mut TreasuryCap<TOKEN_MODULE>,
    amount: u64,
    ctx: &mut TxContext
)
```

**Penjelasan:**
- `treasury_cap`: Mutable reference - hanya owner yang bisa mint
- `amount`: Jumlah token (dalam smallest unit, dengan decimals)
- `mint_and_transfer`: Langsung mint & transfer ke sender

### Burn Function

```move
public fun burn(
    treasury_cap: &mut TreasuryCap<TOKEN_MODULE>,
    token: Coin<TOKEN_MODULE>,
)
```

**Penjelasan:**
- Terima coin object untuk dibakar
- Mengurangi total supply secara permanent
- Hanya treasury cap owner yang bisa burn

---

## Step 4: Create Unit Tests

**File:** `tests/token_tests.move`

```move
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
```

---

## 📚 Penjelasan Unit Tests

### Test Structure

```move
#[test_only]
module token_package::token_module_test
```

**Penjelasan:**
- `#[test_only]`: Module ini hanya di-compile saat testing
- Import `Coin` dan `TreasuryCap` dari `sui::coin`

### Test 1: mint()

**Flow:**
1. Setup user `@0xCAFE`
2. Init module - mendapat TreasuryCap
3. **Take TreasuryCap** dari sender (mutable reference)
4. Mint 100 tokens menggunakan TreasuryCap
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
2. Mint **2 coins**: 100 dan 500 tokens
3. **Take both coins** - verify values (500 dan 100)
4. Return both coins
5. **Burn coin pertama** (500 tokens)
6. Verify coin kedua masih ada (100 tokens)

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
[ PASS    ] token_package::token_module_test::mint
[ PASS    ] token_package::token_module_test::burn
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
BUILDING token
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
2. **TreasuryCap Object ID**: `0x...` (type: `TreasuryCap<TOKEN_MODULE>`)
3. **MetadataCap Object ID**: `0x...` (type: `coin_registry::MetadataCap<TOKEN_MODULE>`)
4. **Currency Object ID**: `0x...` (shared object - metadata token)

**Copy Package ID & TreasuryCap Object ID ke notepad!**

---

## 🧪 Step 8: Test via CLI

### 8.1 View Token Metadata

```bash
# Lihat metadata token (Currency shared object)
sui client object <CURRENCY_OBJECT_ID>

# Atau dengan JSON format
sui client object <CURRENCY_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**
```json
{
  "decimals": 6,
  "description": "This is example token creation for demo sui workshop batch 3",
  "icon_url": "https://...",
  "name": "Sui Workshop Batch 3",
  "symbol": "SWB3"
}
```

### 8.2 Mint Tokens

Mari mint beberapa kali untuk testing:

```bash
# Mint pertama - 100 tokens
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 100

# Mint kedua - 200 tokens
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 200

# Mint ketiga - 300 tokens
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 300
```

**Simpan Coin Object IDs dari setiap output!**

### 8.3 Check Your Token Balance

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


### 8.5 Burn Tokens

```bash
# Burn/Destroy token (permanent!)
# Burn coin pertama (100 tokens)
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function burn \
  --args <TREASURY_CAP_OBJECT_ID> <COIN_OBJECT_ID>
```

⚠️ **Warning:** Burning permanent! Token tidak bisa di-recover & total supply berkurang.

**Verify:** Setelah burn, cek balance - seharusnya coin 100 tokens sudah hilang.

### 8.6 Split Coins

```bash
# Split coin 300 tokens - ambil 150 tokens
sui client split-coin \
  --coin-id <COIN_300_TOKENS_ID> \
  --amounts 150

# Sekarang Anda punya:
# - Original coin: 150 tokens (sisa)
# - New coin: 150 tokens (hasil split)
```

### 8.7 Merge Coins

```bash
# Gabungkan coin 200 tokens + coin 150 tokens (hasil split)
sui client merge-coin \
  --primary-coin <COIN_200_TOKENS_ID> \
  --coin-to-merge <COIN_150_TOKENS_ID>

# Hasilnya:
# - Primary coin: 350 tokens (200 + 150)
# - Coin yang di-merge: hilang (deleted)
```

### 8.8 Transfer Tokens

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
   - Token metadata (symbol, name, decimals, icon)
   - Total supply
   - Transfer history
   - Holders (jika sudah ditransfer ke banyak address)

---

## ✅ Token Contract Checklist

- [x] Build successful
- [x] Deploy successful & dapat Package ID
- [x] Mint tokens via CLI
- [x] View token metadata
- [x] Check balance di wallet
- [x] Split coins
- [x] Merge coins
- [x] Transfer tokens ke address lain
- [x] Burn tokens
- [x] Token metadata terlihat di Explorer

---

# 🔧 Troubleshooting

### Error: "Invalid TreasuryCap"
- **Solusi**: Pastikan gunakan TreasuryCap Object ID yang benar
- Verify dengan: `sui client object <TREASURY_CAP_ID>`
- Type harus: `TreasuryCap<PACKAGE_ID::token_module::TOKEN_MODULE>`

### Error: "Arithmetic error, overflow"
- **Solusi**: Amount terlalu besar
- Max u64: `18,446,744,073,709,551,615`
- Dengan 6 decimals = max ~18 triliun tokens

### Token tidak muncul di wallet
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
- ✅ **Fungible Token (Coin)** - Token yang dapat ditukar 1:1
- ✅ **Coin Registry** - Metadata otomatis di Sui
- ✅ **TreasuryCap** - Capability untuk mint & burn
- ✅ **Decimals** - Presisi token (6, 9, atau 18)
- ✅ **Merge/Split** - Coin operations yang unik di Sui
- ✅ **One-Time Witness (OTW)** - Init pattern untuk claim Publisher

## Token Operations

| Operation | Fungsi | Membutuhkan |
|-----------|--------|-------------|
| **Mint** | Create token baru | TreasuryCap |
| **Burn** | Destroy token | TreasuryCap + Coin |
| **Transfer** | Kirim coin ke address lain | Coin ownership |
| **Split** | Pecah 1 coin jadi 2 | Coin ownership |
| **Merge** | Gabung 2 coin jadi 1 | Ownership kedua coins |


# 🎨 Challenge (Opsional)

### Level 1: Basic
1. Ubah symbol & name token sesuai kreasi Anda
2. Mint 1000 tokens ke wallet Anda
3. Split menjadi 2 coins (500 + 500)
4. Transfer salah satu ke teman

### Level 2: Intermediate
5. Buat icon token sendiri (upload ke Imgur/Pinata)
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

1. **DeFi Tokens** - Governance token untuk DAO
2. **Stablecoins** - USDC, USDT equivalents
3. **Reward Points** - Loyalty program dengan token
4. **In-Game Currency** - Gold, gems, credits dalam game
5. **Utility Tokens** - Access ke platform/service
6. **Wrapped Assets** - Wrapped Bitcoin, Wrapped ETH

---

# 📚 Resources

- **Sui Coin Standard**: https://docs.sui.io/standards/coin
- **Coin Module Docs**: https://docs.sui.io/references/framework/sui-framework/coin
- **Explorer**: https://suiscan.xyz/testnet
- **Icon Upload**: https://imgur.com, https://pinata.cloud

---

# 🔄 NFT vs Token Comparison

Setelah mempelajari NFT dan Token, berikut perbedaan praktisnya:

| Aspek | NFT | Token (Coin) |
|-------|-----|--------------|
| **Fungibility** | Non-fungible (setiap NFT berbeda) | Fungible (dapat ditukar 1:1) |
| **Metadata** | Rich (name, image, description, etc) | Simple (symbol, decimals, icon) |
| **Transfer** | Transfer object langsung | Transfer, merge, split operations |
| **Use Case** | Art, collectibles, tickets | Currency, governance, payment |
| **Object Model** | Standalone object dengan UID | Coin object dengan balance & UID |
| **Minting** | Biasanya 1 per call | Bisa mint amount besar per call |

---

**Selamat! Anda sudah berhasil membuat Token di Sui! 🎉**
