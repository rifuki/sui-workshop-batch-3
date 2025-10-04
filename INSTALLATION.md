# 🛠️ Installation Guide - Sui Workshop Batch 3

Panduan setup environment untuk Sui Move development.

---

## 📋 Prerequisites

- **OS**: macOS, Linux, atau Windows (WSL2)
- **RAM**: Minimum 8GB
- **Storage**: 5GB free space
- **Internet**: Stable connection

---

## 1️⃣ Install Rust

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Pilih option 1 (default installation)

# Restart terminal atau jalankan:
source $HOME/.cargo/env

# Verify
rustc --version
cargo --version
```

**Expected output:**
```
rustc 1.75.0 (atau versi lebih baru)
cargo 1.75.0 (atau versi lebih baru)
```

---

## 2️⃣ Install Sui CLI

### Option A: Install via Suiup (Recommended)
```bash
# Install Suiup (recommended)
cargo install --git https://github.com/Mystenlabs/suiup.git --locked

# Install Sui CLI testnet version
suiup install sui@testnet

# Add Sui to PATH
export PATH="$HOME/.local/bin/sui:$PATH"

# Verify
sui --version

# Expected: sui 1.5X.X-testnet (atau versi terbaru)
```

### Option B: Compile dari Source

```bash
# Install Sui CLI testnet version
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Tunggu 15-50 menit (tergantung koneksi & spesifikasi komputer)

# Verify
sui --version
```

### Option C: Download Binary (Faster)

**macOS:**
```bash
brew install sui
```

**Linux:**
```bash
# Download latest release
wget https://github.com/MystenLabs/sui/releases/download/testnet-v1.XX.X/sui

# Make executable
chmod +x sui

# Move to PATH
sudo mv sui /usr/local/bin/
```

### Verify Installation

```bash
sui --version
```

**Expected:** `sui 1.XX.X-testnet` atau similar

---

## 3️⃣ Install Sui Wallet Extension (Browser)

### Install Extension Dulu

1. **Chromium Based Browser**:
   - https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil

### Create New Wallet di Extension

1. Buka extension yang sudah terinstall
2. Klik **"More Options -> Create a passphrase account"**
3. **Backup Recovery Phrase** (12 kata)
4. Set password untuk extension
5. **Switch ke Testnet**:
   - Settings → Network → **Testnet**

### Copy Address

1. Klik extension
2. Copy address Anda (0x...)
3. Simpan di notepad

---

## 4️⃣ Import Wallet ke Sui CLI

### Import dari Extension ke CLI

```bash
# Import menggunakan recovery phrase dari extension
sui keytool import "paste twelve word recovery phrase here" ed25519

# Contoh (JANGAN gunakan ini!):
# sui keytool import "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12" ed25519
```

**Expected Output:**
```
╭─────────────────┬─────────────────────────────────╮
│ alias           │  xxxxx-xxxx                     │
│ suiAddress      │  0x.............                │
│ publicBase64Key │  xxxxxx.........                │
│ keyScheme       │  ed25519                        │
│ flag            │  0                              │
│ peerId          │  xxxxxxxxxxxxxx                │
╰─────────────────┴─────────────────────────────────╯
```

### Verify Import Berhasil

```bash
# 1. Lihat semua addresses
sui client addresses

# 2. Switch ke address yang benar (ganti dengan address Anda)
sui client switch --address <ADDRESS_KAMU>

# 3. Verify address aktif
sui client active-address

# Should match dengan address di extension!
```

### Alternative: Import dari CLI ke Extension (Opsional)

Jika Anda ingin buat wallet di CLI terlebih dahulu:

```bash
# 1. Generate wallet di CLI
sui client new-address ed25519

# 2. Copy recovery phrase yang muncul
# 3. Buka Sui Wallet extension
# 4. Klik "Import Existing Wallet"
# 5. Paste recovery phrase
# 6. Set password
```

---

## 5️⃣ Get Testnet SUI

### Faucet via Web (Recommended)

1. Buka: **https://faucet.testnet.sui.io**
2. Connect dengan Sui Wallet extension
3. Klik "Request Testnet SUI"
4. Tunggu 5-10 detik
5. Refresh wallet - balance akan bertambah!

### Faucet via Discord (Alternative)

1. Join [Sui Discord](https://discord.gg/sui)
2. Channel `#testnet-faucet`
3. Ketik: `!faucet <YOUR_ADDRESS>`

### Verify Balance

```bash
# Check balance via CLI
sui client gas

# Atau
sui client balance
```

**Expected:** Anda akan dapat **1 SUI** (= 1,000,000,000 MIST)

**Di Extension:**
- Buka wallet → balance terlihat di atas

---

## 6️⃣ Configure Network

### Setup Testnet Environment

```bash
# 1. Lihat semua networks/environments
sui client envs

# 2. Jika testnet belum ada, tambahkan:
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# 3. Switch ke testnet
sui client switch --env testnet

# 4. Verify network aktif
sui client active-env

# Should show: testnet
```

---

## 7️⃣ Install Node.js & npm

**Untuk UI development (React)**

### Install Bun (recommended, faster, and priority for demo workshop)
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Verify
bun --version
```

### Alternative: Install via nvm (Node Version Manager)
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```
---

## ✅ Final Verification Checklist

Pastikan semua sudah terinstall:

### Checklist:

**✅ Step 1-2: Tools Installed**
```bash
rustc --version      # Should show version
sui --version        # Should show version
```

**✅ Step 3: Browser Wallet**
- [ ] Extension terinstall (Chrome/Firefox)
- [ ] Wallet created
- [ ] Recovery phrase di-backup
- [ ] Network = Testnet

**✅ Step 4: CLI Wallet**
```bash
sui client active-address   # Should show your address (sama dengan extension)
```

**✅ Step 5: Testnet SUI**
```bash
sui client gas   # Should show balance ~1 SUI
```

**✅ Step 6: Network Config**
```bash
sui client active-env   # Should show: testnet
```

**✅ Step 7: Bun / Node.js**
```bash
bun --version    # v1.0+ 
# or
node --version   # v20+
npm --version    # v10+
```

---

## 🔧 Troubleshooting

### Error: "sui: command not found"

**Solusi:**
```bash
# Add to PATH
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Atau untuk zsh shell
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Error: "failed to get gas"

**Solusi:**
```bash
# Pastikan connected ke testnet
sui client switch --env testnet

# Request faucet lagi
sui client faucet

# Atau gunakan Discord faucet
```

### Error: "RPC call failed"

**Solusi:**
```bash
# Update RPC endpoint
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

### Sui build sangat lambat

**Solusi:**
```bash
# Update Rust
rustup update stable

# Clear cache
cargo clean

# Build ulang
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

jika lambat, ganti metode pakai suiup atau langsung pakai yang pre-compiled dari github sui. atau jika masih ngeyel ingin compile sendiri pastikan koneksi internet cepat & stabil atau ganti device dengan spesifikasi lebih tinggi 😆 
```

---

## 🎯 Next Steps

Setelah semua terinstall:

1. ✅ Buka **day1/counter/README.md** untuk mulai coding
2. ✅ Follow step-by-step tutorial
3. ✅ Build & deploy contract pertama Anda!

---

**Happy Building! 🚀**
