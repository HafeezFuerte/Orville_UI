# Orville — Figma Mobile View Design Catalog (reference)

**Status:** Shared reference for all agents. Node-level catalog of the mobile (390px) Figma work.
Do **not** change the Orville_UI app / chrome from this catalog unless the user explicitly asks to implement a frame.

**Started:** 2026-09-25 (Cursor). **Promoted into the repo:** 2026-10-01 (Cursor) from a machine-local
Cursor agent store, which is no longer authoritative. Keep this file current after every mobile Figma task.
Figma access: via the Figma MCP connection of whichever agent is working (no credentials stored here).

---

## Source

- **File:** [property-mangement](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement)
- **fileKey:** `qBeLDjf5D3MY9UMTz2maON`
- **Canvas:** [Responsive - My day, Dashboard & Properties](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6122-413)
- **Canvas nodeId:** `6122:413`
- **Scope:** Mobile frames only (no Desktop/Tablet variants found under this canvas)

### HARD RULE — page target (all mobile Figma work)
- **ONLY** create/edit mobile designs on page **`Responsive - My day, Dashboard & Properties`** (`6122:413`).
- **NEVER** use `Page 2`, `Web Portal`, `TAB`, or `version 1` for mobile view design.
- Every `use_figma` call must start with:  
  `await figma.setCurrentPageAsync(figma.root.children.find(p => p.id === '6122:413'))`
- Do not append new frames to whatever page happens to be current.

---

## MCP notes

- Whole canvas is too large for `get_design_context` — target a **single screen frame**.
- `get_metadata` / `get_screenshot` work with `fileKey` + `nodeId`.
- Convert URL `node-id=6122-413` → MCP `6122:413`.

---

## Top-level mobile frames (by area)

### My day / Dashboard
| Frame | nodeId |
|---|---|
| My day / Mobile | `6122:644` |
| Dashboard / Mobile | `6122:781` (redesigned 2026-09-30, content `7376:19804`) |
| Dashboard / Mobile — previous content (backup) | `7376:19803` |

### Properties
| Frame | nodeId |
|---|---|
| Property List / Mobile | `6196:539` |
| Property Overview / Mobile | `6200:610` |
| Property Overview / Units / Mobile | `6203:741` |
| Property Overview / Rooms / Mobile | `6203:913` |
| Property Overview / Tenants / Mobile | `6203:1075` |
| Property Overview / Common Area / Mobile | `6203:1237` |
| Property Overview / Broadcasts / Mobile | `6203:1389` |
| Property Overview / Attachments / Mobile | `6203:1541` |
| Property Overview / Notes / Mobile | `6203:1693` |
| Property Overview / Parkings / Mobile | `6203:1845` |
| Property Overview / Assets / Mobile | `6203:2007` |
| Add Property / Mobile | `6240:2084` |

### Units
| Frame | nodeId |
|---|---|
| Unit List / Mobile | `6247:2215` |
| Add Unit / Mobile | `6248:2428` |
| Unit Overview / Mobile | `6275:2556` |
| Unit Overview / Financials / Mobile | `6288:2543` |
| Unit Overview / Inventory / Mobile | `6288:2724` |
| Unit Overview / Work Orders / Mobile | `6288:2894` |
| Unit Overview / Attachments / Mobile | `6288:3245` |
| Unit Overview / Legal / Mobile | `6288:3414` |
| Unit Overview / Parkings / Mobile | `6288:3576` |
| Unit Overview / Notes / Mobile | `6288:3738` |
| Unit Overview / Broadcasts / Mobile | `6288:3900` |
| Unit Overview / Inspections / Mobile | `6288:4070` |

### Rooms
| Frame | nodeId |
|---|---|
| Room List / Mobile | `6360:3312` |
| Room Overview / Mobile | `6367:3385` |
| Room Overview / Financials / Mobile | `6367:3697` |
| Room Overview / Inventory / Mobile | `6367:3877` |
| Room Overview / Work Orders / Mobile | `6367:4062` |
| Room Overview / Attachments / Mobile | `6367:4236` |
| Room Overview / Legal / Mobile | `6367:4413` |
| Room Overview / Notes / Mobile | `6367:4587` |
| Room Overview / Broadcasts / Mobile | `6367:4753` |
| Room Overview / Inspections / Mobile | `6367:4919` |
| Room Overview / Parkings / Mobile | `6482:5729` |
| Add Room / Mobile | `6297:4142` |

### Leases
| Frame | nodeId |
|---|---|
| Lease Management / Mobile | `6707:3750` |
| Add Lease / Mobile | `6549:3531` / `6564:6784` |
| Lease Overview / Mobile | `6763:4553` |
| Lease Tenant / Mobile | `6715:3750` |
| Lease Financials / Mobile | `6768:4553` |
| Lease Cheques / Mobile | `6739:3896` |
| Lease Units / Mobile | `6739:4065` |
| Lease Work Orders / Mobile | `6739:4207` |
| Lease E-Documents / Mobile | `6740:4115` |
| Lease Notices / Mobile | `6740:4272` |
| Lease Attachments / Mobile | `6740:4438` |
| Lease Legal / Mobile | `6743:4334` |
| Lease Notes / Mobile | `6743:4515` |
| Lease Inspections / Mobile | `6743:4690` |

### Contacts
| Frame | nodeId |
|---|---|
| All Contacts / Mobile | `6788:4553` |
| Tenants / Mobile | `6788:4744` |
| Landlords / Mobile | `6789:4699` |
| Vendors / Mobile | `6789:4902` |
| New Tenant / Mobile | `6794:5154` |
| Add Landlord / Mobile | `6793:4845` |
| Add Vendor / Mobile | `6794:4918` |
| Landlord Overview / Mobile | `6827:5502` |
| Vendor Overview / Mobile | `6847:6305` |
| Support Technician Overview / Mobile | `6859:7181` |

### Modals / chrome (mobile)
| Frame | nodeId |
|---|---|
| Chrome / Mobile Bottom nav | `6315:3197` |
| Nav / Spec | `6316:3144` |
| add document | `6403:4077` |
| New Common Area / Mobile Modal | `6418:4079` |
| New Note / Mobile Modal | `6418:4080` |
| New Parking / Mobile Modal | `6445:3458` |
| New Inventory / Mobile Modal | `6536:6582` |
| Add Occupants / Mobile Modal | `6568:3677` |
| Record Receipt / Mobile Modal | `6777:4553` |
| Add User / Mobile Modal | `6816:5502` |
| Add Emergency Contact / Mobile Modal | `6816:5570` |
| Add Asset / Mobile | `6421:3312` |
| Create Broadcast / Mobile | `6427:3385` |
| Add Tenant / Mobile | `6344:3362` |

---

## Created in this chat (Figma only — no app chrome)

### Landlord Contracts / Mobile
- **Source desktop:** [landlord contract](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1798-55646) → `1798:55646` (Web Portal)
- **New mobile frame:** [Landlord Contracts / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6908-7144) → `6908:7144`
- **Includes:** list with Start/End Date rows (no arrow), chips, search, cards, chrome

### Landlord Contract Details / Mobile
- **Source desktop:** [landlord contract- overview](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1912-54476) → `1912:54476`
- **Related:** financial `1930:64477`, signature `1937:70887`
- **New mobile frame:** [Landlord Contract Details / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6912-111102) → `6912:111102`
- **Includes:** breadcrumb, title + Active, Print/Action, Overview tabs, summary, Contract Information, Associated Party, Timeline, Financial Snapshot, Properties/Units/Rooms, Commissions, Files

### Add Landlord Contract / Mobile
- **Source desktop:** [add landlord contract](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1943-87746) → `1943:87746`
- **New mobile frame:** [Add Landlord Contract / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6918-7400) → `6918:7400`
- **Placement:** next to Landlord Contract Details / Mobile
- **Includes:** New Contract header, Preview/Save, Contract Summary (Draft), Landlords, Properties/Units/Rooms selectors + chips, Contract Information, Duration (Start/End), Payment Schedule (fees + income cards), Commission Details, Custom Fields, Notes/Attachments, footer actions

### Add Payment / Mobile Modal
- **Source desktop:** [Add Payment](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1997-57478) → `1997:57478`
- **New mobile frame:** [Add Payment / Mobile Modal](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6946-7473) → `6946:7473`
- **Placement:** next to Add Landlord Contract / Mobile
- **Includes:** close icon, title/subtitle, Inclusive Tax checkbox, Amount, Account, Due On, Invoice Number, Recurring Cycle, Tax Profile, Interval, Post, Money Held By, Payment Via, Memo, Close/Save — stacked single-column for mobile

### Vendor Contracts (full set)
Desktop sources (Web Portal):
- List: [Vendor contract](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1937-74204) → `1937:74204`
- Overview: [Vendor Contracts- overview](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1941-75281) → `1941:75281`
- Financials overview: [Vendor Contracts- overview](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=1941-80702) → `1941:80702`
- Add: [add vendor contract](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2008-63449) → `2008:63449`

Mobile frames (Responsive page, row below landlord contracts ~y 28922):
| Screen | nodeId | Link |
|---|---|---|
| Vendor Contracts / Mobile | `6950:7473` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6950-7473) |
| Vendor Contract Details / Mobile | `6950:7697` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6950-7697) |
| Vendor Contract Details / Financials / Mobile | `6950:7958` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6950-7958) |
| Add Vendor Contract / Mobile | `6950:8219` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6950-8219) |

### Mobile Menu (from sidebar menu `441:449`)
- **Source:** [sidebar menu](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=441-449) → `441:449`
- **Collapsed drawer:** [Mobile Menu / Drawer](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6959-10394) → `6959:10394` — all top items + › on parents with submenus
- **All expanded:** [Mobile Menu / All Expanded](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6959-10036) → `6959:10036` — every submenu open
- **Phone overlay:** [Mobile Menu / Overlay on Phone](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6959-10590) → `6959:10590`

Submenus included: Properties, Contacts, Contracts, Accounting, Commissions, Bookings, Community, Facility, Inspections (+ Settings).

### Accounting / Invoices (mobile suite)
Desktop sources (Web Portal):
- List: [Invoices](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=5771-104508) → `5771:104508`
- Details: [Invoice Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2120-63313) → `2120:63313`
- New Invoice: [New Invoice](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2264-66629) → `2264:66629`
- Add Line Item: [Add Line Item](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2110-62823) → `2110:62823`
- Add Cheque: [Add Cheque](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2110-62401) → `2110:62401`

Mobile frames (Responsive page, ~y 28477, left of vendor contracts):
| Screen | nodeId | Link |
|---|---|---|
| Invoices / Mobile *(redesigned from desktop `5771:104508`)* | `6963:7765` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6963-7765) |
| Invoice Details / Mobile *(redesigned from desktop `2120:63313`)* | `6963:7989` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6963-7989) |
| New Invoice / Mobile *(redesigned from desktop `2264:66629`)* | `6963:8228` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6963-8228) |
| Add Line Item / Mobile Modal *(from desktop `2110:62823`)* | `6993:8061` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6993-8061) |
| Add Cheque / Mobile Modal *(from desktop `2110:62401`)* | `6993:8113` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6993-8113) |

Includes: KPI strip (Total/Paid/Outstanding/Overdue), status chips (All/Paid/Pending/Overdue/Draft), invoice cards, details sections (info/amounts/line items/cheques/transactions), New Invoice form sections, Add Line Item + Add Cheque stacked mobile modals.

### Accounting / list pages (mobile)
Desktop sources (Web Portal):
- Expenses → `2238:61950`
- Credit Notes → `2273:67323`
- Cheques → `2449:79763`
- Chart of Accounts → `2275:69038`

Mobile frames (Responsive page, row y≈32000):
| Screen | nodeId | Link |
|---|---|---|
| Expenses / Mobile *(redesigned from desktop `2238:61950`)* | `7012:8276` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7012-8276) |
| Credit Notes / Mobile *(redesigned from desktop `2273:67323`)* | `7007:8276` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7007-8276) |
| Cheques / Mobile *(redesigned from desktop `2449:79763`)* | `7004:8276` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7004-8276) |
| Chart of Accounts / Mobile *(redesigned from desktop `2275:69038`)* | `7023:8422` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7023-8422) |

COA mobile mirrors desktop `2275:69038`: title/subtitle, Add Account, type chips (All/Asset/Equity/Expense/Liability/Income), Search by name + Filter/Column, 5 cards (types Asset→Income; Sub Account Yes then No×4; shared ID/name/account fields from source), pagination “Showing 1 to 5 of 5 records” / “Page 1 of 12”.

Cheques mobile redesign (from `2449:79763`): Export CTA, full status chips (All→Redeposited), 3 KPI cards with hints, Search + Column, 4 cards CHQ-001…004 with exact bank/status/In Hand/Returned/bounce fields, pagination “Showing 1 to 4 of 4 records” / “Page 1 of 1”. Replaces prior `6996:8316`.

