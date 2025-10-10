# 💧 Sui Move Workshop - Batch 3

Workshop lengkap untuk belajar **Sui Move** development dari dasar hingga membuat **fullstack dApp** (smart contract + frontend).

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Workshop Structure](#-workshop-structure)
- [Quick Start](#-quick-start)
- [Day 1: Counter dApp](#-day-1-counter-dapp)
- [Day 2: Coin & NFT](#-day-2-coin--nft)
- [Day 3: ---]()
- [Resources](#-resources)

---

## 🎯 Overview

Workshop ini berisi:
- ✅ **Sui Move fundamentals** - Syntax, structs, functions, abilities
- ✅ **Smart contract patterns** - Counter, Coin (Fungible Token), NFT (Non-Fungible Token)
- ✅ **Testing** - Unit tests dengan test scenarios
- ✅ **Deployment** - Deploy ke Sui testnet
- ✅ **Frontend integration** - React + TypeScript + Sui SDK
- ✅ **Best practices** - Clean code, error handling, documentation

**Target Audience:**
- Developers yang ingin belajar blockchain
- Familiar dengan programming (any language)
- Bonus jika tau TypeScript/React (untuk UI)

---

## 📋 Prerequisites

### **WAJIB: Setup Environment Dulu!**

Sebelum mulai Day 1, **WAJIB** ikuti setup di:

📖 **[INSTALLATION.md](./INSTALLATION.md)**

Checklist yang harus selesai:
- ✅ Rust terinstall
- ✅ Sui CLI terinstall (`sui --version`)
- ✅ Sui Wallet extension terinstall di browser
- ✅ Wallet setup & punya testnet SUI (via faucet)
- ✅ Bun atau Node.js terinstall (untuk frontend)

**⚠️ PENTING:** Installation bisa memakan waktu 30-60 menit. Jangan skip!

---

## 🗂️ Workshop Structure

```
sui-workshop-batch-3/
├── INSTALLATION.md          # ⚠️ MULAI DARI SINI!
├── README.md                # 📖 File ini
├── day1/                    # 📘 Day 1: Counter dApp
│   └── counter/
│       ├── contract/        # Smart contract
│       │   ├── sources/
│       │   ├── tests/
│       │   └── Move.toml
│       ├── ui/              # React frontend
│       │   ├── src/
│       │   ├── .env.example
│       │   └── package.json
│       └── README.md        # Tutorial lengkap
│
└── day2/                    # 📗 Day 2: Coin & NFT
    ├── coin/                # Fungible Token
    │   ├── contract/
    │   │   ├── sources/coin.move
    │   │   ├── tests/coin_tests.move
    │   │   └── Move.toml
    │   ├── ui/
    │   │   ├── src/
    │   │   ├── .env.example
    │   │   └── README.md
    │   └── README.md
    │
    └── nft/                 # Non-Fungible Token
        ├── contract/
        │   ├── sources/nft.move
        │   ├── tests/nft_tests.move
        │   └── Move.toml
        ├── ui/
        │   ├── src/
        │   ├── .env.example
        │   └── README.md
        └── README.md
```

---

## 🚀 Quick Start

### **Path untuk Self-Learning:**

```bash
# 1. Setup environment
# Baca & ikuti: INSTALLATION.md (30-60 menit)

# 2. Day 1 - Counter dApp
cd day1/counter
# Baca: README.md
# Build contract → Deploy → Build UI

# 3. Day 2 - Coin Module
cd ../../day2/coin
# Baca: README.md (contract)
# Build → Deploy → Setup UI (baca ui/README.md)

# 4. Day 2 - NFT Module
cd ../nft
# Baca: README.md (contract)
# Build → Deploy → Setup UI (baca ui/README.md)

# 5. Day 3 - Build Your Own!
# Pilih challenge dari ideas di bawah
```

---

## 📘 Day 1: Counter dApp

### **What You'll Build:**
Fullstack dApp sederhana dengan:
- Smart contract untuk increment/decrement counter
- React UI untuk interact dengan contract
- Event system untuk tracking changes

### **Learning Objectives:**
- ✅ Sui Move basics (struct, functions, abilities)
- ✅ Mutable references (`&mut`)
- ✅ Events & error handling
- ✅ Deploy contract ke testnet
- ✅ Frontend integration dengan `@mysten/dapp-kit`
- ✅ Custom React hooks untuk blockchain

### **Key Files:**
- `day1/counter/contract/sources/counter.move` (61 lines)
- `day1/counter/ui/src/App.tsx`
- `day1/counter/README.md` (1095 lines - tutorial lengkap)

### **Start Here:**
📖 [day1/counter/README.md](./day1/counter/README.md)

---

## 📗 Day 2: Coin & NFT

### **Module 1: Coin (Fungible Token)** 💰

**What You'll Build:**
Custom cryptocurrency dengan:
- Metadata (symbol, name, decimals, icon)
- Mint & burn functionality
- TreasuryCap untuk control supply
- UI untuk mint/burn operations

**Learning Objectives:**
- ✅ One-Time Witness (OTW) pattern
- ✅ `coin::create_currency` standard
- ✅ TreasuryCap capabilities
- ✅ Coin object model (split/merge)

**Key Files:**
- `day2/coin/contract/sources/coin.move` (45 lines)
- `day2/coin/ui/src/app/HomePage.tsx` (218 lines)
- `day2/coin/README.md` (691 lines)
- `day2/coin/ui/README.md` (310 lines)

**Start Here:**
📖 [day2/coin/README.md](./day2/coin/README.md)

---

### **Module 2: NFT (Non-Fungible Token)** 🎨

**What You'll Build:**
NFT platform dengan:
- Rich metadata (name, description, image, creator)
- Display standard untuk wallet integration
- Mint & burn functionality
- Gallery UI dengan image preview

**Learning Objectives:**
- ✅ Display standard implementation
- ✅ Publisher capabilities
- ✅ Unique object model
- ✅ NFT metadata best practices
- ✅ Image URL handling

**Key Files:**
- `day2/nft/contract/sources/nft.move` (90 lines)
- `day2/nft/ui/src/app/HomePage.tsx` (282 lines)
- `day2/nft/README.md` (654 lines)
- `day2/nft/ui/README.md` (256 lines)

**Start Here:**
📖 [day2/nft/README.md](./day2/nft/README.md)

---

## ❓ Day 3: ---

---

## 📚 Resources

### **Official Docs:**
- **Sui Documentation**: https://docs.sui.io
- **Sui Move Book**: https://move-book.com/
- **dApp Kit**: https://sdk.mystenlabs.com/dapp-kit
- **TypeScript SDK**: https://sdk.mystenlabs.com/typescript

### **Tools:**
- **Explorer (Testnet)**: https://suiscan.xyz/testnet
- **Faucet**: https://faucet.testnet.sui.io
- **Discord**: https://discord.gg/sui

### **Image Resources (for NFTs):**
- Picsum Photos: https://picsum.photos
- Pinata IPFS: https://pinata.cloud

---

## 🤝 Contributing

Found typo atau ada improvement ideas?
- Create issue atau PR di GitHub

---

**Ready to start? 🚀**

👉 **[Begin with INSTALLATION.md](./INSTALLATION.md)**

---

**Happy Building on Sui! 🌊**
