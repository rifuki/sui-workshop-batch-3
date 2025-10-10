# Coin UI - Sui Workshop Batch 3

Frontend UI untuk interact dengan Coin (Fungible Token) smart contract di Sui blockchain.

## 📋 Prerequisites

Pastikan sudah:
- ✅ Coin contract sudah di-deploy ke testnet
- ✅ Punya Package ID & TreasuryCap ID dari contract
- ✅ Bun atau Node.js terinstall
- ✅ Sui Wallet extension terinstall di browser

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Navigate to UI folder
cd day2/coin/ui

# Install dependencies
bun install
# atau dengan npm
npm install
```

### 2. Configure Environment

```bash
# Copy .env.example ke .env
cp .env.example .env
```

**Edit `.env` file:**

```env
# Ganti dengan Package ID & TreasuryCap ID dari hasil deploy contract
VITE_PACKAGE_ID=0xABCD1234...
VITE_TREASURY_CAP_ID=0xEFGH5678...

# Module & Coin struct name (biasanya tidak perlu diubah)
VITE_MODULE_NAME=coin_module
VITE_COIN_STRUCT_NAME=COIN_MODULE
```

**⚠️ PENTING:**
- Ganti `VITE_PACKAGE_ID` dengan Package ID hasil deploy
- Ganti `VITE_TREASURY_CAP_ID` dengan TreasuryCap Object ID
- Cara dapat keduanya: lihat output saat `sui client publish`

**📝 Cara Mendapatkan IDs:**

Setelah `sui client publish`, cari di output:
1. **Package ID**: Di bagian "Published Objects" → Package
2. **TreasuryCap ID**: Di bagian "Created Objects" → ObjectType yang mengandung `TreasuryCap`

Contoh output:
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

### 3. Run Development Server

```bash
# Dengan Bun (recommended, faster)
bun run dev

# Atau dengan npm
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Open Browser

Buka `http://localhost:5173`

---

## 🎮 How to Use

### Step 1: Connect Wallet

1. Klik tombol **Connect Wallet** di navbar
2. Pilih **Sui Wallet**
3. Approve connection
4. Pastikan network = **Testnet**

### Step 2: Mint Coin

1. Isi **Amount** di form Mint Coin
   - Contoh: `1000` untuk mint 1000 coins
   - **Note**: Amount dalam smallest unit (decimals)
   - Dengan 6 decimals: `1000000` = 1 coin
2. Klik **Mint Coin**
3. Approve transaction di wallet popup
4. Tunggu confirmation (~2-5 detik)
5. Coin akan muncul di list!

**💡 Tips Amount:**
- Coin ini menggunakan **6 decimals**
- `1000000` = 1.000000 coin (1 coin penuh)
- `500000` = 0.500000 coin (setengah coin)
- `100` = 0.000100 coin (sangat kecil)

### Step 3: View Coins

Coin list akan menampilkan:
- ✅ Balance setiap coin object
- ✅ Coin Object ID (truncated)
- ✅ Total Balance (sum semua coins)
- ✅ Button "Select" untuk burn

**Note:** Sui menggunakan **Coin Object** model:
- Setiap mint membuat **coin object baru**
- Anda bisa punya **multiple coin objects**
- Total balance = sum of all coin objects

### Step 4: Burn Coin

**Cara 1: Via Coin List**
1. Klik tombol **"Select"** di coin yang ingin di-burn
2. Coin Object ID akan auto-fill di form Burn
3. Klik **Burn Coin**
4. Approve transaction

**Cara 2: Manual**
1. Copy Coin Object ID dari list
2. Paste di input **"Coin Object ID"**
3. Klik **Burn Coin**
4. Approve transaction

⚠️ **Warning:**
- Burning permanent! Coin tidak bisa di-recover
- Burn akan menghapus **seluruh coin object** (semua balance di object tsb)
- Total supply berkurang secara permanent

---

## 🔧 Troubleshooting

### Error: "No coins found" setelah mint