Credit Notes mobile redesign (from `2273:67323`): “View all the Credit Notes”, Issue Credit Note CTA, Search by name + Filter/Column, **no** status chips/KPIs (hidden on desktop), 5 cards with ID 1817909 / Contact / Amount AED 1,000.00 / Available Balance AED 0.00 (green) / Date 53443 / Account / Notes / Created By / Created, pagination “Showing 1 to 5 of 5 records” / “Page 1 of 12”. Replaces prior `6996:8155`.

Expenses mobile redesign (from `2238:61950`): title **Expense**, Export + Create Expense, chips All→Bounced (no Pending Approvals), 4 KPIs (no hidden hints), Search by name + Filter/Column, 5 cards (Unpaid/Paid/Draft/Unpaid/Overdue) with exact bill/unit/lease/cheque/account/bank/dates + Created By Manager — **no** Atif Shahzad (hidden). Replaces prior `6996:7984`.

Chart of Accounts mobile redesign (from `2275:69038`): Add Account, chips All→Income, Search by name + Filter/Column, 5 cards Asset→Income with Sub Account Yes/No badges, Liability type as solid red badge — replaces prior `6997:8203` → `7023:8422`.

### Accounting / New Expense (mobile)
- **Source desktop:** [Add Expense](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2264-68021) → `2264:68021`
- **New mobile frame:** [New Expense / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7017-8276) → `7017:8276`
- **Placement:** below Expenses / Mobile on Responsive (~y 35363)
- **Includes:** New Expense + Draft, breadcrumb, Cancel/Preview/Save Expense, Due Amount summary (AED 0.00), Customer & Property Details, Invoice Details, Cheque Details (+ Add Cheque card CH-2531), Line Items (+ Add Line Item), Others (Notes/Attachments), footer Cancel / Accept Expense / Save Expense

### Accounting / Expense Overview (mobile)
- **Source desktop:** [Expense - overview](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2267-60176) → `2267:60176`
- **New mobile frame:** [Expense Overview / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7020-8349) → `7020:8349`
- **Note:** Desktop frame is named Expense overview; visible chrome/copy matches Invoice Details layout in source (title “Invoice Details”, breadcrumb Accounting / Invoice / Details) — mobile keeps that exact visible content.
- **Includes:** Accept/Action/Print, summary Invoice - 1818508, Information/Due Amount AED 3000.00, Invoice Information, Quickbooks Status, Notes/Attachment/Custom Fields, Invoice Overview + Cheques + Transactions + Penalties cards

### Accounting / Chart of Accounts Details (mobile)
- **Source desktop:** [Chart of Accounts - Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2321-60807) → `2321:60807`
- **New mobile frame:** [Chart of Accounts Details / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7027-8422) → `7027:8422`
- **Placement:** next to Chart of Accounts / Mobile (`7023:8422`) on Responsive (~y 29114)
- **Includes:** title Muhammad Junaid, breadcrumb Accounting / Chart of Accounts / Account Details, **no** Edit Account (hidden on desktop), 3 KPIs (Current Balance AED 54.84M / Account Number AED 51.27M / Total Transactions AED 3.57M — hints omitted), Search by name + Filter/Column, 5 transaction cards (Invoice ID 1817909, Paid×4 + Unpaid×1, Description/Cheque Details `-`, Contact Muhammad Junaid, Cheque/Paid Date 08-07-2026, Debit/Created AED amounts matching source), pagination “Showing 1 to 5 of 5 records” / “Page 1 of 12”

### Accounting / Add Chart of Accounts (mobile)
- **Source desktop:** [Add chart of acc](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2321-61849) → `2321:61849`
- **New mobile frame:** [Add Chart of Accounts / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7033-8495) → `7033:8495`
- **Placement:** next to Chart of Accounts Details / Mobile (`7027:8422`) on Responsive (~y 29114)
- **Includes:** New Account title, breadcrumb Accounting / Chart of Account / New Account (singular as source), Cancel + Create Account (top + footer), Account details card + subtitle, Sub account toggle ON + helper copy, fields Parent account * / Account * / Account Type * (stacked) / Account Name * / Account Number * / Remote GL Code / Description with Select/Enter placeholders

### Accounting / Reports (mobile)
- **Source desktop:** [Account > Reports](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2337-63538) → `2337:63538`
- **New mobile frame:** [Accounting Reports / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7037-8568) → `7037:8568`
- **Placement:** next to Add Chart of Accounts / Mobile (`7033:8495`) on Responsive (~y 29114)
- **Includes:** Accounting Reports title + subtitle, Search by name, Report library heading, 9 stacked cards (P&L, Balance Sheet, Cash Flow, Trial Balance, Accounts Receivable, General Ledger, Management Income, Journal Entry, Annual Cash Flow) with exact descriptions + View Report — **no** “Updated today” (hidden on desktop)

### Accounting / Reports / Income Statement (mobile)
- **Source desktop:** [Account > Reports > Income Statement](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2350-65161) → `2350:65161`
- **New mobile frame:** [Income Statement / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7042-8641) → `7042:8641`
- **Placement:** next to Accounting Reports / Mobile (`7037:8568`) on Responsive
- **Includes:** Income Statement title, breadcrumb Accounting / Report / Income Statement, Orville Real Estate LLC, From date / End Date (DD/MM/YYYY) + Apply Filter / Cancel, 3 KPIs (Total income AED 812,122.00 / Total expenses AED 0.00 / Net operating income AED 812,122.00 with hints), Income statement period 01 Jun 2026 – 10 Jul 2026, Income (Revenue / -  Rental Income / Total Income), Expenses (Operating costs / empty message / Total expenses AED 0.00), Net operating income highlight row

### Accounting / Reports / Balance Sheet (mobile)
- **Source desktop:** [Account > Reports > Balance sheet](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2364-67270) → `2364:67270`
- **New mobile frame:** [Balance Sheet / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7049-8714) → `7049:8714`
- **Placement:** next to Income Statement / Mobile (`7042:8641`) on Responsive
- **Includes:** Balance sheet title + breadcrumb, Orville Real Estate LLC, date filters + Apply Filter / Cancel, KPIs Total assets AED 882,676.00 / Total liabilities AED 70,870.00 / Net assets AED 811,806.00, statement period 01 Jun 2026 – 10 Jul 2026, Assets (Cash & Bank 7 names + Current Assets rows with red negatives), Liabilities (Overhead Expense / Security Deposits Liability), Equity (Total equity AED 0.00), Assets less liabilities and equity AED 811,806.00

### Accounting / Reports / Accounts Receivable Report (mobile)
- **Source desktop:** [Account > Reports > Accounts Receivable Report](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2378-68963) → `2378:68963`
- **New mobile frame:** [Accounts Receivable Report / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7055-8787) → `7055:8787`
- **Placement:** next to Balance Sheet / Mobile (`7049:8714`) on Responsive
- **Includes:** Accounts Receivable Report title + breadcrumb, square back (r8), Orville Real Estate LLC, From date / End Date with desktop calendar-week icons + Apply Filter / Cancel, Accounts receivable summary for 01 Jun 2026 – 10 Jul 2026, Account/Balance columns, Accounts Receivable - Rent AED 2,859,807.00, Total for All, Net Total highlight

### Accounting / Reports / Cash Flow Statement (mobile)
- **Source desktop:** [Account > Reports > Cash Flow Statement](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2364-68189) → `2364:68189`
- **New mobile frame:** [Cash Flow Statement / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7059-8860) → `7059:8860`
- **Placement:** next to Accounts Receivable Report / Mobile (`7055:8787`) on Responsive
- **Includes:** Cash Flow Statement title + breadcrumb, square back, desktop calendar icons, 4 KPIs (Operating AED 811,806.00 / Investing AED 0.00 / Financing AED 70,570.00 / Net increase AED 882,376.00), full Operating/Investing/Financing line items (exact AED0.00 / 0.00 typos preserved), Net Increase in Cash AED 811,806.00 footer

### Accounting / Reports / Trial Balance Report (mobile)
- **Source desktop:** [Account > Reports > Trial balance report](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2385-70088) → `2385:70088`
- **New mobile frame:** [Trial Balance Report / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7061-8933) → `7061:8933`
- **Placement:** next to Cash Flow Statement / Mobile (`7059:8860`) on Responsive
- **Includes:** Trial balance report title + breadcrumb, Export, square back, desktop calendar icons, KPIs Total debit AED 907,536.00 / Total credit AED 3,960,157.00 / Net balance AED 3,052,621.00, Search + Filter/Column, 5 account cards (Asset/Equity/Expense/Liability/Income type badges) with Debit/Credit/Balance, pagination Showing 1 to 5 of 5 / Page 1 of 12

### Accounting / Reports / General Ledger (mobile)
- **Source desktop:** [Account > Reports > General Ledger](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2394-71639) → `2394:71639`
- **New mobile frame:** [General Ledger / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7065-9006) → `7065:9006`
- **Placement:** next to Trial Balance Report / Mobile (`7061:8933`) on Responsive
- **Includes:** General Ledger title + breadcrumb, square back, desktop calendar icons, KPIs Total debit AED 48,659,893.00 / Total credit AED 56,019,624.47 / Net balance AED 7,359,731.47, Trial balance by account group period 01 Jun 2026 – 10 Jul 2026, Assets (5) / Liabilities (4) / Expenses (2) / Income (4) sections with Debit/Credit/Balance cards (red negatives)

### Accounting / Reports / Management Income (mobile)
- **Source desktop:** [Account > Reports > Management Income](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2399-73172) → `2399:73172`
- **New mobile frame:** [Management Income / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7069-9079) → `7069:9079`
- **Includes:** Management Income title + breadcrumb, Orville Real Estate LLC, Management Income / Balance row AED 2,859,807.00, Total Income, Net Income highlight

### Accounting / Reports / Journal Entry (mobile)
- **Source desktop:** [Account > Reports > Journal Entry](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2399-73946) → `2399:73946`
- **New mobile frame:** [Journal Entry / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7069-9178) → `7069:9178`
- **Includes:** Journal Entry title + breadcrumb, date filters + calendar icons, KPIs Journal entries 10 / Total debits AED 5,800.00 / Total credits AED 5,800.00, Journal entry register with 7× Invoice Payment — Line Item 1798820 groups (Receivable Debit / Liability Credit AED 500.00, 07-01-2026)

### Accounting / Reports / Annual Cash Flow Overview (mobile)
- **Source desktop:** [Account > Reports > Annual Cash Flow Overview](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2408-74857) → `2408:74857`
- **New mobile frame:** [Annual Cash Flow Overview / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7069-9372) → `7069:9372`
- **Includes:** Annual Cash Flow Overview title + breadcrumb, Financial year 2026 Year select, Annual cash flow by account, Income section (7 accounts + Total for Income) and Liability (Security Deposits Liability + Total) with Total + Jan–Dec 2026 values as cards

### Commissions (mobile)
- **Source desktop:** [Commissions](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2458-82259) → `2458:82259`
- **New mobile frame:** [Commissions / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7081-9298) → `7081:9298`
- **Includes:** Commissions + Manage and view all commissions, Export, chips All / Tenant Commissions (0) / Landlord Commissions (2), Search + Filter/Column, 4× C001 cards, Showing 1 to 4 of 4 / Page 1 of 1

### Commissions / Details (mobile)
- **Source desktop:** [Commissions > Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2462-88702) → `2462:88702`
- **New mobile frame:** [Commission Details / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7081-9493) → `7081:9493`
- **Includes:** Commission Allocations, Commission #31658 details, Company/Percentage tabs, Commissionable Lease - 73778, Company + Agent Commissions tables (3215/3216 Safvan M AED 140.00)

### Collection Requests (mobile)
- **Source desktop:** [Collection Requests](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2559-66426) → `2559:66426`
- **New mobile frame:** [Collection Requests / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7081-9674) → `7081:9674`
- **Note:** Desktop visible title is still “Commissions” / “Manage and view all commissions” (source copy) — mobile keeps exact visible text; tabs/rows are Collection Request data.
- **Includes:** Export, chips All/Pending/Received/Processed/Rejected, 4 cards ID 32153 with status badges, Showing 1 to 4 of 4 / Page 1 of 1

### Collection Request Details (mobile)
- **Source desktop:** [Collection Requests > Detail](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2559-68175) → `2559:68175`
- **New mobile frame:** [Collection Request Details / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7081-9849) → `7081:9849`
- **Includes:** Collection Request #31 Pending, Information fields, Invoice Information INV - 3215 / Marina Heights Tower / Apartment 209- PR-2 / 06-07-2026

### Reports Library (mobile)
- **Source desktop:** [Reports](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=3386-152154) → `3386:152154`
- **New mobile frame:** [Reports Library / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7081-9975) → `7081:9975`
- **Includes:** Reports, 50 reports available, chips All Reports/Financial/Rental/Misc, Search, 18 stacked Generate Report cards (visible Financial + Rental set from source)

### Reminders (mobile suite)
Desktop sources (Web Portal):
- List: [Reminders](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2469-100318) → `2469:100318`
- Details: [Reminders > Detail](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2485-110359) → `2485:110359`
- Add modal: [Add Reminder](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2559-74209) → `2559:74209`

