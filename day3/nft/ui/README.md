# NFT UI - Sui Workshop Batch 3

Frontend UI untuk interact dengan NFT smart contract di Sui blockchain.

## 📋 Prerequisites

Pastikan sudah:
- ✅ NFT contract sudah di-deploy ke testnet
- ✅ Punya Package ID dari contract
- ✅ Bun atau Node.js terinstall
- ✅ Sui Wallet extension terinstall di browser

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Navigate to UI folder
cd day3/nft/ui

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
# Ganti dengan Package ID Anda dari hasil deploy contract
VITE_PACKAGE_ID=0xABCD1234...

# Module name (biasanya tidak perlu diubah)
VITE_MODULE_NAME=nft_module

# NFT struct name (biasanya tidak perlu diubah)
VITE_NFT_STRUCT_NAME=NFT
```

**⚠️ PENTING:**
- Ganti `VITE_PACKAGE_ID` dengan Package ID hasil deploy contract Anda
- Cara dapat Package ID: lihat output saat `sui client publish`

**📝 Cara Mendapatkan Package ID:**

Setelah `sui client publish`, cari di output:
- **Package ID**: Di bagian "Published Objects" → Package

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
│ ObjectID: 0xefgh5678...                             │
│ ObjectType: ...::display::Display<...::NFT>         │  (Display object, tidak perlu)
├─────────────────────────────────────────────────────┤
│ ObjectID: 0xijkl9012...                             │
│ ObjectType: ...::package::Publisher                 │  (Publisher object, tidak perlu)
╰─────────────────────────────────────────────────────╯
```

**Note:** Untuk NFT, hanya perlu Package ID. Display & Publisher objects sudah di-setup otomatis saat deploy.

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

### Step 2: Mint NFT

1. Isi form **Mint Your NFT**:
   - **Name**: Nama NFT (contoh: "My First NFT")
   - **Description**: Deskripsi NFT (contoh: "This is my first NFT on Sui")
   - **Image URL**: Link gambar (contoh: `https://picsum.photos/400`)
2. Klik **Mint NFT**
3. Approve transaction di wallet popup
4. Tunggu confirmation (~2-5 detik)
5. NFT akan muncul di grid!

**💡 Tips untuk Image URL:**
- Gunakan URL public yang langsung ke gambar
- Format: `.jpg`, `.png`, `.gif`, `.webp`
- Contoh free images:
  - `https://picsum.photos/400` (random image)
  - `https://placehold.co/400x400/purple/white?text=My+NFT`
  - Upload ke Imgur/Pinata lalu copy direct link

### Step 3: View NFTs

NFT grid akan menampilkan:
- ✅ Gambar preview
- ✅ Name & Description
- ✅ Object ID (truncated)
- ✅ Creator address
- ✅ Button "Select to Burn"

### Step 4: Burn NFT

**Cara 1: Via Grid**
1. Klik tombol **"Select to Burn"** di NFT card
2. Object ID akan auto-fill di form Burn
3. Klik **Burn NFT**
4. Approve transaction

**Cara 2: Manual**
1. Copy Object ID dari NFT card
2. Paste di input **"NFT Object ID"**
3. Klik **Burn NFT**
4. Approve transaction

⚠️ **Warning:** Burning permanent! NFT tidak bisa di-recover.

---

## 🔧 Troubleshooting

### Error: "No NFTs found" setelah mint

**Solusi:**
- Tunggu 5-10 detik (indexing delay)
- Refresh browser
- Check wallet - pastikan transaction success
- Check di Explorer: https://suiscan.xyz/testnet

### Error: "Package not found" / Transaction failed

**Penyebab:** Package ID salah atau belum deploy contract

**Solusi:**
1. Check `.env` file - pastikan `VITE_PACKAGE_ID` benar
2. Verify Package ID di explorer
3. Deploy ulang contract jika perlu:
   ```bash
   cd ../contract
   sui client publish
   ```
4. Copy Package ID baru ke `.env`
5. Restart dev server (`Ctrl+C` lalu `bun run dev`)

### Error: "Insufficient gas"

**Solusi:**
- Request faucet: https://faucet.testnet.sui.io

### Image tidak muncul / broken

**Solusi:**
- Pastikan Image URL valid & public
- Coba URL lain atau gunakan placeholder
- Check CORS - beberapa website block external access

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

- **Sui Docs**: https://docs.sui.io
- **dApp Kit Docs**: https://sdk.mystenlabs.com/dapp-kit
- **Sui TypeScript SDK**: https://sdk.mystenlabs.com/typescript
- **Explorer**: https://suiscan.xyz/testnet

---

## 🎯 Features

- ✅ Mint NFT dengan custom metadata
- ✅ View all owned NFTs in grid layout
- ✅ Burn NFT (permanent delete)

---

**Happy Building! 🚀**
