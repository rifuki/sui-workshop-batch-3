# 🎯 Day 3 - NFT Project Ideas

Bank ide project NFT untuk challenge

---

## 🟢 TIER 1: Easy (1-2 jam) - Recommended

### **1. Event Ticket NFT** 🎫
NFT sebagai tiket workshop/event dengan seat number dan status used/unused.

**Tambahan di contract:**
- Field: `event_name`, `event_date`, `seat_number`, `ticket_type`, `is_used`
- Function: `use_ticket()`, `transfer_ticket()`

**Use case:** Ticketing anti-scalping, event management

---

### **2. Certificate NFT** 🏆
NFT sebagai sertifikat digital workshop/achievement.

**Tambahan di contract:**
- Field: `recipient_name`, `course_name`, `completion_date`, `grade`, `instructor`
- Function: `verify_certificate()`, access control (only instructor can mint)

**Use case:** Digital diploma, skill badges, proof of achievement

---

### **3. Digital Trading Card** 🃏
Pokemon/Yu-Gi-Oh style trading cards dengan stats.

**Tambahan di contract:**
- Field: `rarity` (Common/Rare/Epic/Legendary), `power`, `defense`, `card_type`, `element`
- Function: `get_total_stats()` untuk calculate power + defense

**Use case:** Gaming collectibles, trading card game

---

## 🟡 TIER 2: Medium (2-3 jam)

### **4. ID Card NFT** 💳
NFT sebagai ID card digital untuk organisasi/komunitas.

**Tambahan di contract:**
- Field: `full_name`, `id_number`, `organization`, `position`, `contact`, `issued_date`
- Function: `update_position()`, `update_contact()`

**Use case:** Digital identity, organization membership, access control

---

### **5. Profile Picture (PFP) NFT** 👤
Bored Ape style - avatar NFT dengan traits dan rarity score.

**Tambahan di contract:**
- Field: `background`, `skin`, `eyes`, `mouth`, `accessory`, `rarity_score`
- Function: trait selection, rarity calculation

**Use case:** Social media PFP, identity, community membership

---

### **6. Music Album NFT** 🎵
NFT untuk album musik atau single track dengan metadata lengkap.

**Tambahan di contract:**
- Field: `album_title`, `artist_name`, `genre`, `release_year`, `track_count`, `duration`, `record_label`
- Function: `get_album_info()`, view functions untuk metadata

**Use case:** Music collectibles, artist merchandise, limited edition albums

---

## 🔴 TIER 3: Advanced (3+ jam)

### **7. Dynamic NFT - Tamagochi** 🐣
NFT yang berubah stats-nya over time (hunger, happiness, age).

**Tambahan di contract:**
- Field: `species`, `hunger`, `happiness`, `age`, `last_fed`, `last_played`, `is_alive`
- Function: `feed()`, `play()`, `check_status()` (update based on time)

**Use case:** Virtual pet, gamification, interactive NFT

---