Mobile frames (Responsive, next to Reports Library):
| Screen | nodeId | Link |
|---|---|---|
| Reminders / Mobile | `7085:9663` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7085-9663) |
| Reminder Details / Mobile | `7085:9835` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7085-9835) |
| Add Reminder / Mobile Modal | `7087:9882` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7087-9882) |

List: Export + Add Reminder, Search/Filter/Column, 4 cards (32153 titles/priorities/statuses/dates). Details: Rent overdue follow-up Pending, Reminder Detail fields, Assigned Users Olivia Green. Modal: standalone popup (close icon above white card, no phone chrome) matching Add Cheque pattern — Reminder users, Reminder details, recurring/pause, upload, Close/Save.

### Broadcasts (mobile suite)
Desktop sources (Web Portal):
- List: [Broadcasts](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2572-66308) → `2572:66308`
- Details panel: [Broadcasts > Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2585-69600) → `2585:69600`
- Recipients panel: [Broadcasts > Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2588-77400) → `2588:77400`
- Create/Edit form: [Broadcasts > Details](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2597-79614) → `2597:79614`

Mobile frames (Responsive, near Reminders):
| Screen | nodeId | Link |
|---|---|---|
| Broadcasts / Mobile | `7091:113584` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7091-113584) |
| Broadcast Details / Mobile (Desktop preview tab) | `7091:113889` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7091-113889) |
| Broadcast Details / Mobile (Mobile preview tab) | `7120:11151` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7120-11151) |
| Create Broadcast / Mobile (existing) | `6427:3385` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=6427-3385) |

Rebuilt 2026-09-28 to exact desktop content (first pass had invented data — never do that).
List: Broadcasts / Manage and view all Broadcasts, Export + "+ Add Broadcasts", Search/Filter/Column, 10 cards = exact desktop rows (31658, subject, Published/Draft chip, dots action, Quick View w/ eye icon, Broadcast Type, Sendable, Scheduled Yes/No chip, Date 12-01-2026, Created At 10-01-2026, 09:14, Updated At 12-01-2026, 13:06), Show 10 · Showing 1 to 10 of 120 records · Page 1 of 12 · 1 2 3 4 5 … 12.
Details: back + Broadcast Details + Broadcasts / **Details**, Send Now + Edit Broadcast; left panel cloned from desktop `2585:74716` (Broadcast - Lease Agreement, Recipient: Deal, Draft, View Activity, Information, Broadcast Details Id/Subject/Status/Type/Schedule/Created at/Last Updated, Schedule & Delivery Time 12:34 (GMT+04:00) Abu Dhabi); Broadcast template header + Tenancy Contract card cloned from `2585:70705`/`2585:76795`, grids reflowed to vertical + wrapping rows. Mobile-tab variant uses phone mockup cloned from `2822:164219` (scaled to 300w).

### Space (Bookings > Spaces)
- **Source desktop:** [Space](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2658-86713) → `2658:86713`
- **Related desktop:** Space > Details month `2667:96726`, week `2679:100709`, day `2683:102518`, Attachment `2683:109637` (mobile versions below)
- **New mobile frame:** [Space List / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7124-10316) → `7124:10316` (x 5317, y 35459, next to Broadcast Details)
- **Includes:** Space / Manage and view all Space, + Add Space, Search/Filter/Column, 10 cards = exact desktop rows (31658, Active/Inactive chip, action dots, Skyline Meeting Room, Level 18, Marina Heights, Dubai, Availability Option chip — Weekdays/Closed(red)/Custom Days/Indefinite into Future, Slot Duration 2 hours, Date Range 14-07-2026 - 22-07-2026, Enable Payment Enabled(navy)/Disabled chip, Phone +971504892110, Email skyline@orville.ae, Property Marina Heights Tower + Unit Apartment-18-MR-1 as blue links, Create At 14-07-2026), Show 10 · Showing 1 to 10 of 120 records · Page 1 of 12.

#### Create Space (mobile)
- **Source desktop:** [Create a new bookable space](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=2683-105256) → `2683:105256`
- **Mobile:** [Create Space / Mobile](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7144-10393) → `7144:10393` (x 1620, y 39692, right of Space Details Attachments)
- Built by cloning Create Broadcast / Mobile `7110:9772` (create-form pattern: back link, 22px title, breadcrumb, 14px-padded section cards, 42px inputs, toggles, rich editor, upload zone, footer). Phone field from Add User modal `6816:5550`, checkbox from Add Payment modal `6946:7482`.
- Content: ← Spaces, Create a new bookable space, Bookings / Spaces / Create, Cancel + Save Space (top + footer); Space information (Space name *, Space Location *, Phone Number * with 🇦🇪 +971, Email, Description textarea — all "Enter"); Location (Property / Unit Select + desktop `chevron-down 5` icon `2683:106029`, also used on Slot duration and phone country picker — never use the ▾ text glyph); Availability schedule + Copy Monday to all (Start Date / End Date DD/MM/YYYY, Slot duration Select, Monday…Sunday checked checkbox + --:-- -- to --:-- --); Rules (Details editor, "Write the note content here..."); Primary image (Drop your image here or Browse, ↑ Upload); Payments (Slot Price Enter, Enable Payment toggle / Allow payment for this space). Desktop right column (Primary image, Payments) stacked after left column.

### Reservations (Bookings > Reservations)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Reservation List / Mobile | `2702:117635` | `7155:11372` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7155-11372) |
| Reservation Details / Mobile | `2718:120678` | `7155:12820` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7155-12820) |
| New Reservation / Mobile | `2699:114036` | `7155:13278` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7155-13278) |
Placed y 39692 at x 3030 / 3500 / 3970.
- List (cloned Space List / Mobile): Reservations / Manage and view all your Reservations, + New reservation, Search/Filter/Column, 10 cards (31658 + dots, Meeting Room A, Reserve Omar Al Mansoori, Space Skyline Meeting Room (semibold), Lease L-31942, Time 6:00 PM – 8:00 PM, Booking Date 14-07-2026, Phone Number +971504892110, Email skyline@orville.ae, Create At 14-07-2026), Show 10 (chevron icon) · Showing 1 to 10 of 120 records · Page 1 of 12 · 1 2 3 4 5 … 12. No status column on desktop → no chip.
- Details (cloned Space Details Attachments frame, details pattern, no tabs — desktop has none): ← Booking / Reservation, Reservation Details, Booking / Reservation / Details, Action ▾; Summary Meeting Room A + Confirmed (navy), Reservation #315, View Activity + Edit Reservation; Information; Property & Unit; Reservation Details KV (ID, Reservation Name, Reserve, Space Name, Lease Lease-201, Phone, View more details, Email, Booking Date, Time 6.00 PM to 8.00 PM, Slot Duration, Created, Status Confirmed, Approved Approved chips); Space Details / Manage space details and operations + one list card (31658, Space Name, Space Location, Availability Option Weekdays, Slot Duration, Date Range + Active, Enable Payment Disabled, Phone, Email, Property/Unit links, Create At).
- New (cloned Create Space / Mobile): ← Reservation, New Reservation, Bookings / Reservation / New Reservation, Cancel + Book Reservation (top + footer); Skyline Meeting Room card (Level 18…, 2 Hours + AED 1500.00 pills, Select date + desktop calendar `2699:114518` reflowed full-width with SPACE_BETWEEN columns, Tuesday, July 14 + Morning/After Noon/Evening slot groups cloned from desktop); Reservation Details form (Contact *, Reserve Name *, Email *, Phone Number, Status select); Reservation summary (desktop rows `2699:116044`: Space, Date 14 July 2026, Time 2:00 PM – 4:00 PM, Duration 2 hour, Status Confirmed, Total AED 1500.00, info note).

### Events (Community > Events)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Event List / Mobile | `2773:125219` | `7162:11597` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7162-11597) |
| Event Details / Mobile | `2775:136405` | `7163:114624` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7163-114624) |
| New Event / Mobile | `2775:130407` | `7164:10873` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7164-10873) |
Placed y 39692 at x 4440 / 4910 / 5380. Desktop "Event preview" `2782:141636` is already a phone-sized modal (Event Information / Join Event) — no mobile rebuild needed. Small desktop dropdowns: `2780:141548` action dropdown, `2775:136281` select-event sendable.
- List (cloned Reservation List / Mobile): Events / Manage and view all Events, + Add Events, tab chips All / Published (0) / Draft (2) (cloned Commissions chips `7081:9348`, texts set WIDTH_AND_HEIGHT so chips hug), Search/Filter/Column, 10 cards = desktop rows (ID 658, Draft grey `Chip / Inactive` or Published navy `Chip / Active` + dots; names Fire Drill, Water Tank Cleaning, Pest Control, Elevator Maintenance, Fire Drill, Pest Control, Elevator Maintenance, Water Tank Cleaning, Pest Control, Water Tank Cleaning; Location Level 18, Marina Heights, Dubai full-width; Date 14-07-2026; Max Attendance navy chip 100), Show 10 · Showing 1 to 10 of 120 records · Page 1 of 12.
- Details (cloned Reservation Details / Mobile): ← Community / Events, Event Details, Community / Events / Details, Preview + Action ▾ (both outline, 50/50); Summary Fire Drill + grey Draft chip, Location, View Activity + Edit Event; Information; KV cards without dots (desktop has none): Property (Target Property, Property Dubai Marina, Tower A, Dubai link), Event Information (ID 31658, Event Name Fire Drill, Event Date 14-07-2026, Start Time 10.00, End Time 13:00), Attendance (Attendees 31658, Max Attendees Fire Drill, Created/Updated 14-07-2026), Contact (Email Event@mail.com, Phone +971589652235); section "Attendees" + empty state card cloned from desktop `2775:139723` (users icon, No attendees found, No attendees are registered for this event.).
- New (cloned Create Space / Mobile): ← Events, New Event, Community / Events / New Event, Cancel + Create Event (top + footer); Event Information (Event Name *, Location *, Description textarea "Write the note content here..."); Date & Time (Event Date * DD/MM/YYYY with desktop calendar-week icon `2775:135679`, Start Time / End Time --:-- -- with desktop clock icon `2775:135749`); Contact Information (Email, Phone Number 🇦🇪 +971); Event Image (desktop block `2775:135788` cloned: Attachments, upload icon, Add event image, Drop your image here or Browse, gold Upload Image, helper No image selected…); Event Settings (Max Attendance Enter, Sendable to Property select, Property Select Property select — chevron icons). Pitfall: sections cloned from Availability schedule keep fixed-height children → set children HUG.

### Promotions (Community > Promotions)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Promotion List / Mobile | `2791:142281` | `7173:10946` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7173-10946) |
| Promotion Details / Mobile | `2794:149544` | `7173:118421` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7173-118421) |
| New Promotion / Mobile | `2791:145112` | `7174:11092` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7174-11092) |
Placed y 39692 at x 5850 / 6320 / 6790.
- List (cloned Event List / Mobile): Promotions / Manage and view all Promotions, + Add Promotion, All / Published (0) / Draft (2), 10 cards (658, Draft/Published chip + dots, names Resident Exclusive Discount → Long-Term Booking Discount in desktop order, Code 213, Start Date 15-07-2026, End Date 23-07-2026), pagination Showing 1 to 10 of 120 records / Page 1 of 12.
- Details (cloned Event Details / Mobile; no summary/tabs — desktop has none): ← Community / Promotions, Promotion Details, Community / Promotions / Details, Preview + Action ▾; KV cards Basic Information (Promotion Name, Promotion Code RES2024, Status Active navy chip, Promotion Category Discount), Targeting (Contacts All Residents, Property Sunset Apartments, Select Project Tower A), Promotion Information (Description stacked paragraph, Offer 15% Off, Promo Code RES2024), Date & Time (15-07-2026 / 30-09-2026), Location Information (123 Sunset Boulevard, United Arab Emirates, Dubai, Dubai), Event Image (Promotion Banner + desktop image `2811:162715` 150h FILL crop).
- New (cloned New Event / Mobile): ← Promotions, New Promotion, breadcrumb, Cancel + Create Promotion; Targeting (Sendable to Property, Property Select Property); Promotion Information (Promotion Name *, Promotion Code *, Description rich editor with desktop toolbar `2791:147746` set to WRAP, Promotion Category Select | Promotion Order Enter, Photo upload "Add image" (no helper), Status Select); Date & Time (Start/End Date calendar icons, desktop checkboxes Schedule Promotion ✓ / Highlight Promotion `2791:148694`/`148701`); Location Information (Address 1 Enter address, Country with desktop flag + United Arab Emirates `2791:148734`, City Select | Zip Code Enter, Phone Number, Link Enter Promotion Link); Event Image (same as New Event); App Preview heading + desktop phone `2811:163328` rescaled to 358w, stacked after form. Pitfall: desktop "Event preview" frame `2791:148952` has hidden children at index 0/2 — remove hidden before indexing.