**Solusi:**
- Tunggu 5-10 detik (indexing delay)
- Refresh browser
- Check wallet - pastikan transaction success
- Check di Explorer: https://suiscan.xyz/testnet

### Error: "Package not found" / "Invalid TreasuryCap"

**Penyebab:** Package ID atau TreasuryCap ID salah

**Solusi:**
1. Check `.env` file - pastikan kedua ID benar
2. Verify di explorer bahwa Package ID valid
3. Pastikan TreasuryCap ID adalah object dengan type `TreasuryCap<...>`
4. Deploy ulang contract jika perlu:
   ```bash
   cd ../contract
   sui client publish
   ```
5. Copy Package ID & TreasuryCap ID baru ke `.env`
6. Restart dev server (`Ctrl+C` lalu `bun run dev`)

### Error: "Insufficient gas"

**Solusi:**
- Request faucet: https://faucet.testnet.sui.io
- Atau via CLI: `sui client faucet`

### Error: "Invalid amount" / Amount tidak masuk akal

**Solusi:**
- Ingat: Coin menggunakan 6 decimals
- Mint minimal `1` (= 0.000001 coin)
- Untuk 1 coin penuh: mint `1000000`
- Jangan mint angka terlalu besar (max u64)

### Total Balance tidak update

**Solusi:**
- Tunggu beberapa detik
- Refresh browser
- Check apakah transaction success di wallet
- Coins mungkin di-merge/split secara otomatis oleh wallet

### Wallet tidak connect

**Solusi:**
1. Pastikan Sui Wallet extension terinstall
2. Switch network ke **Testnet** di wallet
3. Refresh halaman & klik Connect Wallet lagi
4. Clear browser cache jika masih gagal

---

## 🛠️ Build for Production

```bash
# Build production bundle
bun run build
# atau
npm run build

# Preview production build
bun run preview
# atau
npm run preview
```

Output akan ada di folder `dist/`

---

## 📚 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui
- **Blockchain**:
  - @mysten/dapp-kit (Sui wallet integration)
  - @mysten/sui (Sui SDK)
- **State Management**: TanStack React Query
- **Routing**: React Router Dom v7
- **Notifications**: Sonner
- **Icons**: Lucide React

---

## 📖 Learn More

- **Sui Coin Standard**: https://docs.sui.io/standards/coin
- **dApp Kit Docs**: https://sdk.mystenlabs.com/dapp-kit
- **Sui TypeScript SDK**: https://sdk.mystenlabs.com/typescript
- **Explorer**: https://suiscan.xyz/testnet

---

## 🎯 Features

- ✅ Mint coin dengan custom amount
- ✅ View all owned coin objects
- ✅ Burn coin (permanent delete)

---

## 💡 Advanced Operations

Setelah familiar dengan UI, coba operations advanced via CLI:

### Split Coin
```bash
# Pecah coin object menjadi 2
sui client split-coin --coin-id <COIN_ID> --amounts 500000
```

### Merge Coin
```bash
# Gabungkan 2 coin objects
sui client merge-coin --primary-coin <COIN_ID_1> --coin-to-merge <COIN_ID_2>
```

### Transfer Coin
```bash
# Transfer coin ke address lain
sui client transfer --object-id <COIN_ID> --to <RECIPIENT_ADDRESS>
```

---

## 🔍 Understanding Coin Model

**Sui Coin ≠ ERC20:**
- **Sui**: Coin adalah **object** yang bisa di-split/merge
- **Ethereum**: Token adalah **balance** dalam contract

**Contoh:**
1. Mint 1000 coins → Dapat 1 coin object dengan balance 1000
2. Split 500 → Dapat 2 coin objects: balance 500 + 500
3. Merge kembali → Dapat 1 coin object dengan balance 1000

**Kenapa begini?**
- ✅ Gas efficient (no storage modification)
- ✅ Parallel transactions (no shared state)
- ✅ Composability (coins as objects)

---

**Happy Building! 🚀**
