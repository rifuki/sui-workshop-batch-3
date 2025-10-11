# Coin (Fungible Token) - Sui Workshop Batch 3

## 📖 Overview

Coin module adalah contoh implementasi **Fungible Token** di Sui blockchain dengan:

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
cd coin_contract
```

## Step 2: Set Move.toml

**File:** `Move.toml`

```toml
[package]
name = "coin"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move

[addresses]
coin_package = "0x0"

[dev-addresses]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

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
- Decimals umum: 6 (USDC/USDT), 9 (Sui native), 18 (Ethereum)
- Icon URL harus public & accessible

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
- `amount`: Jumlah coin (dalam smallest unit / decimals)
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

## Step 4: Build Contract

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

## Step 5: Deploy to Testnet

```bash
# Deploy/Publish contract
sui client publish
```

**⚠️ PENTING - Simpan Output Ini:**

```
╭─────────────────────────────────────────────────────╮
│ Published Objects                                   │
├─────────────────────────────────────────────────────┤
│ PackageID: 0xabcd1234...                            │  ← Copy ini
╰─────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────╮
│ Created Objects                                     │
├─────────────────────────────────────────────────────┤
│ ObjectID: 0xefgh5678...                             │  ← Copy ini (TreasuryCap)
│ ObjectType: ...::TreasuryCap<...::COIN_MODULE>      │
╰─────────────────────────────────────────────────────╯
```

Dari output, catat:

1. **Package ID**: `0xabcd1234...`
2. **TreasuryCap Object ID**: `0x...` (type: `TreasuryCap<COIN_MODULE>`)

**Copy Package ID & TreasuryCap Object ID ke notepad!**

---

## 🧪 Step 6: Test via CLI

### 6.1 View Coin Metadata

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

### 6.2 Mint Coins

Mari mint beberapa kali untuk testing:

**💡 Kalkulasi Amount:**

- Rumus: `amount = jumlah_token × 10^decimals`
- Decimals = 6, jadi `10^6 = 1,000,000`
- Untuk mint 100 token: `1 × 1,000,000 = 1,000,000`

```bash
# Mint pertama - 1 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 1000000

# Mint kedua - 200 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 2000000

# Mint ketiga - 300 coins
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function mint \
  --args <TREASURY_CAP_OBJECT_ID> 3000000
```

**Simpan Coin Object IDs dari setiap output!**

### 6.3 Check Your Coin Balance

```bash
# Lihat semua coins di wallet
sui client balance

# Lihat semua objects (termasuk coins)
sui client objects
```

### 6.4 View Coin Details

```bash
# Lihat details coin object
sui client object <COIN_OBJECT_ID>

# Dengan JSON format
sui client object <COIN_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output:**

```json
{
  "balance": "600",
  "id": { "id": "0x..." }
}
```

### 6.5 Burn Coins

```bash
# Burn/Destroy coin (permanent!)
# Burn coin pertama (1 coins)
sui client call \
  --package <PACKAGE_ID> \
  --module coin_module \
  --function burn \
  --args <TREASURY_CAP_OBJECT_ID> <COIN_OBJECT_ID>
```

⚠️ **Warning:** Burning permanent! Coin tidak bisa di-recover & total supply berkurang.

**Verify:** Setelah burn, cek balance - seharusnya coin 1 coins sudah hilang.

### 6.6 Split Coins

```bash
# Split coin 3 coins - ambil 1.5 coins
sui client split-coin \
  --coin-id <COIN_3_COINS_ID> \
  --amounts 1500000

# Sekarang Anda punya:
# - Original coin: 1.5 coins (sisa)
# - New coin: 1.5 coins (hasil split)
```

### 6.7 Merge Coins

```bash
# Gabungkan coin 1.5 coins + coin 1.5 coins (hasil split)
sui client merge-coin \
  --primary-coin <COIN_1.5_COINS_ID> \
  --coin-to-merge <COIN_1.5_COINS_ID>

# Hasilnya:
# - Primary coin:  coins (1.5 + 1.5)
```

### 6.8 Transfer Coins

```bash
# Transfer coin ke address lain
sui client transfer \
  --object-id <COIN_OBJECT_ID> \
  --to <RECIPIENT_ADDRESS>
```

**Contoh recipient address:** Second wallet / teman di sebelah!

**Note:** Transfer akan mengirim seluruh coin object.

### 6.9 View di Explorer

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