### Rules / Guides (Community > Rules/Guide)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Guide List / Mobile | `2800:156692` | `7180:11165` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7180-11165) |
| Guide Details / Mobile | `2824:75255` (named "Add Rules / guide") | `7180:118545` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7180-118545) |
| New Guide / Mobile | `2824:72411` | `7180:118724` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7180-118724) |
Placed y 39692 at x 7260 / 7730 / 8200. Small desktop dropdown `2824:76959` (action dropdown to Guide) not rebuilt.
- List (cloned Event List / Mobile; no tabs, no status chip — desktop has none): Guides / Manage and view all Guides, + Add Guides, Search/Filter/Column, 10 cards RG-101…RG-110 + dots (Pool Safety Rules, Parking Guidelines, Pet Policy, Noise Regulations, Gym Usage Rules, BBQ Area Rules, Visitor Policy, Move-in Guidelines, Recycling Guide, Emergency Procedures; Property + Date from desktop), pagination Showing 1 to 10 of 120 records / Page 1 of 12.
- Details (cloned Event Details / Mobile): ← Community / Guide, Guide Details, Community / Guide / Details, full-width Action ▾ only; Summary Pool Safety Rules / Dubai Marina, Tower A, View Activity + Edit Guide (no chip, no "Information" label); Property card (Property: Dubai Marina, Tower A, Dubai — plain, not link); Guide Information (ID 31658, Guide Name, Created, Updated 14-07-2026); Attachments + empty state with desktop paperclip icon (No attachments found / No files are attached to this guide).
- New (cloned New Promotion / Mobile): ← Guide, New Guide, Community / Guide / New Guide, Cancel + Create Guide; Guide Information (Name * Enter rule or guide name, Select Property * select Select property, Description with desktop toolbar); Files (Add files, or drop files to upload, Upload File — no label/helper, desktop has none; stacked after form).

### Guests / Visitors
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Visitors List / Mobile | `3189:92714` (Guest-list) | `7186:11640` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7186-11640) |
| Visitor Details / Mobile | `3202:97153` (Guest-list-details) | `7187:118767` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7187-118767) |
| New Visitor / Mobile | `3193:94544` (Add Guest-list) | `7188:11808` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7188-11808) |
Placed y 39692 at x 8670 / 9140 / 9610.
- List (cloned Event List / Mobile): Visitors / Manage and view all your visitors, + Add Visitor, "Lists" label, Search by name/Filter/Column, 5 cards (31658 + grey Not Checked-in chip + dots, Asad Ahmed; Email asadahmed23@mail.com | Phone Number +971566894232, Visiting Date 06-06-2026 | Visit Type Guest chip, Pass Code 05062027 | No.of Visitor 03, Property Marina Heights Tower | Unit Apartment-PR-01 (blue links), Contact Hasibur Rashid Mah | Created 06-06-2026 10.00 PM — includes desktop columns scrolled off-canvas), Showing 1 to 5 of 5 records, Page 1 of 12, pages ‹ 1 › only.
- Details (cloned Event Details / Mobile): ← Guests, Visitor Details, Guests / Visitor Details, Action ▾ only; Summary Asad Ahmed / Marina Heights Tower . Apartment-PR-01 + full-width View Activity; Information; cards Visitor Information, Visit (8 rows), Property & Unit (links), Status (Sent Pet Friendly / Code Not Used / Entry Not Checked-in grey chips), Relationships, Notes (stacked); "Visitor details and information" → Pass & system (UUID stacked) + QR code card (desktop QR `3215:104633` + caption). Desktop left panel is instance `3202:98313` (text overrides) — dump its texts directly.
- New (cloned Create Space / Mobile — keeps section subtitles): ← Guests, New Visitor, Guests / New Visitor, Cancel + Save Visitor; Visitor Information (Full Name *, Email Address *, Phone Number * +971 / Enter mobile number + helper), Visit Details (Visit Date * select, Number of Visitors * 1, Visit Type * Personal, Expected Duration select, divider, desktop radios One Time Validity ○ / Set Validity ●, Set Validity Not Set), Property & Unit (row), Relationships (Contact (Optional)), Notes textarea, Access Details stacked last (Access Pass Type QR Code grey select, desktop toggle `3200:97123` Parking Required ON, Vehicle Number). Values (1, Personal, Not Set, QR Code) dark text; placeholders muted.

### Legal (Litigations)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Litigation List / Mobile | `3251:104641` (Legal-list) | `7193:13401` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7193-13401) |
| Litigation Details / Hearings / Mobile | `3251:105442` (Legal-details > Hearing) | `7194:11676` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7194-11676) |
| Litigation Details / Notes / Mobile | `3270:116074` (Legal-details > Notes) | `7194:12093` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7194-12093) |
| Litigation Details / Attachments / Mobile | `3270:120198` (named "Legal-details > Notes" but shows Attachments tab) | `7194:12437` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7194-12437) |
| New Litigation / Mobile | `3274:129030` (New Legal) | `7197:11895` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7197-11895) |
Placed y 39692 at x 10080 / 10550 / 11020 / 11490 / 11960. Next free x **12430**.
- `3274:123997` is named "Legal-details > Hearing" but is actually Inspection Details (Inspection row) — not part of Legal.
- List (cloned Event List / Mobile): Litigations / Manage and view all your litigations, + Add Litigation, "List" label, tabs All/Open/Pending/Closed, Search by name/Filter/Column, 5 cards LC-1001..1005 (blue ID + status chip: Open grey, Closed red #C94A4A, Pending orange #D08A28 + dots; case name; Details; Legal Firm | Case Date; Escalation Option | Property (link); Unit (link) | Lease; Unit Blocked | Tenant Blocked (Yes navy chip / No outline chip); Hearings Count | Attachments Count (outline chips); Notes Count (outline) | Internal Statuses — all 16 desktop columns incl. off-canvas), Showing 1 to 5 of 5 records, Page 1 of 12, pages ‹ 1 ›.
- Details (cloned Event Details / Mobile): ← Legal, Litigation Details, Legal / Litigation Details, Action ▾ only; Summary Rent Recovery Case / Case #LC-1001 + View Activity | Edit Litigation →; Information; cards Visitor Information (desktop title kept; ID LC-001 … Status Open navy chip, Details stacked, Created, Last Updated), Property & Unit (links), Blocking Status (False navy chips), Custom Fields (italic "No custom fields configured yet"); then "Tab panel / <tab>": underline Tab row (from `6233:1921`) Hearings/Notes/Attachments, section header + outlined navy add button, Search + Column (no Filter, as desktop), cards, pagination ‹ 1 ›.
  - Hearings: Hearing list / + Add Hearing; card 31658 (no name) Date 22-07-2026 | Attachment "1 File" grey chip, Description; Showing 1 to 1 of 1 records, Page 1 of 1.
  - Notes: Notes / + Add Note; 2 cards 31658 + Via chip (Portal / Email grey), Subject as name, Content (desktop truncated text kept), Note Date | Created By, Files (#3E6FA8) | Created At, Updated At; Showing 1 to 2 of 2 records.
  - Attachments: Attachments / + Add Attachment; 2 cards ATT-1001 + Document Status chip (Active navy / Verified green #27865B), File Type as name, Doc ID | Issue Date, Expiry Date | Files ("1file" outline chip), Uploaded By | Share Landlord (Yes navy), Share Tenant (Yes navy) | Created At, Updated At.
- New (cloned New Event / Mobile): ← Legal, New Litigation, Legal/ New Litigation, Cancel + Create Litigation (top + footer); Case Information (Case Name * Enter Case Name, Legal Firm * Enter, Escalation Option select, Case Date * date icon DD/MM/YYYY, Claimed Amount / Collected Amount as AED + 0.00 (phone-row pattern), dashed group: Property | Unit selects row + Lease select); Case Details textarea (Enter Case Details); Status (Case Status Select Status); Blocking Status toggles (from New Visitor `7188:12190`) Block Unit ON / Block Tenant OFF (#EEEEF5, thumb left) with desktop descriptions. Right-column sections stacked after form.
- Pitfall: stacked KV rows need `layoutSizingVertical='HUG'`, align MIN and value `textAlignHorizontal='LEFT'` or text overlaps.

### Inspections (Inspection List + Templates)
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Inspection List / Mobile | `3274:122333` (Inspection-list) | `7214:12258` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7214-12258) |
| Inspection Details / Mobile | `3274:123997` (misnamed "Legal-details > Hearing") | `7215:12952` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7215-12952) |
| Image Preview / Mobile Modal | `3367:137522` | `7218:12187` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7218-12187) |
| New Inspection / Mobile | `3275:130581` | `7219:12187` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7219-12187) |
| Template List / Mobile | `3367:137937` (Template-list) | `7215:12041` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7215-12041) |
| Template Details / Mobile | `3380:145388` | `7220:12351` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7220-12351) |
| Create Template / Mobile | `3367:140386` (new-Template) | `7221:12623` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7221-12623) |

Placed y 31838 at x 4619 / 5089 / 5559 / 6029 / 6499 / 6969 / 7439 (same row as Visitors + Legal — user rearranged frames; the "next free x" values above are stale, compute free space first). Next free on this row x **7909**.
- List (clone of Litigation List): Inspections / Manage and track property inspections, + Add Inspection, List, tabs All/Scheduled/Not Scheduled, Search/Filter/Column; 8 cards 31658 + status chip (Completed #EEEEF5 dark text, Pending #D08A28 white) + dots, name Move Out; Type (grey chip Move Out) | Scheduled (Yes navy / No grey #EEEEF5); Property Marina Heights Tower | Unit 215-PR-1 (links); User Id 59838 (link) | Created 10-01-2026, 09:14. Showing 1 to 8 of 8 records, Page 1 of 1.
- Details (clone of Litigation Details): ← Inspection, Inspection / Inspection Details, Action ▾; Summary Move out + Completed chip, Inspection #31658, full-width View Activity; Information; Inspection Details (ID, Type Rent Recovery Case, Scope Smith & Partners, Scheduled Open navy chip, Date Time 10-07-2026, Note stacked), Property & Unit, Personnel (Inspector link, Phone), Summary (3 × "-"); Inspection items: Search + Column, 4 cards 31658 + dots: Cleanliness Clean / Condition Good chips (#F8F8FB + border), Notes, Images = cloned desktop thumbnail frames (3+2, 3+1, 2, 1), Qty 0 | Cost 0.00 inputs; Showing 1 to 4 of 4 records; Inspection Media empty state (desktop video icon `3367:137066`, No videos + caption); Signature card: Signed By Fahim Ahmed + dashed "Tenant signature" box, Inspector Hasibur Rashid Mah + "Inspector signature" box (stacked).
- Image Preview: desktop modal reflowed to 358w (close centred above card, Image 1 of 4, ‹ image 240×323 ›).
- New Inspection (clone of New Litigation): Cancel + Create Inspection top/footer; Inspection Information (Inspection Type * Select escalation, Inspection Date Time * DD/MM/YYYY H:M AM); Inspection Scope (3 stacked radio cards, Both selected #F8F8FB), Unit Information (Property | Unit row, Lease Select), Asset Information (Asset Select Asset); Additional Notes; Inspector (+ subtitle, Inspector * Select Inspector); Summary (7 KV rows; Both / 30-06-2026 bold).
- Template List (clone of Inspection List): Templates / Manage inspection templates and forms, button literally "+ Add Inspection" (as desktop), tabs All/Admin Template/User Template; 8 cards 31658 + dots, template name, Created By (Admin navy / User grey chip) | Created At 10-01-2026, 09:14 PM.
- Template Details (clone of Inspection Details): ← Template, "Template  / Template Details" (desktop double space kept), full-width navy Edit Template; Move Out Inspection / Template #31658; Template Details card (ID, Template Name, Create at, Created By Admin chip, Update Date); desktop `inspection-areas-card` `3384:152093` cloned + reflowed (header vertical, 2 accordions Marina Heights / Marina Height 2).
- Create Template (clone of New Inspection): Template information (+ subtitle, Template name * Enter + helper), Inspection structure (title row + desktop Add area btn, subtitle, desktop area card = parent of `3384:149933` reflowed; nested inputs made VERTICAL + HUG), Template summary (Template name -, Areas 1, Sections 1 + desktop Completion 85% bar `3380:145376`), Cancel + Save Template.
- Links: list add → New; cards → Details; thumbnails → Image Preview overlay (close = BACK); New back/Cancel → list, Create → Details; Template list add → Create Template, cards → Template Details; Template Details crumb → Template list, Edit → Create; Create back/Cancel → list, Save → Template Details; menu subs Inspection List / Templates List; flow start "Inspections".
- Pitfall: cloning Legal frames carries their reactions — clear content reactions with `setReactionsAsync([])` before relinking.

### Documents + Download Center
| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Document Center / Mobile | `3667:93499` (Document Center) | `7228:13409` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7228-13409) |
| Download Center / Mobile | `5016:94474` (Download Center) | `7229:13257` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7229-13257) |

