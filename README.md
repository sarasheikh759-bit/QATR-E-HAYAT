# Blood Bridge Pakistan (بلڈ برج پاکستان / بلڊ برج پاڪستان)

> **Connecting Donors. Bringing Hope.**
> *A bridge between those who need blood and those willing to donate.*

An emergency blood coordination and voluntary donor matching platform tailored for Pakistan, built with a healthcare-tech design system and full trilingual support (English, Urdu, and Sindhi with RTL layout mirroring).

---

## 🌟 Key Features

1. **Trilingual System (English, اردو, سنڌي)**
   - Instant language switching across all pages, forms, modals, tables, and statuses without reloading.
   - Dynamic document direction (`dir="rtl"` for Urdu and Sindhi, `dir="ltr"` for English).
   - Noto Naskh Arabic and Noto Nastaliq font stacks ensuring correct Sindhi letters (ڄ, ڃ, ڇ, ڌ, ڏ, ڳ, ڱ, ڻ) and Urdu typography.

2. **Smart Emergency Match Engine (Signature Feature)**
   - 7-step visual workflow stepper: *Submitted → Under Review → Verified → Donors Matched → Invites Sent → Responses Received → Follow-up / Closed*.
   - ABO/Rh compatibility rules (Exact match priority, compatible emergency universal fallbacks).
   - City and neighborhood ranking (Karachi, Lahore, Islamabad, Hyderabad, Tharparkar, Peshawar, Quetta, Multan).
   - Excludes donors marked unavailable or lacking consent.
   - Interactive demo notification dispatch and instant simulated donor response triggers.
   - Helpful zero-match state with radius broadening.

3. **Strict Request Verification & Admin Portal**
   - Verification intake queue: requests start as **Pending Review (Amber)** to prevent hoax calls.
   - Platform coordinators review hospital and attendant credentials.
   - Approving unlocks donor notifications (**Verified, Green**); rejection requires mandatory audit rationale (**Rejected, Red**).
   - Platform Audit Log tracking all administrative decisions.
   - Suspicious request flagging.

4. **Donor Portal & Directory**
   - 1-click availability toggle (*Available to Donate* vs *Temporarily Unavailable*).
   - Incoming emergency invitations queue with *Accept Willingness* and *Decline* actions.
   - **Certified PDF Donation Summary Export**: Donors can generate and download an official voluntary donation transcript and response timeline as a branded A4 PDF (`Blood_Bridge_Pakistan_Donation_History_<DONOR_ID>.pdf`) featuring blood group verification, emergency impact stats, hospital records, safety disclaimers, and coordinator digital seal.
   - Profile editor and privacy controls (phone numbers kept private by default).
   - Filterable voluntary donor directory with blood group chips and city filters.

5. **Live Tracking & Status Dashboard**
   - Search by Request ID (`REQ-CITY-XYZ`).
   - Live metrics (units needed, alerts sent, donors confirmed).
   - Real-time audit activity timeline.
   - Hospital guidance and next medical step recommendations.

6. **Safety & Medical Disclaimers**
   - Platform serves as a voluntary digital connector, not a hospital or blood bank.
   - Explains mandatory hospital blood screening (Hepatitis B & C, HIV, Syphilis, Malaria) and cross-matching before transfusion.
   - Emergency hotline references (1122, Edhi 115, Chhipa 1020, Indus Hospital, Fatimid Foundation).

---

## 🚀 Running the Application

### Development Server
```bash
npm run dev
```
The application runs on `http://localhost:3000`.

### Build for Production
```bash
npm run build
```

---

## 🧪 Quick Test Scenarios (Hackathon Judges)

1. **Language & RTL Switching:**
   - Click the language selector in the top navbar and switch between **English**, **اردو**, and **سنڌي**.
   - Notice the entire UI translates and mirrors alignment naturally.

2. **1-Click Demo Role Switching:**
   - Use the top dark banner pills to toggle between **Requester (Ali Khan)**, **Donor (Dr. Ayesha)**, and **Admin (Dr. Imran Qureshi)**.

3. **Pending Verification Guard:**
   - Navigate to **Smart Match** and select `REQ-LHR-109` (Lahore O-).
   - Notice the amber alert: donor invitations are locked until verified.
   - Click **"Simulate Admin Verification (Instant Test)"** or switch to the Admin Portal to approve it, turning it green and unlocking donor dispatch!

4. **Zero-Match Demonstration:**
   - In **Smart Match**, select `REQ-MTH-902` (Mithi/Tharparkar AB-).
   - Notice the zero-match empty state and test the **"Broaden Search Radius"** button.

5. **Unavailable Donor Exclusion:**
   - Search donors in Karachi for B+ (`Find Donors`). Notice donor Tariq Mehmood is marked *Temporarily Unavailable* and is automatically excluded by the Smart Match engine.

6. **Reset Sample Data:**
   - Click **"Reset Demo Data"** in the top bar anytime to restore the pristine seed dataset.

---

## ⚠️ Demo Limitations & Scope

- **Local Persistence:** Data persists in browser `localStorage`. No external backend database or cloud SMS gateway is active in this offline prototype.
- **Simulated Notifications:** Push notifications, WhatsApp messages, and SMS alerts are simulated within the in-app notification center.
- **Medical Disclaimer:** The system does not perform medical compatibility checks, cross-matching, or blood testing. Transfusions require hospital laboratory testing.
