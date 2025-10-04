# Token (Fungible Token/Coin) - Sui Workshop Batch 3

## 📖 Overview

Token module adalah contoh implementasi **Fungible Token** (Coin) di Sui blockchain dengan:
- ✅ **Coin Registry** - Metadata otomatis untuk wallet & explorer
- ✅ **TreasuryCap** - Kontrol mint & burn token
- ✅ **Decimals Support** - Presisi hingga 6 desimal
- ✅ **Mergeable/Splittable** - Coin bisa digabung/dipecah

Peserta diharapkan **membangun project** dengan code dari README ini. 😃

---

## 🎯 Learning Objectives

- Memahami konsep Fungible Token (Coin) di Sui
- Implementasi Coin Registry untuk metadata otomatis
- TreasuryCap untuk kontrol supply token
- Mint, burn, dan transfer token
- Merge & split operations pada coin

---

## 📋 Prerequisites

Pastikan sudah menyelesaikan **INSTALLATION.md** di root folder:
- ✅ Sui CLI terinstall
- ✅ Wallet setup & punya testnet SUI

---

# Smart Contract Token

## Step 1: Setup Project Structure

```bash
# Buat folder project
mkdir -p token
cd token
```

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

**Contoh amount dengan 6 decimals:**
- `1_000_000` = 1 token
- `500_000` = 0.5 token
- `1_000` = 0.001 token

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

## Step 5: Build Contract

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

## Step 6: Deploy to Testnet

```bash
# Deploy/Publish contract
sui client publish
```

**⚠️ PENTING - Simpan Output Ini:**

Dari output, catat:
1. **Package ID**: `0xabcd1234...`
2. **TreasuryCap Object ID**: `0x...` (type: TreasuryCap<TOKEN_MODULE>)
3. **CoinMetadataCap Object ID**: `0x...` (type: CoinMetadataCap<TOKEN_MODULE>)
4. **CoinMetadata Object ID**: `0x...` (shared object - untuk metadata)
5. **Transaction Digest**: `ABC123...`

**Copy Package ID & TreasuryCap Object ID ke notepad!**

---

## 🧪 Step 7: Test via CLI

### 7.1 View Token Metadata

```bash
# Lihat metadata token (shared object)
sui client object <COIN_METADATA_OBJECT_ID>

# Atau dengan JSON format
sui client object <COIN_METADATA_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**
```json
{
  "decimals": 6,
  "description": "This is example token creation for demo sui workshop batch 3",
  "icon_url": "https://strapi-dev.scand.app/uploads/sui_c07df05f00.png",
  "name": "Sui Workshop Batch 3",
  "symbol": "SWB3"
}
```

### 7.2 Mint Tokens

```bash
# Mint 1,000,000 tokens (= 1,000,000.000000 dengan 6 decimals)
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 1000000000000

# Mint 100 tokens (= 100.000000)
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 100000000
```

**💡 Kalkulasi Amount:**
- Rumus: `amount = jumlah_token × 10^decimals`
- Decimals = 6, jadi `10^6 = 1,000,000`
- Untuk mint 100 token: `100 × 1,000,000 = 100,000,000`

**Simpan Coin Object ID dari output!**

### 7.3 Check Your Token Balance

```bash
# Lihat semua coins di wallet
sui client gas

# Atau lihat semua objects
sui client objects

# Filter untuk token kita
sui client objects | grep "<PACKAGE_ID>::token_module::TOKEN_MODULE"
```

### 7.4 View Coin Details

```bash
# Lihat details coin object
sui client object <COIN_OBJECT_ID>

# Dengan JSON format
sui client object <COIN_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**
```json
{
  "balance": "100000000",
  "id": { "id": "0x..." }
}
```

Balance `100000000` dengan 6 decimals = 100 tokens

### 7.5 Transfer Tokens

```bash
# Transfer coin ke address lain
sui client transfer \
  --object-id <COIN_OBJECT_ID> \
  --to <RECIPIENT_ADDRESS>
```

**Note:** Ini transfer seluruh coin object. Jika ingin transfer partial amount, gunakan split dulu (Step 7.6).

### 7.6 Split Coins

```bash
# Split coin - ambil 50 tokens dari coin 100 tokens
sui client call \
  --package 0x2 \
  --module coin \
  --function split \
  --type-args <PACKAGE_ID>::token_module::TOKEN_MODULE \
  --args <COIN_OBJECT_ID> 50000000

# Sekarang Anda punya 2 coin objects:
# - Original coin: 50 tokens
# - New coin: 50 tokens
```

### 7.7 Merge Coins

```bash
# Gabungkan 2 coins menjadi 1
sui client call \
  --package 0x2 \
  --module coin \
  --function join \
  --type-args <PACKAGE_ID>::token_module::TOKEN_MODULE \
  --args <COIN_OBJECT_ID_1> <COIN_OBJECT_ID_2>

# Coin 2 akan digabung ke Coin 1
# Coin 1 balance akan bertambah
# Coin 2 akan hilang (deleted)
```

### 7.8 Burn Tokens

```bash
# Burn/Destroy token (permanent!)
sui client call \
  --package <PACKAGE_ID> \
  --module token_module \
  --function burn \
  --args <TREASURY_CAP_OBJECT_ID> <COIN_OBJECT_ID>
```

⚠️ **Warning:** Burning permanent! Token tidak bisa di-recover & total supply berkurang.

### 7.9 View di Explorer

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

## Decimals Explained

```
Decimals = 6
User Input: 100 tokens
Actual Amount: 100,000,000 (100 × 10^6)

Balance di Chain: 100,000,000
Tampilan di Wallet: 100.000000 SWB3
```

**Common Decimals:**
- 6 decimals: SUI, USDT, USDC (lebih hemat gas)
- 9 decimals: Common untuk many chains
- 18 decimals: Ethereum standard (maksimal presisi)

---

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

**Next:** Ready untuk Day 2 - Advanced Features! 🚀