Placed y 31838 at x 7909 / 8379 (after Inspections). Next free on this row x **8849**. The desktop row below (y 22149: Company Details, Brand Settings, Watermark, Shifts, Regional, Departments, Document Templates (+New), PDF Builder (+New), Mandatory Documents (+Add)) is **Settings**, not built.
- Document Center (clone of Inspection List): Document Center / View and manage documents across your organisation (no add button), Lists, 8 wrapped tabs All/Unit/Room/Property/Tenant/Lease/Item/WorkOrder, Filter items by Document ID / Filter / Column; 10 cards DOC-31658..31667 + Pending outline chip (#D08A28 text, no dots — desktop has no Action column), name as title; Document type | Attachment of (Tenant); Issue Date | Expiry Date (No Expiry Date outline chip #C94A4A); Shared With. Showing 1 to 10 of 1749 records, Page 1 of 1749, ‹ 1 2 3 4 5 … 12 ›.
- Download Center (clone of Document Center): Download Center / View and download generated reports and files, Lists (no tabs), Filter items by Report Name / Filter / Type; 10 cards Job Id + Completed green chip + desktop red trash `5020:94743` (Action); Document filename (desktop truncation kept) as title; Type (Excel/PDF #EEEEF5 chip) | Inspection Id; Unit | Generated By; Requested at. "—" empty values keep desktop #E4E4EC. Showing 1-10 of 17026 in total, Page 1 of 1703.
- Links: menu Row / Documents → Document Center, Row / Download → Download Center (all 4 menus); flow starts "Documents", "Download Center" (28 total). No details frames exist on desktop, so cards are unlinked.

### Archives (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/archives` → `src/app/components/archives/archives-list/archives.component.{html,ts}` + `archives.data.ts` (17 tabs; only Properties has rows; other tabs render italic "No archived records"). Icons imported from app SVGs (`assets/images/archives/restore.svg`, `work-order-detail/trash-red.svg`, `work-orders/download.svg|columns.svg|search.svg`) via `createNodeFromSvg`.
| Screen | Mobile nodeId | Link |
|---|---|---|
| Archives / Mobile (Properties tab) | `7234:12552` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7234-12552) |
| Archives / Empty (Units) / Mobile | `7235:12906` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7235-12906) |
| ~~Archives / Columns dropdown (Properties) / Mobile~~ | `7235:13146` | DELETED by user (2026-09-28) |
| ~~Archives / Columns dropdown (Other tabs) / Mobile~~ | `7236:12698` | DELETED by user (2026-09-28) |

Placed y 31838 at x 8849 / 9319 / 9789 (dropdowns stacked at 9789). Next free on this row x **10259**.
- List (clone of Inspection List): Archives / "Browse archived and deleted records — restore them or delete them permanently.", white Export button (download icon); 17 tabs in one clipped row with `overflowDirection HORIZONTAL` (Properties active … Work Orders); search "Search by name, address or city..." (truncates) + Columns (icon); "Select all on page" checkbox row (from the header checkbox aria-label); 2 cards: checkbox + PR-1042 / PR-1041 (dark), restore + red trash icons, blue name TEST BUILDING-4 / -3; Address | Total Leases (- / 2); Total Units | Deleted At; Archived By Prashanth. Showing 1 to 2 of 2 records, Page 1 of 1.
- Empty: Units tab active, italic "No archived records" card, Showing 0 to 0 of 0 records; frame fixed 844 tall.
- Columns dropdown: SELECT ALL (uppercase, bottom border) + checked columns (Properties: ID, Name, Address, Total Leases, Total Units, Deleted At, Archived By; other tabs: Name, Deleted At, Archived By).
- Links: Properties tab ↔ list, all other tabs → empty frame, Columns → dropdown overlay; flow start "Archives". Mobile menus have **no Archives row** (web sidebar lists it under More) — not added.

### Email Logs (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/email-logs` → `src/app/components/email-logs/email-logs-list/email-logs.component.{html,ts,scss}` + `email-logs.data.ts` (10 rows EL-1001..1010; tabs All / Failed Emails; subtitle "View and manage all email logs (N total)." where N = filtered count). Status chip: Sent `#252536`, Failed `#C94A4A`, white 11px SemiBold, r4. Filters button opens shared `app-filter-drawer` (generic fields, not email-specific).
| Screen | Mobile nodeId | Link |
|---|---|---|
| Email Logs / Mobile (All) | `7239:12698` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7239-12698) |
| Email Logs / Failed Emails / Mobile | `7239:13372` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7239-13372) |
| ~~Email Logs / Filters drawer / Mobile~~ | `7240:12846` | DELETED by user (2026-09-28) |
| ~~Email Logs / Columns dropdown / Mobile~~ | `7240:12907` | DELETED by user (2026-09-28) |

**2026-09-28 user reorganisation:** the user moved the whole Inspection → Email Logs row to y **20759** (Document Center x 2874, Download x 3344, Archives x 4029 / 4585, Email Logs x 5270 / 5740). They deleted every overlay frame (Email Logs drawer + columns, both Archives columns dropdowns) and removed the Archives / Email Logs flow starting points. Do NOT recreate these without asking.

**2026-09-28 fidelity fix (match live 390px render):** content wrapped in a white `Box` (r8, border #E4E4EC, shadow 0 1 2 5%). Inside the box: Tab row (padding 12/20, bottom border) with a segmented control (track #F3F6F8 r8 p2; active white r6 + shadow, 14 SemiBold; inactive 14 Medium muted, h32). Then the Toolbar wrap (p 20/20/0): search 40h #F8F8FB, then Filters / Columns hug-width 40h buttons centred (gap 12, 14 SemiBold muted). Then Body (p20, gap 16) holding the cards (r8, p12, date / emails 14 Medium, labels 12 Medium muted) and the stacked pagination: Show + 80×36 #F3F6F8 select ("10" blue SemiBold), then "Showing …", then "Page 1 of 1" + 32×32 r4 page buttons. Title 24 SemiBold / sub 14. Bottom nav variant `State=More`.
**Card section finish (same day):** the bordered cards inside the Box became flat rows, matching the live table rows and avoiding card-in-card double borders.
- Container `Rows` (gap 0); each row `Row / <subject>` with padding 16/0, gap 6 and a 1px #E4E4EC bottom border on every row, including the last.
- Row content: `Top` holds `Date` (14 Medium, lh 20) and the `Status` chip. Below it: `Subject` (blue 14 SemiBold link, lh 20), then `Grid` with From / To stacked (label 12 Medium muted lh 16, value 14 Medium lh 20).
- The inner divider was removed. Body padding top is 4.
- Frame heights: All 2275, Failed 891.
- All 10 rows were verified against the live table (date | subject | from | to | status).
- List (clone of Archives / Mobile): no header button; tabs All / Failed Emails; toolbar stacked like live `flex-col` (search "Filter items by Subject" full width, then Filters | Columns equal-width row — needed, else placeholder truncates); cards: date (13 Medium dark) + status chip, subject as blue link title, From / To stacked full-width (emails too long for 2 columns); ID not shown (not a column). Showing 1 to 10 of 10 records. Failed tab: EL-1006, EL-1010, "(2 total)", Showing 1 to 2 of 2 records, fixed 844 tall.
- Filters drawer: full-width 390×844 panel — Filters + ×, Filter by Tags (Select Tag), Filter by Area (sqft) (e.g. 1523 Sqft), Filter by ID (e.g. 31658), Filter by Reference No (Enter Ref No), Off Plan Status, Filter by Landlord, Internal Status selects; footer #F8F8FB Clear | Close. Fields cloned from New Inspection select field.
- Columns dropdown: SELECT ALL + Date, Subject, From, To, Status.
- Links: tabs ↔; Filters → drawer overlay (MOVE_IN from right), Columns → dropdown overlay; drawer ×/Clear/Close → BACK; flow start "Email Logs". Mobile menus have **no Email Logs row** — not added.
- Pitfall: switching a HORIZONTAL toolbar to VERTICAL keeps its old fixed height — set `primaryAxisSizingMode='AUTO'` after the switch.

### Activity Logs (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/activity-logs`, i.e. `src/app/components/activity-logs/activity-logs-list/activity-logs.component.{html,ts,scss}` plus `activity-logs.data.ts` (10 rows AL-1..10).
- Columns: Event, Module (blue link), Module Ref, Title, User, Browser / IP, Date, Changes (+N more).
- Event chips: Update = #EEEEF5 background with dark text; Create = #252536 background with white text (Delete would be red 12% with #C94A4A text; not in the data).
| Screen | Mobile nodeId | Link |
|---|---|---|
| Activity Logs / Mobile | `7262:12844` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7262-12844) |

Placed y 20759, x 6210 (right of Email Logs / Failed at 5740). Next free on the row: x **6680**.
- Built as a clone of Email Logs / Mobile.
- Header stacks like the live page (title, then subtitle "Track all system activities and changes (10 total) — what changed, on which record, and by whom.", then the white Export button with the app download SVG). Header gap is 28, matching live gap-5 + mt-2.
- Box contents:
  - no tabs
  - search "Filter by user name"
  - **no Filters / Columns buttons on mobile (user request)**
- Cards (user's card style: r8, border, p16, gap 10):
  - Top row: Event chip on the left, date on the right (14 Medium dark).
  - Module as a blue link.
  - 2-column grid: Module Ref | Title, then User | Browser / IP.
  - Changes in full width, 13 Medium; "+N more" range in 12 Medium muted.
- Pagination: Showing 1 to 10 of 10 records.
- Bottom nav: `State=More` (the sidebar lists Activity Logs under More).
- No flow starting point added: the user removed the Archives / Email Logs ones.
- Note: the user themselves changed the Email Logs rows back to bordered cards (r8, all-side stroke, p16, gap 10). Treat that as the preferred card style.

### Mobile Stats (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/mobile-stats`, i.e. `src/app/components/mobile-stats/mobile-stats-list/mobile-stats.component.{html,ts,scss}` plus `mobile-stats.data.ts`.
- Tabs: Tenants / Landlords / Vendors, 10 rows each.
- Subtitle: "App installs and sign-ins for {tenants|landlords|vendors} (10 total)."
- Columns: ID, Name (link), Email, Company, Tags, Unit, Leases (pill badge #252536, r999, 12 SemiBold), Gender, Application, Action (mail icon).
- Application chip: Installed = #252536 background with white text; Not Installed = #EEEEF5 background with dark text.
| Screen | Mobile nodeId | Link |
|---|---|---|
| Mobile Stats / Tenants / Mobile | `7266:12921` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7266-12921) |
| Mobile Stats / Landlords / Mobile | `7266:13625` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7266-13625) |
| Mobile Stats / Vendors / Mobile | `7266:14329` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7266-14329) |

Placed y 20759 at x 6680 / 7150 / 7620. Next free on the row: x **8090**.
- Built as a clone of Email Logs / Mobile.
- Header: title, subtitle, then the Export button (cloned from Activity Logs); gap 28.
- Box: 3-tab segmented control, search "Filter by Name, Company", **no Filters / Columns (user request)**.
- Cards (user's card style):
  - Top row: ID on the left; on the right, the Application chip plus a 32×32 mail icon button (app `action-menu/mail.svg`, stands in for the Action column).
  - Name as a blue link.
  - Grid: Email (full width); Company | Tags; Unit | Leases (badge); Gender.
- Tabs link to each other (DISSOLVE).
- Bottom nav: `State=More` (the sidebar lists Mobile Stats under More).
- All 30 rows were verified against the live page.
- Pitfall: when re-styling cloned tabs, capture the active fills BEFORE clearing them in a loop; otherwise the new active tab loses its white pill.

### Feedbacks (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/feedbacks`, i.e. `src/app/components/feedbacks/feedbacks-list/feedbacks.component.{html,ts,scss}` plus `feedbacks.data.ts`.
- 18 total; page 1 shows 10 rows.
- Columns: ID (link), Submitted at, Tenant, Phone, Property/Unit, Response, Comment, action ⋮ (menu: View).
- Response style: 8px dot + 13 Medium text. Happy #27865B, Sad #C94A4A, Flat #D08A28; a null response shows a muted "—".
- In the live app, Filters / Columns sit in the header next to Export.
| Screen | Mobile nodeId | Link |
|---|---|---|
| Feedbacks / Mobile | `7268:13144` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7268-13144) |

Placed y 20759, x 8090. Next free on the row: x **8560**.
- Built as a clone of Activity Logs / Mobile.
- Header: title "Feedbacks", subtitle "Monitor tenant feedback and responses (18 total).", Export only. **No Filters / Columns (user request).**
- Search: "Filter by comment or keyword". No tabs.
- Cards:
  - Top row: ID as a blue link on the left; Submitted at plus a 32×32 ⋮ button (app `common/dots-vertical.svg`) on the right.
  - Tenant name (14 SemiBold, dark, not a link).
  - Grid: Phone | Response (dot + text); Property/Unit (full width); Comment (full width, wraps instead of the desktop ellipsis).
- Pagination: Showing 1 to 10 of 18 records, Page 1 of 2, page buttons ‹ 1 2 ›.
- Bottom nav: `State=More` (the sidebar lists Feedbacks under More).
- All 10 rows verified against the live page.

