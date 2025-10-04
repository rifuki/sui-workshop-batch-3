# Counter - Sui Workshop Batch 3

## 📖 Overview

Counter adalah aplikasi **fullstack** yang terdiri dari:
- ✅ **Smart Contract** - Sui Move contract untuk logic counter
- ✅ **Frontend** - React + TypeScript untuk UI

Peserta diharapkan **membangun project dari nol** dengan code dari README ini. 😃

---

## 🎯 Learning Objectives

- Memahami struktur Sui Move contract
- Membuat & deploy smart contract ke testnet
- Membangun React UI yang terkoneksi ke blockchain
- Interact dengan contract via frontend

---

## 📋 Prerequisites

Pastikan sudah menyelesaikan **INSTALLATION.md** di root folder:
- ✅ Sui CLI terinstall
- ✅ Wallet setup & punya testnet SUI
- ✅ Bun atau Node.js terinstall (untuk frontend nanti)

---

# PART 1: Smart Contract

## Step 1: Setup Project Structure

```bash
# Buat folder project
mkdir -p counter/
cd counter
```

## Step 2: Initialize Sui Move Package

```bash
# Initialize Move package
sui move new counter
mv counter contract && cd contract
```

## Step 3: Create Move.toml

**File:** `Move.toml`

```toml
[package]
name = "counter"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
counter_package = "0x0"

[dev-dependencies]

[dev-addresses]
```

**Penjelasan:**
- `name`: Nama package
- `edition`: Versi Move (gunakan 2024.beta)
- `dependencies`: Framework Sui
- `addresses`: Placeholder `0x0` akan diganti saat publish

## Step 4: Create Counter Contract

**File:** `sources/counter.move`

```move
module 0x0::counter_module {
    use sui::event;

    const E_COUNTER_VALUE_INVALID: u64 = 101; 

    /// ==============================
    /// Structs
    /// ==============================
    public struct CounterObject has key, store { 
        id: sui::object::UID,
        value: u64
    }

    /// ==============================
    /// Events
    /// ==============================
    public struct CounterCreateEvent has copy, drop {
        counter_object: ID
    }
    public struct CounterChangedEvent has copy, drop {
        new_value: u64
    }

    #[allow(lint(self_transfer))]
    public fun create(ctx: &mut TxContext) {
        let counter_object = CounterObject {
            id: object::new(ctx),
            value: 0
        };

        event::emit(CounterCreateEvent {
            counter_object: object::uid_to_inner(&counter_object.id)
        });

        transfer::public_transfer(counter_object, tx_context::sender(ctx))
    }

    public fun increment(counter: &mut CounterObject) {
        counter.value = counter.value + 1;

        event::emit(CounterChangedEvent {
            new_value: counter.value
        });
    }

    public fun decrement(counter: &mut CounterObject) {
        assert!(counter.value >= 1, E_COUNTER_VALUE_INVALID);

        counter.value = counter.value - 1;

        event::emit(CounterChangedEvent {
            new_value: counter.value
        });
    }

    /// ==============================
    /// Getters
    /// ==============================
    public fun get_counter_value(counter: &CounterObject): u64 { counter.value }
}
```

**Penjelasan Code:**

### Struct CounterObject
```move
public struct CounterObject has key, store {
    id: UID,
    value: u64
}
```
- `has key`: Bisa disimpan di global storage
- `has store`: Bisa ditransfer
- `value`: Counter value (0 hingga 18,446,744,073,709,551,615 atau u64 max)

### Function create()
- Membuat counter baru dengan value 0
- Emit event `CounterCreateEvent`

### Function increment()
- Parameter: `&mut CounterObject` (mutable reference)
- Menambah value +1
- Emit event dengan new_value

### Function decrement()
- Assert value >= 1 (tidak boleh negatif!)
- Kurangi value -1
- Emit event dengan new_value

## Step 5: Build Contract

```bash
# Build contract
sui move build
```

**Expected Output:**
```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING counter
Build Successful
```

## Step 6: Test Contract (Optional)
**File:** `test/counter_tests.move`

