# NFT (Non-Fungible Token) - Sui Workshop Batch 3

## 📖 Deskripsi
NFT module mendemonstrasikan cara membuat **Non-Fungible Token** di Sui blockchain dengan metadata lengkap dan Display standard. Setiap NFT unik dan tidak dapat ditukar 1:1 seperti token biasa.

## 🎯 Apa yang Akan Dipelajari
- ✅ Konsep NFT dan uniqueness
- ✅ Display standard untuk metadata
- ✅ Publisher & Package capabilities
- ✅ Object creation dengan custom fields
- ✅ URL handling untuk images

---

## 📁 Struktur Project

```
nft/
├── sources/
│   └── nft.move
├── Move.toml
└── tests/
```

---

## 🔍 Review Smart Contract

### Struktur NFT

```move
public struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: Url,
    creator: address
}
```

**Penjelasan Field:**
- `id`: Unique identifier (setiap NFT beda!)
- `name`: Nama NFT (misal: "Cosmic Cat #1")
- `description`: Deskripsi NFT
- `image_url`: URL gambar NFT
- `creator`: Address yang mint NFT (immutable!)

### Display Standard

```move
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
```

**Kegunaan Display:**
- Wallet & Explorer bisa render NFT dengan benar
- Standardisasi metadata (seperti ERC-721 di Ethereum)
- Template `{name}` akan diganti dengan actual value

### Fungsi Utama

#### 1. **Mint NFT**
```move
public fun mint(
    name: String,
    description: String,
    url: String,
    ctx: &mut TxContext
)
```
- Membuat NFT baru
- Creator = transaction sender
- Transfer langsung ke minter
- ⚠️ `#[allow(lint(self_transfer))]` - explicitly allow self transfer

#### 2. **Burn NFT**
```move
public fun burn(nft: NFT)
```
- Menghapus NFT dari blockchain
- Destructure semua fields
- Delete object ID

#### 3. **Get NFT Name (View Function)**
```move
public fun get_nft_name(nft: &NFT): String
```
- Read-only function
- Tidak modify state
- Tidak consume gas (bisa dipanggil off-chain)

---

## 🚀 Step-by-Step Tutorial

### **Step 1: Build Contract**

```bash
cd nft

# Build
sui move build

# Run tests
sui move test
```

### **Step 2: Deploy to Testnet**

```bash
sui client publish --gas-budget 100000000
```

**📝 Simpan dari output:**
- ✅ **Package ID**
- ✅ **Publisher Object ID**
- ✅ **Display Object ID**
- ✅ **Transaction Digest**

### **Step 3: Mint NFT Pertama**

```bash
# Mint NFT (ganti PACKAGE_ID)
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #1" \
    "A mystical cat wandering through the cosmos" \
    "https://example.com/cosmic-cat.png" \
  --gas-budget 10000000
```

**💡 Tips:** Gunakan URL gambar yang valid! Bisa pakai:
- IPFS: `ipfs://...`
- Public CDN: `https://...`
- Arweave: `https://arweave.net/...`

**📝 Simpan NFT Object ID dari output**

### **Step 4: View NFT**

```bash
# Lihat details NFT
sui client object <NFT_OBJECT_ID>

# Lihat semua NFT yang Anda miliki
sui client objects
```

### **Step 5: Explore di Sui Explorer**

1. Buka https://suiexplorer.com/?network=testnet
2. Paste NFT Object ID atau Transaction Digest
3. Lihat metadata NFT Anda!

### **Step 6: View di Wallet**

1. Buka Sui Wallet extension
2. Tab "Collectibles"
3. NFT Anda akan muncul dengan gambar & metadata!

---

## 🎨 Mint NFT Collection

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
    "https://example.com/cat1.png" \
  --gas-budget 10000000

# NFT #2
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #2" \
    "The second cosmic cat" \
    "https://example.com/cat2.png" \
  --gas-budget 10000000

# NFT #3
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function mint \
  --args \
    "Cosmic Cat #3" \
    "The third cosmic cat" \
    "https://example.com/cat3.png" \
  --gas-budget 10000000