### Tracked Actions (source = live app, no Figma desktop frame)
Source of truth: `http://localhost:4200/tracked-actions`, i.e. `src/app/components/tracked-actions/tracked-actions-list/tracked-actions.component.{html,ts,scss}` plus `tracked-actions.data.ts`.
- 10 rows.
- Columns: Event Name (pill #EEEEF5, r4, p4/10, 12 Medium), User (link), Module Name, Record ID, Event (monospace code, 12 Medium muted), Date.
- No Export button, no tabs.
| Screen | Mobile nodeId | Link |
|---|---|---|
| Tracked Actions / Mobile | `7269:13209` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7269-13209) |

Placed y 20759, x 8560. Next free on the row: x **9030**.
- Built as a clone of Activity Logs / Mobile, with Export removed.
- Header: title "Tracked Actions", subtitle "Audit log of user activity across the system — track what was viewed, created, updated, or deleted, and by whom."
- Search: "Filter items by name". **No Filters / Columns (user request).**
- Cards:
  - Event Name pill on its own top line; long names such as "Lease Generate Invoice Schedules" overlapped the date when both were in one row.
  - User link on the left with Date on the right.
  - Grid: Module Name | Record ID, then Event in **Roboto Mono Medium 12** muted (Figma stand-in for ui-monospace).
- Pagination: 1 to 10 of 10, Page 1 of 1.
- Bottom nav: `State=More` (the sidebar lists Tracked Actions under More).
- All 10 rows verified against the live page.

### Import Logs (source = live app `/imports`, no Figma desktop frame)
Source of truth: `http://localhost:4200/imports`, i.e. `src/app/components/import-logs/import-logs-list/import-logs.component.{html,ts,scss}` plus `import-logs.data.ts` (5 rows).
- Columns: Imported At (green circle-check), Import Type, Total Records, Job Id (monospace link), File (link + external-link icon), Process Status, Actions (Retry orange refresh + View eye).
- Status chip: h24, p0/10, r4, 12 SemiBold. Fully Imported = success #27865B on 14%; Partial = warning #D08A28 on 16%; Processing = info #3E6FA8 on 14%; Failed = danger #C94A4A on 14%.
- The live page has **no search / Filters / Columns** at all.
- Header CTA: the **Actions** dropdown (file-spreadsheet icon + "Actions", 14 SemiBold, r4, 40h). Its menu: Import Rentals, Tenants, Assets, PPMs, Leads, Units, Properties, Landlords, Leases, Users, Contacts, Deals … Menu overlay not built (the user deleted earlier overlays).
- A detail route `/imports/:id` (import-log-detail) exists but has not been built.
| Screen | Mobile nodeId | Link |
|---|---|---|
| Import Logs / Mobile | `7272:13307` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7272-13307) |

Placed y 20759, x 9030. Next free on the row: x **9500**.
- Built as a clone of Activity Logs: Export was replaced by the Actions button, and the toolbar was removed (Body pt 20).
- Tabler icons were hand-authored as SVG (file-spreadsheet, circle-check-filled, external-link, refresh, eye).
- Cards:
  - Top row: check icon + Imported At (13 Medium) on the left, status chip on the right.
  - File link + external icon on the left, with Retry / View 32px icon buttons on the right.
  - Grid: Import Type | Total Records, then Job Id (Roboto Mono 13, blue).
- Pagination: 1 to 5 of 5.
- Bottom nav: `State=More`.
- All 5 rows verified.

### Prototype links (added 2026-09-28)
~2,030 reactions on page `6122:413`, all ON_CLICK, NAVIGATE + DISSOLVE 0.2s (modals = OVERLAY + MOVE_IN; modal Close/Save/Cancel/✕/× = BACK). 24 flow starting points (original 9 + Mobile App (My day), Contacts, Contracts, Accounting, Commissions, Reminders, Broadcasts, Bookings / Spaces, Bookings / Reservations, Community / Events / Promotions / Guides, Guests, Legal). Now 26 incl. Inspections (added with the Inspection suite).
- **Chrome (set on main components → every instance inherits):** Top bar `6122:455` Hamburger → Mobile Menu / Overlay on Phone (SLIDE_IN), Logo → My day, megaphone → Broadcasts. Bottom nav set `6315:3197` (+ `6196:447`): My day / Dashboard / Properties (Property List) / More (menu overlay).
- **Menu:** new frame [Mobile Menu / Expanded Overlay on Phone](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7201-11991) `7201:11991` (clone of overlay `6959:10590` with All Expanded drawer, x -1790). Both overlays `overflowDirection VERTICAL`. Collapsed rows: leaf items → list frames, parents (›) → expanded overlay; expanded parent rows → collapsed overlay; Sub items → lists; Close/Scrim → BACK. Same links on Drawer `6959:10394` and All Expanded `6959:10036`. Unlinked (no mobile frame): Parkings, Property Listings, Facility subs, + Create. (Setting → Settings menu overlay `7288:13568`, linked 2026-09-29.) (Documents / Download linked 2026-09-28.) (Inspections subs Inspection List / Templates List linked 2026-09-28 in `7201:11991` + `6959:10036`.)
- **Pattern per module:** list add button → New form; list cards → Details; details back crumb → list, Edit → form, tabs ↔ tab variants, in-page add buttons → modal overlays; form back/Cancel → list, primary (Create/Save/Book/Send/Accept) → details, Preview → details. Accounting Reports "View Report" mapped by card title; report ← → Accounting Reports. Contacts cards → Tenant Statement / Landlord Overview / Vendor Overview; All Contacts by type text. Space Month/Week/Day segments + Reservations/Attachments tabs; Broadcast Desktop/Mobile preview toggles.
- Fixed inherited clone links (Landlord/Vendor contract cards → Lease Overview, Add Lease → old Lease Management, cloned forms → Broadcasts).
- **Unlinked-pages pass (2026-09-28):**
  - Added 7 More-section rows after Download in all 4 menus (`7201:11991`, `6959:10590`, `6959:10394`, `6959:10036`). The order and labels follow the sidebar `ensureMoreMenuDefaults`, using the web icons from `assets/images/nav/*.svg`. Expanded menus use a `Nav / <label>` wrapper.
  - Row links: Archives → `7234:12552`; Email Logs → `7239:12698`; Activity Logs → `7262:12844`; Imports → `7272:13307`; Mobile Stats → `7266:12921` (Tenants); Feedbacks → `7268:13144`; Tracked Actions → `7269:13209`.
  - Modal overlays (OVERLAY + MOVE_IN):
    - Btn / Add Inventory in Unit Inventory `6456:3388` and Room Inventory `6482:5016`, plus Add Item `6367:3943` → New Inventory `6536:6582`.
    - Btn / Record Receipt in Lease Overview `6763:4680` and Lease Financials `6768:4637` → Record Receipt `6777:4553`. The modal's primary button `6777:4606` = BACK.
  - Still unreachable, reported to the user:
    - Unit Overview / Assets `6288:4240` is **hidden** (`visible=false`), and hidden frames reject links.
    - Current Lease Management `6707:3750` has no Add Lease button, so Add Lease `6549:3531` is reached only from the old frame; `6564:6784` is a duplicate.
    - Vendor Assign `6850:7468` is an alternate Overview (Overview tab active, "Assign Property") with no trigger.
    - The "(old)" frames and Nav / Spec are intentionally left unlinked.
- Pitfalls: a node cannot link to its own top-level frame (active tab) — skip dest === frame id. Overlay position is read-only in plugin API (defaults CENTER). Re-run safe: `setReactionsAsync([r])` replaces per node.

#### Space modals (mobile)
| Modal | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| New Booking (desktop "Add new event") | `2683:104385` | `7147:10466` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7147-10466) |
| Add Attachment (desktop "Add document") | `2686:112062` | `7147:10668` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7147-10668) |
Placed x 2090 / 2560, y 39692. Built by cloning the desktop modal and reflowing to 358w: close button centered above card, GRID card → VERTICAL, all ≥150px children FILL, huge gaps → SPACE_BETWEEN, body unclipped/HUG with 16px padding, header rows HUG (2-line subtitle), overflowing fixed-height frames → HUG. Exact desktop text kept: "Add New Event / Create a new event for your calendar", Title, Start/End Date, Variant, Post, Cancel / Create Event; "Add Document / Select a document type, upload a file, and choose who can view it.", Document type *, helper text, Document Number, Issue/Expiry Date, Issuing Authority, upload zone, passport_copy.pdf · PDF · 1.1 MB · Uploading 72% · Remove, Close / Save.

#### Space Details (mobile suite, now at y 39692, x -260 → +470 each)
**Restyled 2026-09-28 to the shared mobile-details pattern** (reference: Landlord Contract Details / Mobile `6912:111102`, Vendor Contract Details / Financials `6950:7958`): ← back crumb → 22px title + plain breadcrumb → button row (40px) → underline tabs (gold active) → Summary card → label-left/value-right KV cards → section header → tab content. Cloned from reference nodes: crumb `6912:111146`, title block `6912:111207`, actions `6912:111213`, tabs `6912:111218`, summary `6912:111228`, info card `6912:114530`, section header `6912:114564`, KV row `6912:114494`, search row `6912:114567`, list card `6951:370`. Use this same pattern for any future mobile details page.
Pitfall: desktop panel buttons and the "View more details" link share the name `Frame 2147223952` — look up by text, not by name.

| Screen | Desktop source | Mobile nodeId | Link |
|---|---|---|---|
| Space Details / Mobile — Month | `2667:96726` | `7129:11253` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7129-11253) |
| Space Details / Mobile — Week | `2679:100709` | `7133:10174` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7133-10174) |
| Space Details / Mobile — Day | `2683:102518` | `7133:11559` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7133-11559) |
| Space Details / Mobile — Attachments | `2683:109637` | `7134:11315` | [open](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7134-11315) |