```move
#[test_only]
module counter_package::counter_tests_module {
    use sui::test_scenario;

    use counter_package::counter_module;

    const E_COUNTER_INIT_VALUE_NOT_VALID: u64 = 90001;
    const E_COUNTER_INCREMENT_VALUE_NOT_VALID: u64 = 90002;
    const E_COUNTER_DECREMENT_VALUE_NOT_VALID: u64 = 90003;

    #[test]
    fun create_counter() {
        let user = @0xBEEF;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun increment_counter() {
        let user = @0xDEAD;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
           counter_module::create(scenario.ctx());
        };
        
        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            counter_module::increment(&mut counter_object);
            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 1, E_COUNTER_INCREMENT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun decrement_counter() {
        let user = @0xDEAF;

        let mut scenario = test_scenario::begin(user);
        {
            counter_module::create(scenario.ctx());
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 0, E_COUNTER_INIT_VALUE_NOT_VALID);

            // Increment 3 times
            counter_module::increment(&mut counter_object);
            counter_module::increment(&mut counter_object);
            counter_module::increment(&mut counter_object);
            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::next_tx(&mut scenario, user);
        {
            let mut counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 3, E_COUNTER_INCREMENT_VALUE_NOT_VALID);

            counter_module::decrement(&mut counter_object);
            
            test_scenario::return_to_sender(&scenario, counter_object);
        };
        test_scenario::next_tx(&mut scenario, user);
        {
            let counter_object = test_scenario::take_from_sender<counter_module::CounterObject>(&scenario);
            assert!(counter_module::get_counter_value(&counter_object) == 2, E_COUNTER_DECREMENT_VALUE_NOT_VALID);

            test_scenario::return_to_sender(&scenario, counter_object);
        };

        test_scenario::end(scenario);
    }
}
```

```bash
# Run tests (jika ada)
sui move test

# Test specific function
sui move test create
```

## Step 7: Deploy to Testnet

```bash
# Deploy/Publish contract
sui client publish
```

**⚠️ PENTING - Simpan Output Ini:**

Dari output, catat:
1. **Package ID**: `0xabcd1234...` (contoh: `0x87114bacd0d0e9378a9866f894d6a235c59a4bd96bdfba1de390ba27e05d8172`)
2. **Transaction Digest**: `ABC123...`

**Copy Package ID ke notepad/notes!** Akan digunakan di frontend.

## Step 8: Verify Deployment

```bash
# View di Explorer
# Buka: https://suiexplorer.com/?network=testnet
# Paste Transaction Digest atau Package ID

# Atau via CLI
sui client object <PACKAGE_ID>
```

---

## 🧪 Step 9: Sneak Peak - Test via CLI

Sebelum bikin frontend, kita test dulu contract via CLI untuk memastikan semua fungsi bekerja!

### 9.1 Create Counter

```bash
# Create counter object
sui client call \
  --package <PACKAGE_ID> \
  --module counter_module \
  --function create

# ⚠️ PENTING: Simpan Counter Object ID dari output!
# Cari di output bagian "Object Changes" dengan ObjectType yang mengandung "CounterObject"
# Contoh: 0x1234abcd...
```

**Expected Output:**
```
╭──────────────────────────────────────────────────────────────────────╮
│ Object Changes                                                       │
├──────────────────────────────────────────────────────────────────────┤
│ Created Objects:                                                     │
│  ┌──                                                                 │
│  │ ObjectID: 0xCOUNTER_OBJECT_ID_HERE                              │
│  │ Sender: 0x...                                                    │
│  │ Owner: Account Address ( 0x... )                                │
│  │ ObjectType: <PACKAGE_ID>::counter_module::CounterObject         │
│  │ Version: 1234                                                    │
│  └──                                                                 │
╰──────────────────────────────────────────────────────────────────────╯
```

### 9.2 Check Counter Value

```bash
# Lihat isi counter object
sui client object <COUNTER_OBJECT_ID>

# Atau dengan format lebih readable
sui client object <COUNTER_OBJECT_ID> --json | jq '.content.fields.value'
```

**Expected:** Value = `"0"` (string, bukan number!)

### 9.3 Increment Counter

```bash
# Increment counter +1
sui client call \
  --package <PACKAGE_ID> \
  --module counter_module \
  --function increment \
  --args <COUNTER_OBJECT_ID>
```

**Check value lagi:**
```bash
sui client object <COUNTER_OBJECT_ID> --json | jq '.content.fields.value'
# Expected: "1"
```

### 9.4 Increment Multiple Times