```

### **Transfer NFT ke Teman**

```bash
# Transfer NFT (ganti RECIPIENT_ADDRESS)
sui client transfer \
  --object-id <NFT_OBJECT_ID> \
  --to <RECIPIENT_ADDRESS> \
  --gas-budget 10000000
```

### **Burn NFT**

```bash
# Burn/Destroy NFT
sui client call \
  --package <PACKAGE_ID> \
  --module nft_module \
  --function burn \
  --args <NFT_OBJECT_ID> \
  --gas-budget 10000000
```

⚠️ **Warning:** Burning permanent! NFT tidak bisa di-recover.

---

## 🔧 Troubleshooting

### Error: "Invalid URL"
- Pastikan URL valid (harus dimulai dengan `http://` atau `https://`)
- Atau gunakan `ipfs://` untuk IPFS

### NFT tidak muncul di wallet
- Tunggu beberapa saat (indexing)
- Refresh wallet
- Pastikan Display object sudah di-setup dengan benar

### Error saat transfer
- Pastikan Anda adalah owner NFT
- Verify recipient address valid

---

## 💡 Challenge (Opsional)

### Level 1: Basic Enhancements
1. **Add `update_description`** - Update description NFT (only creator)
2. **Add getter functions** - `get_description()`, `get_image_url()`, `get_creator()`
3. **Add edition number** - Field `edition: u64`

### Level 2: Intermediate
4. **Royalty system** - Creator dapat % dari setiap transfer
5. **Attributes** - Tambah `VecMap<String, String>` untuk properties
6. **Burn event** - Emit event saat NFT di-burn

### Level 3: Advanced
7. **Collection system** - Group NFTs dalam collections
8. **Minting limit** - Max supply per collection
9. **Allowlist** - Only certain addresses bisa mint

---

## 📚 Konsep Penting

| Konsep | Penjelasan |
|--------|------------|
| **Non-Fungible** | Setiap NFT unik, tidak interchangeable |
| **Display Standard** | Metadata untuk wallet/explorer |
| **Publisher** | Capability untuk manage package |
| **Creator Field** | Immutable proof of original minter |
| **Object Ownership** | NFT dimiliki oleh address, bisa ditransfer |

---

## 🎯 Perbedaan NFT vs Token

| Aspek | NFT | Token (Coin) |
|-------|-----|--------------|
| **Uniqueness** | Setiap NFT unik | Semua token sama (fungible) |
| **ID** | Setiap NFT punya UID | Token tidak punya individual ID |
| **Transfer** | Transfer object | Transfer value/amount |
| **Use Case** | Art, collectibles, tickets | Currency, governance, utility |
| **Display** | Rich metadata (image, etc) | Symbol & decimals |

---

## 🎓 Real-World Use Cases

1. **Digital Art** - Seni digital dengan proof of ownership
2. **Gaming Items** - Swords, armor, skins yang tradeable
3. **Event Tickets** - Tiket konser dengan anti-scalping
4. **Membership Cards** - VIP access, community badges
5. **Certificates** - Diploma, achievement badges
6. **Real Estate** - Digital representation of property
7. **Domain Names** - Sui Name Service (SNS)

---

## 🎨 Free Image Resources untuk Testing

- **Picsum**: `https://picsum.photos/400/400`
- **Placeholder**: `https://via.placeholder.com/400`
- **Robohash**: `https://robohash.org/yourtext.png`
- **Upload ke Imgur/ImgBB** lalu copy link

---

## 📞 Resources

- [Sui NFT Standard](https://docs.sui.io/standards/display)
- [Sui Object Display](https://docs.sui.io/standards/display)
- [Sui Explorer](https://suiexplorer.com/?network=testnet)
- [IPFS Upload](https://www.pinata.cloud/)

---

## 🚀 Next Steps

Setelah paham NFT, lanjut ke:
- **Token Module** - Fungible token dengan supply management
- **Advanced NFT** - Collections, royalties, marketplaces