Shared: top bar + bottom nav chrome, "← Booking / Space", Space Details, Booking / Space / Details, full-width Action ▾ (month/week/day) or Edit Space + Add Attachment (attachments), tabs Reservations / Attachments, Summary card (Skyline Meeting Room + Weekdays chip, Space #31658, View Activity + Edit Space), "Information", KV cards with dots: Property & Unit (blue links), Space Details (all desktop fields + View more details link; colons dropped in KV layout), Weekly Schedule (Mon…Fri Closed, Sunday, Saturday — desktop order), section header Space Details / Manage space details and operations.
Month: desktop calendar reflowed — 56px cells, bookings shown as dots, plus Agenda list below (1 · 9:00 AM Initial Consult; 9 · 2:30 PM Contract Review; 14 · 11:00 AM Team Sync; 14 · 4:00 PM Sarah Jenkins). Week: 44px time axis, Marketing Strategy in Tue column (10px wrap). Day: Design Review: Version 2.0 / Confirmed • 10:00 AM - 1:00 PM full width.
Attachments: Attachments tab active, Search/Column row, 2 invoice-style KV cards (ATT-1001 + Active/Verified chip + dots; File Type Passport Copy/Visa Copy, Doc ID DOC-1001, Issue/Expiry 12-01-2026, Files 1file, Uploaded By Tenant, Share Landlord/Tenant Yes, Created At 10-01-2026, 09:14, Updated At 12-01-2026, 13:06), Show 10 · Showing 1 to 2 of 2 records · Page 1 of 12.

### Settings (source = live app `/settings/*`, built 2026-09-29)
Source of truth: every settings sub-page on `http://localhost:4200/settings/...` (menu = `settings-menu.data.ts`). Text was extracted from the live DOM (outline per route) and copied exactly; Filters / Columns buttons omitted on mobile. 58 page frames + 1 menu overlay, named `Settings / <Page> / Mobile`, 390w HUG, top bar + bottom nav (`State=More`) cloned from Import Logs.
- **Builder lib:** `settings-mobile-lib.js` in this store (`function LIB(figma)`: page/header/card/field/check/toggleRow/listBox/row/kv/pagination/empty/footer/stats/callout/upload…). While building it was stored in `figma.root` shared plugin data `orv/lib`; removed after the suite. To reuse: set it again from the file, then `new Function('return '+src)()(figma)`.
- **Settings menu:** [Settings / Menu / Overlay on Phone](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement?node-id=7288-13568) `7288:13568` (clone of `6959:10590`, drawer = search "Search settings...", Back to Main Menu, section headings, `Row / <Section> / <Label>` rows). ServiceHub rows link to the same frames as the Types and Amenities rows.
- Rows (x -886 + 470·i): Company y 25500 · Documents 28482 · Users 31232 / 34657 · Invoices 37792 · Leases 39989 · Work orders/categories 43737 · Helpdesk/units 45502 · Config/email 47583 · Mobile app/ServiceHub 50630.

| Screen | Node | Screen | Node |
|---|---|---|---|
| Company Details | `7288:13355` | Brand Settings | `7288:121726` |
| Watermark | `7288:121882` | Company Shifts | `7288:122081` |
| Regional Settings | `7288:122370` | Departments | `7288:122536` |
| Masters | `7288:122709` | Document Templates | `7289:13866` |
| Add Document Template | `7289:13975` | PDF Builder | `7289:14202` |
| PDF Template Builder | `7289:14303` | Mandatory Documents | `7289:14555` |
| Attachment Types | `7289:14722` | Users and Admins / Users | `7290:14304` |
| Users and Admins / Admins | `7290:14607` | Users and Admins / Support Technicians | `7290:14795` |
| New User | `7290:14945` | User Details | `7290:15312` |
| User Roles | `7291:14669` | Roles & Permissions (new role) | `7291:14887` |
| Bulk Assign Properties | `7291:15273` | Profile verification / Landlord | `7291:15566` |
| Profile verification / Tenant | `7291:15737` | Invoice/Receipt Profiles | `7292:15034` |
| Discount Profiles | `7292:15164` | Tax Profiles | `7292:15263` |
| Bank Accounts | `7292:15364` | Invoice Settings | `7292:15464` |
| Bounced Cheques | `7292:15703` | Lease Settings | `7293:15472` |
| Contract Settings | `7293:15789` | Management Fee Configuration | `7293:15988` |
| Work Order Settings | `7294:15691` | Maintenance Categories | `7294:15822` |
| Quotation Categories | `7294:16119` | PO Settings | `7294:16324` |
| Promotion Categories | `7294:16223` | Inventory Categories | `7294:16428` |
| Asset Categories | `7294:16598` | Tickets Settings | `7295:16202` |
| Unit Types | `7295:16445` | Room Types | `7295:16550` |
| Property Types | `7295:16652` | Property Amenities | `7295:16755` |
| Custom Fields | `7298:16567` | Approvals | `7298:16913` |
| Internal Statuses | `7298:17052` | Email Settings | `7298:17152` |
| Email Templates | `7298:17278` | Notification/Email Settings | `7298:17586` |
| Custom links | `7298:17766` | Mobile App Config / Tenant | `7299:17078` |
| Mobile App Config / Landlord | `7299:17183` | Mobile App Config / Vendor | `7299:17288` |
| Payment Gateways (placeholder) | `7299:17393` | Visiting Slots | `7299:17478` |
| Broadcast Configuration | `7299:17751` | Snaglist Preference | `7299:17942` |

- **Layout note:** the user rearranged settings frames into horizontal group rows (row 1 y 25500, x -886…24087; row 2 y 30506). Find frames by name, not by coordinates.
- **Add modals (2026-09-29, from live app modals):** 26 frames `Settings / <X> / Mobile Modal`, placed under their parent page (x+16, 120 gap; Lease Settings stacks 3). Style = existing Add User modal `6816:5502` (358w, ✕ 32 circle, card r16 stroke, header 18 SemiBold navy + 12 sub, dividers, body p16 gap14, footer right Close #EEEEF5 / Save navy h36). IDs: Department `7311:17589`, Attachment Type `7311:17617`, Mandatory Document `7311:17669`, Invoice Receipt Profile `7311:17704`, Discount Profile `7311:17783`, Tax Profile `7311:17828`, Bank Account `7311:17876`, Lease Checklist `7311:17936`, Lease Fixed Payment `7311:17956`, Lease Term `7311:17997`, Maintenance Category `7311:18018`, Quotation Category `7311:18073`, Promotion Category `7311:18098`, Inventory Category `7311:18119`, Asset Category `7311:18145`, Unit Type `7311:18171`, Room Type `7311:18197`, Property Type `7311:18223`, Property Amenity `7311:18242`, Broadcast Type `7311:18262`, Custom Link `7311:18283`, Internal Status `7311:18329`, Ticket Category `7311:18363`, Visiting Slot `7311:18397`, Landlord Mandatory Fields `7311:18416`, Tenant Mandatory Fields `7311:18494`. Links: 32 page add buttons → OVERLAY (template from `6564:6784` Btn / Add Payment); ✕ + footer buttons = BACK.
- **Masters / Add Record** `7311:18547` (clone of Masters, inline form from template: Code*, Name*, Arabic Name (Noto Sans Arabic, RTL), Display Order, Class Name, Description, Dependency Type/Item, Active Status, Cancel/Save). Title "Add {Category}" is a placeholder — categories come from the API and didn't load. Back/Cancel/Save → Masters. No inbound link (no category rows on Masters frame).
- **Copy sync 2026-09-29** (user's translation commit a8c4ec54): updated headers on Company Details, Brand ("Brand & Styling"), Watermark ("Watermark Settings"), PDF Builder (+ Add PDF Template), Mandatory Documents (+ Add Requirement), Attachment Types, Maintenance / Inventory / Asset Categories (+ Add Category), Room Types, Property Amenities. Missing runtime keys (`web.common.btnNew`, `web.common.lblUser`, `…total`) kept as the previous English text.
- **Links:** `Row / Setting` in all 4 main menus → settings overlay; 56 settings rows → frames; Back to Main Menu → `6959:10590`; Close/Scrim = BACK; Hamburger (instance override) on all 58 settings frames → settings overlay (SLIDE_IN RIGHT). In-page: + Add Document Template / + Add PDF / + Add New Role → new forms, back + Cancel → lists; Users/Admins/Technicians tabs ↔, + Add New User/Admin/Technician → New User, user names → User Details, back → Users; Profile verification Landlord ↔ Tenant; Mobile App Tenant ↔ Landlord ↔ Vendor.

### Global Branch / Building selector + Search (mobile, 2026-09-30)

- Desktop header has `ng-select` "Select Branch" / "Select Building" (`header.component.html`, `hidden sm:flex` → hidden on phones in code). User chose **drawer** pattern, Figma only.
- Block `Scope / Branch & Building` (V gap 8, pb 12) inserted between drawer header ("ORVILLE REAL ESTATE") and "+ Create" in all 4 menus: Drawer `7362:17663`, All Expanded `7362:17672`, Overlay on Phone `7362:17681`, Expanded Overlay `7362:17690`. Selects: white, `#E4E4EC`, r8, h40, pl16/pr12, placeholder 14 Regular `#6B6B7D`, chevron-down 18 standard.
- `Btn / Search` (40 circle, same fill as speakerphone btn, 20px search icon `#6B6B7D` sw1.2) added at start of Actions in main component `Chrome / Mobile Top bar` `6122:455` → all 241 instances. No mobile search screen/link yet.

### Dashboard / Mobile redesign (source = Web Portal Dashboard `424:4105`, 2026-09-30)

- Old content (partial desktop reflow: Property Highlights showed 2 of 9 cards, Priority card 1615px wide, invented greeting subtitle, hidden summary cards) moved to backup frame `7376:19803` (left of page) — not deleted.
- New `Content` `7376:19804` inside `6122:781` (between Top bar and Bottom nav; bottom-nav Dashboard link unchanged). V auto-layout, pad 16/16/24/16, gap 16, `#F8F8FB`. Frame height ≈ 15.1k.
- Card pattern: white, `#E4E4EC` 1px, r16, header 14/16 with bottom border (title 16 SemiBold, sub 12 `#6B6B7D`), body 16. Sub-cards r12; KPI mini cards 2-col (158px) with 12-bar / line mini charts; donuts = ellipse arcData; segmented tabs `#F8F8FB` + white active.
- Section order = desktop: Greeting (date + calendar icon, "Good Morning, Zaid Rahman", "Here's your property management overview for today.") → Property Dashboard Highlights `7376:19823` (5 KPI + Properties/Units/Rooms/Parking) → Contact Status Analytics `7376:20042` → Top Landlords `7376:20091` → Lease Highlights `7377:19803` → Income Overview `7377:19937` → Expense by Category `7377:19971` (Rose Chart clone `801:5273`) → Work Order Insights `7377:20033` → Request's Analysis `7377:20113` → Work Order's Status `7377:20137` → WO Distribution by Maintenance Categories `7377:20157` → WO Resolve Rate `7377:20193` → Purchase Order Highlights `7377:20228` → Unit Health Monitor `7377:20252` → Work Orders based on Priority `7378:19803` (12-month stacked, labels "Jan / 25" two-line) → Department Ticket Assignments `7378:19961` → Status Wise Tickets Graph `7378:20004` → New Tickets `7378:20075` → Ticket Sources `7378:20110` → Units Published By Month `7378:20143` → Happiness Meter `7378:20176` (desktop gradient + tile clones) → Unit Stats `7379:19803` → Portfolio Overview / Annual Rent Recognized Revenue `7379:20039` → Lease Status by Month `7379:20130` → Active Lease Stats `7379:20166` → Renewal Stats `7379:20344` → Country Overview `7379:20423` (map clone `504:2498`, 15-country list scrolls vertically, 300px).
- Icons cloned from desktop (contact, priority, status flags, happiness faces, unit/lease stat icons, portfolio). Desktop hidden layers (header Button, Invoice/Bills/Commercial toggles, "Total Overdue leases", etc.) intentionally not drawn.

### Bottom nav Create FAB + Create / Mobile Overlay (2026-09-30)

- User request: move the drawer "+ Create" into a raised centre "+" in the bottom nav (reference screenshot Home/Explore/+/Inbox/Profile).
- Component set `Chrome / Mobile Bottom nav` variants State=My day `6315:3065`, Dashboard `6315:3098`, Properties `6315:3131`, More `6315:3164` (all instances update): top radius 20, clipsContent off, 4 tabs `layoutGrow 1`, "Create slot" (64×37) at index 2 holding `Btn / Create` = 52 circle `#26264F`, white 4px OUTSIDE stroke, shadow y6 r16 navy 28%, white plus 2px, raised y -30. Tab labels kept (My day / Dashboard / Properties / More, gold active) — not the screenshot's labels; FAB = brand navy, not purple.
- Drawer "+ Create" buttons **hidden (visible=false, not deleted)**: `6959:10399`, `6959:10041`, `6959:10597`, `7201:12172`.
- `Create / Mobile Overlay` `7373:242` (390×844, x -2920 y -1493, label `7373:818`) — from `create-overlay.component` + `create-overlay.data.ts`: backdrop `#252536`@28% (BACK), 32 white close circle (BACK), card r16 with "What would you like to create?", Search… field (standard), vertical-scroll List of 14 sections / 32 rows (real `assets/images/create/*.svg` icons, 30 box r8 `#F8F8FB`, label 14 muted, rows FILL width / HUG height with divider).
- FAB in all 4 variants → OVERLAY `7373:242`. 21 rows linked: Property, Unit, Room, Tenant, Landlord, Vendor, Inventory Assets, Leasing, Landlord Contract, Vendor Contract, Invoice, Expense, Account, Reminder, Promotion, Space, Broadcasts, Visitors, Event → New Event `7164:10873`, Rules / Guide → New Guide `7180:118724`, Reservation → New Reservation `7155:13278`. No mobile form yet (unlinked): Parking, Request, Word Order, Quotation, Preventive Maintenance, Inventory Item, Purchase Order, Credit Note, Tickets, Litigation, Inspection.

### Property Overview — Action menu (mobile, 2026-09-30; source = live app `property-detail.component.html` + `.ov-action-menu` in `orville-ds.scss`)

- `Btn / Action` `7397:19761` added right side of breadcrumb row `6200:654` (spacer grows): clone of Send Broadcast button (white, `#E8EAF0`, r10, 12 SemiBold `#26264F`) + chevron-down 14. Existing Edit Property / Send Broadcast / Export row untouched.
- Overlay `Property Overview / Action Menu / Mobile` `7397:19765` (backdrop `#252536` 8% → BACK), menu 212 wide at x162 y114: white, `#E4E4EC`, r12, shadow 0 10 28 rgba(37,37,54,.1), pad 8; items h40 pad 6/10 gap 12 r8, icon box 28 r6 `#E4E4EC` + app SVG 14 (pencil, plus, paperclip, file-invoice, clock), label 14 Medium ls .28; Edit Property + Add Unit blue `#2563EB` (per user screenshot), others `#252536`; footer border-top, Archive box `#C94A4A` border + 8% fill, red archive icon.
- Links: Action → overlay; Edit Property → Add Property / Mobile `6240:2084`; Add Unit → `6248:2428`; Add Attachment → `7147:10668`; Add Note → New Note `6418:4080`; View Activity → Activity Logs `7262:12844`; Archive → BACK (no archive confirm designed).
- Static preview `Property Overview / Action Menu Open (preview) / Mobile` `7399:19760` (labels `7397:19817`, `7399:20086`).
- NOTE (seen later 2026-09-30): the item labels are now bound to the DS Primary-text variable (`VariableID:136:132`, `#252536`) — the blue was replaced in Figma; keep text-variable colour for all action menus.

### Unit Overview — Action menu (mobile, 2026-09-30; source = live app `unit-detail.component.html` lines 22–52)

- Frame `Unit Overview / Mobile` `6275:2556` has TWO contents: old hidden `Unit Overview / Mobile / Content` `6275:2313` and the VISIBLE `Room Overview / Mobile / Content` `6532:6345` ("← Rooms / R-1204"). Always edit the visible one (check `visible` before editing).
- `Btn / Action` `7400:19843` (clone of property button) + Spacer (layoutGrow 1) in visible breadcrumb `6532:6346` (now HUG 36 high, counter-align CENTER; frame grew 2362 → 2380). Existing Edit Room / Broadcast / Export row untouched.
- Overlay `Unit Overview / Action Menu / Mobile` `7400:19847` at (6177, 2594), clone of the property overlay: items Edit Real Estate (pencil), Quotation PDF (app printer.svg scaled to 14), View Activity (clock), divider, Archive (red box). Menu x162 y178 (6px under the button), h195.
- Links: Action → OVERLAY `7400:19847`; Edit Real Estate → Add Unit / Mobile `6248:2428` (no separate edit-unit frame); Quotation PDF → BACK; View Activity → Activity Logs `7262:12844`; Archive → BACK; backdrop → BACK.
- Static preview `Unit Overview / Action Menu Open (preview) / Mobile` `7400:19906` (unit clone + overlay clone, reactions stripped; rebuilt again after the blue change); labels `7400:20479`, `7400:20480`.
- "Edit Real Estate" label `7400:19856` set to blue `#2563EB` (user re-sent the screenshot with blue, 2026-09-30).

### Room Overview — Action menu (mobile, 2026-09-30; source = live app `room-detail.component.html` lines 20–55)

- Same items as the unit menu: Edit Real Estate (`/edit-room`), Quotation PDF, View Activity, divider, Archive (danger). "Edit Real Estate" label blue `#2563EB` per user screenshot, the others Primary-text.
- `Btn / Action` `7414:19888` + Spacer in breadcrumb `6367:3388` of `Room Overview / Mobile` `6367:3385` (breadcrumb HUG 36 high; content +18, bottom nav moved down 18, frame 2380 → 2398). Edit Room / Broadcast / Export row untouched.
- Overlay `Room Overview / Action Menu / Mobile` `7414:19892` at (13859, 2623), clone of the unit overlay; menu x162 y114.
- Links: Action → OVERLAY `7414:19892`; Edit Real Estate → Add Room / Mobile `6297:4142`; Quotation PDF → BACK; View Activity → Activity Logs `7262:12844`; Archive → BACK; backdrop → BACK.
- Static preview `Room Overview / Action Menu Open (preview) / Mobile` `7414:19925` at (14329, 2623); labels `7414:21345`, `7414:21346`.
- NOTE: `Unit Overview / Mobile` `6275:2556` currently SHOWS room content ("Rooms / R-1204", `6532:6345`), and its unit content (`6275:2313`, "Apartment 209") is hidden. Ask the user before changing that.

### Tenant Details — Action menu (mobile, 2026-09-30; source = live app `tenant-detail.component.ts` `actionOptions` lines 178–188)

- Tenant details on mobile = `Tenant Statement / Mobile` `6805:5064` (Tenants list cards link here). `Btn / Action` `7418:20007` + Spacer in Back crumb `6805:5108` ("← Contacts / Tenant"; crumb FILL, HUG 36, counter CENTER). Frame is VERTICAL auto-layout HUG: 1230 → 1249 (do NOT resize manually; keep HUG). Edit Tenant / View Activity row untouched. Only the Statement tab frame got the button (the other Tenant tab frames did not).
- Overlay `Tenant Details / Action Menu / Mobile` `7418:20011` at (-1068, 7381), clone of the property overlay; menu 240 wide (so "Add Emergency Contact" fits) at x134 y114, h489. All labels Primary-text (matches user screenshot).
- Items + icons (app SVGs from `assets/images/action-menu/`, broadcast = custom radio-waves drawing to match `ri-broadcast-line`): Edit Tenant (pencil) → New Tenant / Mobile `6794:5154` (same as Btn / Edit Tenant); Add Lease (file-invoice) → Add Lease / Mobile `6564:6784`; Add Attachment (paperclip) → SWAP overlay `6403:4077`; Add Notes (file-invoice) → SWAP `6418:4080`; Add User (add-user) → SWAP `6816:5502`; Add Emergency Contact (phone) → SWAP `6816:5570`; Add Broadcast → Create Broadcast / Mobile `7110:9772`; Send Email (mail) → BACK; View activity (clock; lowercase "a" as in app) → Activity Logs `7262:12844`; Unblock Tenant (block) → BACK; footer Archive Tenant (danger) → BACK; backdrop → BACK.
- Static preview `Tenant Details / Action Menu Open (preview) / Mobile` `7418:20182` at (-598, 7381); labels `7418:20944`, `7418:20945`.

### Landlord Details — Action menu (mobile, 2026-10-01; source = live app `landlord-detail.component.ts` `actionOptions` lines 299–313)

- Landlord details on mobile = `Landlord Overview / Mobile` `6827:5502` (Landlords list cards link here). `Btn / Action` `7446:20089` + Spacer in Back crumb `6827:5546` ("← Contacts / Landlord"). Frame is VERTICAL HUG: 1585 → 1604. Edit Landlord / View Activity row untouched. Only the Overview (Wallet) tab frame got the button.
- Overlay `Landlord Overview / Action Menu / Mobile` `7446:20093` at (2389, 7717), clone of the tenant overlay; menu 240 wide at x134 y114, h657. All labels Primary-text.
- Items (app SVGs, incl. megaphone `broadcast.svg` as in the user screenshot): Edit Landlord → Add Landlord / Mobile `6793:4845` (same as Btn / Edit Landlord); Inflow, Outflow, Landlord Contribution, Landlord Distribution → BACK (no mobile frames); Add Notes → SWAP `6418:4080`; Add Attachment → SWAP `6403:4077`; Add User → SWAP `6816:5502`; Add Emergency Contact → SWAP `6816:5570`; Add Broadcast → Create Broadcast / Mobile `7110:9772`; Request for Approval → BACK; Send Email → BACK; View Activity → Activity Logs `7262:12844`; Block Landlord → BACK (icon box red like Archive = app `dangerIcon`, label stays Primary-text); footer Archive (danger) → BACK.
- Static preview `Landlord Overview / Action Menu Open (preview) / Mobile` `7446:20313` at (2859, 7717); labels `7446:20873`, `7446:20874`.

### Mobile Action-menu pattern (shared by Property / Unit / Room / Tenant / Landlord)

- `Btn / Action` (white, `#E8EAF0`, r10, 12 SemiBold navy + chevron) at the right of the back-crumb row, after a Spacer (layoutGrow 1); crumb row FILL, HUG, counter-align CENTER. Never remove the existing Edit/View Activity buttons.
- Overlay = full 390×844 frame: Backdrop `#252536` 8% (BACK) + "Action Menu" card (white, `#E4E4EC`, r12, shadow 0 10 28 rgba(37,37,54,.1), pad 8) 6px under the button, right edge at x374. Items h40, pad 6/10, gap 12, 28px icon box r6, 14 Medium ls .28. Footer with top border holds the danger item (red box `#C94A4A` + 8% fill).
- Items come from the app's detail component (labels + `assets/images/action-menu/*.svg`). Full-screen destinations NAVIGATE; modal destinations SWAP (replace the menu overlay); items with no Figma screen → BACK.
- Widen the menu (not wrap) when a label doesn't fit (240 for "Add Emergency Contact").
- Always add a static "Action Menu Open (preview)" frame (frame clone + overlay clone, reactions stripped) and canvas labels.
### Forgot Password / Mobile (built 2026-09-30 from Login / Mobile `7341:17681`)

- No forgot-password design exists in Figma (any page) and no component in the app (login link → `/authentication/reset-password/basic`, route not implemented; no i18n keys). Copy is new/standard — confirm with user before implementing.
- `Forgot Password / Mobile` `7386:126816` (clone of login: same hero, sheet, logo, field chrome, button, copyright, Help | Privacy). Title "Forgot Password?", subtitle "Enter the email address linked to your account and we'll send you a link to reset your password.", Email field (label Email, placeholder yourname@gmail.com), `Btn / Send Reset Link`, `Link / Back to Login` (arrow-left 16 + text, link blue from login).
- `Forgot Password / Email Sent / Mobile` `7386:126879`: 64 mail badge (`#F8F8FB`/`#E4E4EC`, navy mail icon), "Check Your Email", "We've sent a password reset link to yourname@gmail.com. Open the email and follow the link to set a new password.", `Btn / Back to Login`, "Didn't receive the email? Resend".
- Labels `7386:126940`, `7386:126941`. Placed right of Login (x -1453 / -983).
- Links: Login "Forgot Password?" → FP; Send Reset Link → Email Sent; Back to Login (both) → Login; Resend → FP.
- `New Password / Mobile` `7392:19758` (x -513, label `7392:19830`), clone of login: "Set New Password", "Create a new password for your account. It must be different from your previous password.", New Password (placeholder "Enter new password", eye-off, hint "Must be at least 8 characters."), Confirm Password ("Re-enter new password", eye-off), `Btn / Reset Password` → Login, Back to Login → Login. Email Sent mail badge → New Password (stands in for the email link). Copy is new — confirm before implementing.

### Login / Mobile (source = live app `/auth/login`, built 2026-09-29)

- Frame `7341:17681` (390×844) at x -5140, y -1400 (left of Mobile Menu), label text `7341:17740`.
- Desktop refs (read only): `6088:103756` (matches live app), older `26:80`. Desktop "OR" + second sign-in button are NOT in the live app → omitted.
- Structure: hero 390×250 (`#A6B0B9` + isometric illustration imageHash `b3a64917…` + `#26264F` OVERLAY blend) → white sheet r24 top at y222: Orville logo (clone of `6088:103765`), "Welcome Back" 28 Bold, subtitle, Email / Password fields (live login chrome: white, `#EDF1F3`, r10, h46, placeholder `#ACB5BB`@72%, label 12 Medium `#6C7278`, eye-off instance), Remember me / Forgot Password? (`#375DFB`), Login button navy h48 r10, copyright 10 `#9CA3AF`, footer Help | Privacy.
- Link: Btn / Login → My day / Mobile `6122:644` (NAVIGATE dissolve). Error alert (API text) and loading spinner not drawn.

### Form field standard (applied 2026-09-29 to all mobile frames on `6122:413`)

Source = desktop Web Portal Add Payment `1997:57478` (read only) = `orville-ds.scss` `.ov-input`.

- **Field box:** fill `#F8F8FB`, stroke `#E4E4EC` 1px inside, radius 8 (heights unchanged, 36–46; textareas taller).
- **Text:** Hanken Grotesk. Placeholder / muted `#6B6B7D`, filled value `#252536`, links `#2563EB` untouched. All Inter field text → Hanken (same style).
- **Label:** Hanken Medium `#6B6B7D` (size unchanged), required `*` `#C94A4A`.
- **Icons (stroke `#6B6B7D` 1.5, round caps, frames tagged sharedPluginData `orville/ffstd=1`):**
  - `chevron-down` 18×18: vector `M0 0 L4.5 4.5 L9 0` at (4.5, 6.75). Replaced all `▾ ⌄ ∨` glyphs + old `icon/chevron` / 14px chevrons; added to "Select…" dropdowns that had none (text layoutGrow 1, chevron right).
  - `search` 15×15: ellipse 8.75 at (1.875,1.875) + handle `M0 0 L3.75 3.75` at (9.375,9.375). Replaced `⌕` glyphs + old `icon/search`.
  - `calendar-week` 14×14: rect 9.33 r1.5 at (2.33,2.92) + 2 ticks + divider. Replaced `📅`; added before DD/MM/YYYY placeholders.
  - `icon/clock` etc. kept, recoloured `#6B6B7D` 1.5.
- **Excluded on purpose:** pagination "Show 10" selects (`#F3F6F8` h36), tab segments, Create Template editor group wrappers (no fill), New Visitor "QR Code" chip (`#EEEEF5`), dropzones / upload zones / signature areas.
- Result: 980 fields audited → 952 standard; remaining 28 = the exclusions above. New fields must use this spec.

---

## Rules for mobile Figma work (user instructions, Sep 2026)

1. This catalog is the **Figma mobile design reference**.
2. **Do not chrome / restyle / edit Orville_UI** unless the user explicitly asks to implement a specific frame.
3. When implementing later: pick **one** frame nodeId, run `get_design_context` + screenshot, frontend-only, match Figma.
4. Web Portal (desktop) work stays separate — see `.ai/PROJECT.md` §4 known nodes.
5. **Exact content fidelity:** When given a Figma link, analyze design + content carefully and recreate with the **exact same data** shown in that file. Do **not** add new data, remove existing data, or omit details. Keep the same content structure, hierarchy, and meaning. Layout may adapt for mobile; content must stay in parity with the source. Diff source vs result texts before done. If copy must be invented (no source exists), tell the user. Scoped to mobile Figma work; not mirrored into `.cursor/rules`.
6. **Page target:** Mobile designs go **only** on `Responsive - My day, Dashboard & Properties` (`6122:413`). Never `Page 2`. Start every `use_figma` script with `setCurrentPageAsync` to `6122:413`.
7. When a localhost URL is given, the live Angular app is the source of truth; app code is the source for menus and labels.
8. The user edits Figma concurrently — find frames by name, and check `visible` before editing a layer (some frames keep hidden older content).
9. Delivery: update this catalog, then report with Figma links, embedded screenshots and a summary.
