# NFT (Non-Fungible Token) - Sui Workshop Batch 3

## 📖 Overview

NFT module adalah contoh implementasi **Non-Fungible Token** di Sui blockchain dengan:
- ✅ **Display Standard** - Metadata untuk wallet & explorer
- ✅ **Creator Field** - Track pembuat NFT
- ✅ **Mint & Burn** - Create dan destroy NFT

Peserta diharapkan **membangun project** dengan code dari README ini. 😃

---

## 🎯 Learning Objectives

- Memahami konsep NFT dan uniqueness
- Implementasi Display standard untuk metadata
- Publisher & Package capabilities
- Mint, burn, dan transfer NFT

---

## 📋 Prerequisites

Pastikan sudah menyelesaikan **INSTALLATION.md** di root folder:
- ✅ Sui CLI terinstall
- ✅ Wallet setup & punya testnet SUI

---

# Smart Contract NFT

## Step 1: Initialize Sui Move Package

```bash
# Initialize Move package
sui move new nft_contract
cd nft_contract
```

## Step 2: Set Move.toml

**File:** `Move.toml`

```toml
[package]
name = "nft"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move

[addresses]
nft_package = "0x0"

[dev-addresses]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[dev-dependencies]
```

## Step 3: Create NFT Contract

**File:** `sources/nft.move`

```move
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
```

---

## 📚 Penjelasan Code

### Struct NFT

```move
public struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: Url,
    creator: address
}
```

**Fields:**
- `id`: Unique identifier (setiap NFT berbeda)
- `name`: Nama NFT 
- `description`: Deskripsi NFT
- `image_url`: URL gambar NFT (bisa IPFS/HTTP)
- `creator`: Address pembuat NFT 

**Abilities:**
- `has key`: Bisa disimpan di storage
- `has store`: Bisa ditransfer antar address

### Init Function - Display Standard

```move
fun init(witness: NFT_MODULE, ctx: &mut TxContext)
```

**Penjelasan:**
- **Display Standard**: Metadata untuk wallet/explorer
- **Template system**: `{name}` akan diganti dengan actual value
- **Publisher**: Capability untuk manage package
- **Transfer**: Display & Publisher di-transfer ke deployer

### Mint Function

```move
public fun mint(name: String, description: String, url: String, ctx: &mut TxContext)
```

- Buat NFT baru dengan data yang diberikan
- `creator`: Otomatis set ke `tx_context::sender(ctx)`
- Transfer langsung ke minter
- `#[allow(lint(self_transfer))]`: Explicitly allow self transfer

### Burn Function

```move
public fun burn(nft: NFT)
```

- Destructure semua fields NFT
- Delete object ID
- NFT hilang permanent dari blockchain

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
BUILDING nft
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
│ PackageID: 0xabcd1234...                           │  ← Copy ini
╰─────────────────────────────────────────────────────╯
```

Dari output, catat:
1. **Package ID**: `0xabcd1234...`

**Copy Package ID ke notepad/notes!**

---

## 🧪 Step 6: Test via CLI

### 6.1 Mint NFT Pertama

```bash
# Mint NFT dengan data
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Name of the NFT" \
    "Description of the NFT" \
    "https://picsum.photos/400/400"
```

**💡 Tips URL Gambar (Free):**
- Picsum (random): `https://picsum.photos/400/400`
- Placeholder: `https://via.placeholder.com/400`
- Robohash: `https://robohash.org/sui-nft.png`
- Upload ke Pinata/Imgur lalu copy link

**Simpan NFT Object ID dari output!**

### 6.2 View NFT Details

```bash
# Lihat details NFT
sui client object <NFT_OBJECT_ID>

# Atau dengan JSON format untuk better readability
sui client object <NFT_OBJECT_ID> --json | jq '.content.fields'
```

**Expected Output (fields):**
```json
{
  "creator": "0x...",
  "description": "Description of the NFT",
  "id": { "id": "0x..." },
  "image_url": "https://picsum.photos/400/400",
  "name": "Name of the NFT"
}
```

### 6.3 Mint NFT Collection

Mari buat collection 3 NFT:

```bash
# NFT #1
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #1" \
    "The first cosmic cat" \
    "https://picsum.photos/400/400?random=1"

# NFT #2
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #2" \
    "The second cosmic cat" \
    "https://picsum.photos/400/400?random=2"

# NFT #3
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #3" \
    "The third cosmic cat" \
    "https://picsum.photos/400/400?random=3"
```

### 6.4 List All Your NFTs

```bash
# Lihat semua NFT yang Anda miliki
sui client objects
```

**Check di Explorer untuk detail lengkap:**
1. Buka https://suiscan.xyz/testnet
2. Paste **address wallet Anda** di search bar lalu lihat account.
3. Scroll ke Assets pada Tab **"NFT"** - lihat semua NFT yang Anda miliki
4. Klik salah satu NFT untuk detail:
   - Image preview
   - Metadata (name, description)
   - Creator address
   - Current owner
   - Transaction history

### 6.5 Burn NFT

```bash
# Burn/Destroy NFT (permanent!)
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function burn \
  --args <NFT_OBJECT_ID>
```

⚠️ **Warning:** Burning permanent! NFT tidak bisa di-recover.

### 6.6 Transfer NFT

```bash
# Transfer NFT ke address lain
sui client transfer \
  --object-id <NFT_OBJECT_ID> \
  --to <RECIPIENT_ADDRESS>
```

**Contoh recipient address:** Second wallet / teman di sebelah!

### 6.7 View di Explorer

1. Buka https://suiscan.xyz/testnet
2. Paste **NFT Object ID**
3. Lihat:
   - NFT metadata (name, description, image)
   - Creator address
   - Transfer history
   - Current owner

---

## ✅ NFT Contract Checklist

- [x] Build successful
- [x] Deploy successful & dapat Package ID
- [x] Mint NFT via CLI
- [x] View NFT details
- [x] Mint NFT collection (2+ NFTs)
- [x] Transfer NFT ke address lain
- [x] Burn NFT
- [x] NFT terlihat di Explorer

---

# 🔧 Troubleshooting

### Error: "Invalid URL"
- **Solusi**: Pastikan URL dimulai dengan `http://` atau `https://`
- Test URL di browser dulu sebelum mint

### NFT tidak muncul di wallet
- **Solusi**:
  - Tunggu 10-20 detik (indexing delay)
  - Refresh wallet
  - Pastikan Display object sudah di-setup (cek saat deploy)

### Error: "Package not found"
- **Solusi**: Verify Package ID benar
- Copy ulang dari terminal saat deploy

### Error saat transfer
- **Solusi**:
  - Pastikan Anda adalah owner NFT
  - Verify recipient address valid (harus 0x... format)

---

# 💡 Concepts Learned

## Sui Move Concepts
- ✅ **Non-Fungible Token** - Setiap NFT unik
- ✅ **Display Standard** - Metadata untuk wallet/explorer
- ✅ **Publisher Capability** - Package management
- ✅ **One-Time Witness (OTW)** - Init function pattern
- ✅ **Creator tracking** - Immutable proof of minter

---

# 🎨 Challenge (Opsional)

### Level 1: Basic
1. Mint NFT dengan gambar Anda sendiri (upload ke Imgur)
2. Transfer NFT ke teman
3. View NFT di https://suiscan.xyz

### Level 2: Intermediate
4. Tambah field `edition: u64` untuk numbering
5. Mint 10 NFTs dengan loop di CLI

### Level 3: Advanced
6. Tambah `update_description()` - hanya creator yang bisa
7. Tambah royalty system untuk transfer
8. Buat collection system dengan Collection struct

---

# 🎯 Real-World Use Cases

1. **Digital Art** - Seni digital dengan proof of ownership
2. **Gaming Items** - Swords, armor, skins yang tradeable
3. **Event Tickets** - Tiket konser dengan anti-scalping
4. **Membership Cards** - VIP access, community badges
5. **Certificates** - Diploma, achievement badges
6. **Domain Names** - Sui Name Service (SNS)

---

# 📚 Resources

- **Sui Object Display**: https://docs.sui.io/standards/display
- **Explorer**: https://suiscan.xyz/testnet
- **Free Images**: https://picsum.photos, https://placeholder.com

---

**Selamat! Anda sudah berhasil membuat NFT di Sui! 🎉**