```bash
# Increment lagi 2x
sui client call --package <PACKAGE_ID> --module counter_module --function increment --args <COUNTER_OBJECT_ID>
sui client call --package <PACKAGE_ID> --module counter_module --function increment --args <COUNTER_OBJECT_ID>

# Check value
sui client object <COUNTER_OBJECT_ID> --json | jq '.content.fields.value'
# Expected: "3"
```

### 9.5 Decrement Counter

```bash
# Decrement counter -1
sui client call \
  --package <PACKAGE_ID> \
  --module counter_module \
  --function decrement \
  --args <COUNTER_OBJECT_ID>

# Check value
sui client object <COUNTER_OBJECT_ID> --json | jq '.content.fields.value'
# Expected: "2"
```

### 9.6 Test Error Handling

```bash
# Decrement sampai 0
sui client call --package <PACKAGE_ID> --module counter_module --function decrement --args <COUNTER_OBJECT_ID>
sui client call --package <PACKAGE_ID> --module counter_module --function decrement --args <COUNTER_OBJECT_ID>

# Value sekarang = 0

# Coba decrement lagi (should fail!)
sui client call --package <PACKAGE_ID> --module counter_module --function decrement --args <COUNTER_OBJECT_ID>
```

**Expected Error:**
```
Error: Transaction failed with status: MoveAbort(
  Location: <PACKAGE_ID>::counter_module,
  Code: 101
)
```

✅ **Perfect!** Error code 101 = `E_COUNTER_VALUE_INVALID` yang kita define!

### 9.7 View di Explorer

1. Buka https://suiscan.xyz/testnet
2. Paste **Counter Object ID**
3. Lihat:
   - Current value
   - Transaction history (create, increment, decrement)
   - Events emitted

---

## ✅ Smart Contract Checklist

Pastikan semua ini berhasil sebelum lanjut ke frontend:

- [x] Build successful
- [x] Deploy successful & dapat Package ID
- [x] Create counter via CLI
- [x] Increment works (+1)
- [x] Decrement works (-1)
- [x] Error handling works (decrement at 0 fails)
- [x] Object terlihat di Explorer

---
---
---

<br/>
<br/>
<br/>

# PART 2: Frontend (React + TypeScript)
## Step 1: Create UI Project

```bash
# Kembali ke folder counter
cd ..  # sekarang di: counter/

# Create Vite React project dengan Bun (recommended)
bun create vite ui --template react-ts
cd ui

# Atau dengan npm
# npm create vite@latest ui -- --template react-ts
# cd ui
```

## Step 2: Install Dependencies

**Dengan Bun (recommended, faster):**
```bash
# Install Sui SDK & UI libraries
bun add @mysten/dapp-kit @mysten/sui @tanstack/react-query

# Install dev dependencies (sudah otomatis dari template)
bun install
```

**Atau dengan npm:**
```bash
# Install Sui SDK & UI libraries
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query

# Install dependencies
npm install
```

**File:** `package.json` (sudah auto-generated, pastikan dependency yang dibutuhkan ada)

```json
{
  "name": "ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mysten/dapp-kit": "^0.19.0",
    "@mysten/sui": "^1.39.0",
    "@tanstack/react-query": "^5.90.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "~5.9.3",
    "vite": "^7.1.7"
  }
}
```

## Step 3: Network Configuration

**File:** `src/networkConfig.ts`

```typescript
import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";

export const { networkConfig, useNetworkVariable } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      packageId: "PASTE_YOUR_PACKAGE_ID_HERE"
    },
  },
});
```

**⚠️ GANTI `PASTE_YOUR_PACKAGE_ID_HERE`** dengan Package ID dari Step 7 Part 1!

Contoh:
```typescript
packageId: "0x87114bacd0d0e9378a9866f894d6a235c59a4bd96bdfba1de390ba27e05d8172"
```

## Step 4: Create Custom Hooks

### Hook 1: Query Counter Object

**File:** `src/hooks/useQueryCounterObject.ts`

```typescript
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { useQuery } from "@tanstack/react-query";
import type { SuiObjectResponse } from "@mysten/sui/client";

export const queryKeyCounterObject = ["counter-object"];

type CounterFields = {
  id: { id: string };
  value: number;
};

export function useQueryCounterObject() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const packageId = useNetworkVariable("packageId");

  return useQuery({
    queryKey: queryKeyCounterObject,
    queryFn: async () => {
      if (!currentAccount) throw new Error("No connected account");

      const counterObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${packageId}::counter_module::CounterObject` },
        options: {
          showContent: true,
        },
      });

      if (counterObjects.data.length === 0) return null;

      const counterObject = counterObjects.data[0];
      return getSuiObjectFields<CounterFields>(counterObject);
    },
    enabled: !!currentAccount,
  });
}

function getSuiObjectFields<T>(object: SuiObjectResponse): T | null {
  if (
    object.error ||
    !object.data ||
    object.data.content?.dataType !== "moveObject" ||
    !object.data.content.fields
  )
    return null;

  return object.data.content.fields as T;
}
```

**Penjelasan:**
- Query counter object milik user
- Filter by struct type: `CounterObject`
- Return null jika belum ada counter

### Hook 2: Create Counter

**File:** `src/hooks/useMutateCreateCounter.ts`

```typescript
import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { useNetworkVariable } from "../networkConfig";
import { queryKeyCounterObject } from "./useQueryCounterObject";

const mutateKeyCreateCounter = ["mutate", "create-counter"];

export function useMutateCreateCounter() {
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyCreateCounter,
    mutationFn: async () => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      const [counterObject] = tx.moveCall({
        target: `${packageId}::counter_module::create`,
        arguments: [],
      });

      tx.transferObjects([counterObject], currentAccount.address);

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: {
          showEvents: true,
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyCounterObject });
    },
    onError: (error) => {
      console.error("Error creating counter object", error);
    },
  });
}
```

**Penjelasan:**
- Call `create()` function dari contract
- Transfer counter object ke user
- Invalidate query untuk refresh UI

### Hook 3: Increment Counter

**File:** `src/hooks/useMutateIncrementCounter.ts`

```typescript
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNetworkVariable } from "../networkConfig";
import { queryKeyCounterObject } from "./useQueryCounterObject";

const mutateKeyIncrementCounter = ["mutate", "increment-counter"];

export function useMutateIncrementCounter() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const packageId = useNetworkVariable("packageId");

  return useMutation({
    mutationKey: mutateKeyIncrementCounter,
    mutationFn: async (counterObject: string) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::counter_module::increment`,
        arguments: [tx.object(counterObject)],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: {
          showEvents: true,
        },
      });

      return response;
    },
    onSuccess: (response) => {
      if (!response.events) return;

      const event = response.events[0].parsedJson as {
        new_value: number;
      };

      alert("Increment counter success new_value: " + event.new_value);

      queryClient.invalidateQueries({ queryKey: queryKeyCounterObject });
    },
    onError: (error) => {
      console.error("Error increment counter", error);
    },
  });
}
```

**Penjelasan:**
- Call `increment()` dengan counter object ID
- Parse event untuk dapat new_value
- Alert ke user & refresh data

### Hook 4: Decrement Counter

**File:** `src/hooks/useMutateDecrementCounter.ts`

```typescript
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNetworkVariable } from "../networkConfig";
import { queryKeyCounterObject } from "./useQueryCounterObject";

const mutateKeyDecrementCounter = ["mutate", "decrement-counter"];

export function useMutateDecrementCounter() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const packageId = useNetworkVariable("packageId");

  return useMutation({
    mutationKey: mutateKeyDecrementCounter,
    mutationFn: async (counterObject: string) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::counter_module::decrement`,
        arguments: [tx.object(counterObject)],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: {
          showEvents: true,
        },
      });

      return response;
    },
    onSuccess: (response) => {
      if (!response.events) return;

      const event = response.events[0].parsedJson as {
        new_value: number;
      };

      alert("Decrement counter success new_value: " + event.new_value);

      queryClient.invalidateQueries({ queryKey: queryKeyCounterObject });
    },
    onError: (error) => {
      console.error("Error decrement counter", error);
    },
  });
}
```

## Step 5: Main App Component

**File:** `src/App.tsx`

```typescript
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

import reactLogo from "./assets/react.svg";
import "./App.css";

import { useQueryCounterObject } from "./hooks/useQueryCounterObject";
import { useMutateCreateCounter } from "./hooks/useMutateCreateCounter";
import { useMutateIncrementCounter } from "./hooks/useMutateIncrementCounter";
import { useMutateDecrementCounter } from "./hooks/useMutateDecrementCounter";

function App() {
  const currentAccount = useCurrentAccount();

  const { data } = useQueryCounterObject();
  const { mutate: mutateCreateCounter } = useMutateCreateCounter();
  const { mutate: mutateIncrementCounter } = useMutateIncrementCounter();
  const { mutate: mutateDecrementCounter } = useMutateDecrementCounter();

  const renderButton = () => {
    if (!currentAccount) return <ConnectButton />;

    if (!data)
      return (
        <button onClick={() => mutateCreateCounter()}>
          Create Counter Object
        </button>
      );

    return (
      <>
        <div className="card">
          <button onClick={() => mutateIncrementCounter(data.id.id)}>
            +1
          </button>
        </div>

        <button className="card">{data.value}</button>

        <div className="card">
          <button onClick={() => mutateDecrementCounter(data.id.id)}>
            -1
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <a href="https://sui.io" target="_blank">
          <img
            src="https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png"
            className="logo"
            alt="Sui logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Sui + React</h1>
      {renderButton()}
    </>
  );
}

export default App;
```

**Penjelasan Logic:**
1. **Wallet tidak connected** → Show ConnectButton
2. **Connected tapi belum ada counter** → Show "Create Counter" button
3. **Counter ada** → Show +1, value, -1 buttons

## Step 6: Setup Providers

**File:** `src/main.tsx`

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import "@mysten/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { networkConfig } from "./networkConfig.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <SuiClientProvider networks={networkConfig}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
);
```

**Penjelasan:**
- `QueryClientProvider`: React Query untuk data fetching
- `SuiClientProvider`: Sui blockchain client
- `WalletProvider`: Wallet connection logic

## Step 7: Run Development Server

**Dengan Bun:**
```bash
bun run dev
```

**Atau dengan npm:**
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Buka browser:** `http://localhost:5173`

---

# 🎮 Testing Flow

## Step 1: Connect Wallet

1. Buka `http://localhost:5173`
2. Klik "Connect Wallet"
3. Pilih Sui Wallet
4. Approve connection
5. Pastikan network = **Testnet**

## Step 2: Create Counter

1. Klik "Create Counter Object"
2. Approve transaction di wallet popup
3. Tunggu confirmation (~2-5 detik)
4. Counter UI akan muncul!

## Step 3: Increment/Decrement

1. Klik **+1** → Value bertambah
2. Klik **-1** → Value berkurang
3. Alert akan muncul dengan new_value
4. UI update otomatis!

## Step 4: Check di Explorer

1. Copy counter object ID dari browser console
2. Buka https://suiscan.xyz/testnet
3. Paste object ID
4. Lihat details counter & transaction history!

---

# 🔧 Troubleshooting

### Error: "Package not found"
- **Solusi**: Verify Package ID di `networkConfig.ts` apakah sudah benar

### Error: "Insufficient gas"
- **Solusi**: Request faucet lagi: `sui client faucet`

### Counter tidak update setelah increment
- **Solusi**: Refresh browser atau wait 5 detik (indexing delay)

### Wallet tidak connect
- **Solusi**:
  - Pastikan Sui Wallet extension terinstall
  - Switch network ke Testnet di wallet
  - Clear browser cache

### Build error: Module not found
- **Solusi dengan Bun**:
  ```bash
  rm -rf node_modules bun.lockb
  bun install
  ```

- **Solusi dengan npm**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

# 💡 Concepts Learned

## Sui Move Concepts
- ✅ **Struct dengan abilities** (`key`, `store`)
- ✅ **Object ownership** (owned objects)
- ✅ **Mutable references** (`&mut`)
- ✅ **Events** untuk notifikasi
- ✅ **Error handling** dengan `assert!`

## Frontend Concepts
- ✅ **Sui dApp Kit** (@mysten/dapp-kit)
- ✅ **Transaction building** (PTB - Programmable Transaction Block)
- ✅ **Wallet integration** (sign & execute)
- ✅ **Event parsing** dari transaction result
- ✅ **React Query** untuk state management

---

# 📚 Resources

- **Sui Docs**: https://docs.sui.io
- **dApp Kit Docs**: https://sdk.mystenlabs.com/dapp-kit
- **Sui TypeScript SDK**: https://sdk.mystenlabs.com/typescript
- **Explorer**: https://suiscan.xyz/testnet
- **Faucet Discord**: https://discord.gg/sui

---

**Selamat! Anda sudah berhasil build fullstack Sui dApp! 🎉**
