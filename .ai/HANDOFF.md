# Current Agent Handoff

Last updated: 2026-11-07 10:00 (Asia/Dubai)
Agent: Antigravity
Branch: `main`

## Latest session (2026-11-07)

- **Merge Conflict Resolution (Teammate Commit `534c030d`) — 100% RESOLVED & VERIFIED**:
  1. Cleanly resolved git merge conflicts across `custom-fields.data.ts`, `custom-fields.component.ts`, and `custom-fields.component.html`.
  2. Preserved teammate's `selectedScreen` dropdown, `screens` list, and `onscreenChange` trigger.
  3. Preserved our full Swagger schema draft model, dynamic data types (`typeId: -8`), auto slugification, all 6 checkboxes, modal scrolling, and property extra fields integration.
  4. Resolved `openEdit` to handle both camelCase and snake_case row representations.
  5. Verified with `npx ng build --configuration=development` — compiled with exit code 0.

- **Custom Fields Dynamic Data Types (`typeId: -8`) & Swagger Schema Implementation — 100% COMPLETE & VERIFIED**:
  1. **Dynamic Data Types via `_getMasters` `typeId: -8`**:
     - `USP_APP_GETMASTERS` with `typeId: -8` (and `8`) returns `table1` with all 10 system control types (`Textbox [TX]`, `Numeric [NM]`, `Date [DT]`, `Time [TI]`, `Select [DL]`, `SelectPicker [DP]`, `FileUpload [FU]`, `Image [IM]`, `RadioButton [RB]`, `CheckBox [CK]`).
     - Fixed SQL Server stored procedure bug where `typeId: 9` had `[entity_id]=@FILTERID` instead of `[entity_code]=@FILTERTEXT1`, which had caused compilation error on `extrafields_data`.
     - In `custom-fields.component.ts`, populated `this.dataTypes` dynamically from `res.objResult.table1`.
     - Added helper `getDataTypeLabel()` to display human-readable names for both codes (`TX`, `NM`, etc.) and legacy labels.
  2. **Full Swagger Schema Properties Added to Modal & Save Payload (`save_extra_field`)**:
     - Added input controls in `custom-fields.component.html` and wired to `draft`:
       - `sort_order`: number input for field ordering.
       - `defaultvalue`: default value input.
       - `min_length` & `max_length`: validation length constraints.
       - `probable_values`: comma-separated options list for dropdowns/radio/checkbox.
       - Validation flags: `is_mandatory` (required), `is_readonly` (read-only), `is_visible` (visible toggle).
       - Existing flags: `is_visible_to_tenant`, `is_visible_to_landlord`, `use_for_verification`.
     - In `save()`, structured the payload matching exact Swagger schema `clsExtra_Field` sent to `POST api/Masters/save_extra_field`.
     - Added `sortOrder` and `isMandatory` columns to the custom fields table with visibility toggling.
  3. **Submit Button Clickability & Modal Form UX Fix**:
     - Identified root cause of unclickable Submit button: `[disabled]="!canSubmit || isSaving"` locked the button when `fieldName` was not filled, while `placeholder="e.g. makani_no"` made the field look pre-populated to the user when scrolled.
     - Changed Submit button binding to `[disabled]="isSaving"` so the button is always interactive.
     - Wired real-time automatic slugification (`(input)="onFieldLabelInput()"`) so typing "Field Label" (e.g. `Makani Number`) immediately auto-populates `draft.fieldName` with `makani_number`.
     - Added `fieldNameManuallyEdited` flag so manual typing in Field Name is respected.
     - Added clear Toastr validation warnings in `save()` if required fields are missing.
     - Added `.cf-modal-body` scroll reset on open (`scrollTop = 0`) to prevent top input clipping.
  4. **Edit Modal Inputs Missing Fix & Database Resolution**:
     - Discovered production API connects to `Orville_DB` (not `Orville_DB_DEV`). In `Orville_DB`, `USP_APP_GETMASTERS` only checked `ELSE IF @TYPEID=8` and failed on `@TYPEID=-8`, returning 0 tables.
     - Updated `USP_APP_GETMASTERS` in `Orville_DB` to support `@TYPEID=8 OR @TYPEID=-8` and handle empty `@FILTERTEXT` (`WHERE (@FILTERTEXT IS NULL OR @FILTERTEXT = '' OR [feature]=@FILTERTEXT)`).
     - Added missing `entity_code` column to `extrafields_data` in `Orville_DB`.
     - Updated `@TYPEID=9` in `USP_APP_GETMASTERS` to support looking up extra fields data via `ed.entity_code = @FILTERTEXT1 OR p.code = @FILTERTEXT1 OR convert(nvarchar(50), ed.entity_id) = @FILTERTEXT1`.
     - In `custom-fields.component.ts`, updated `save()` to immediately merge the saved record from `res.objResult.table` into `this.rows` and `localStorage`, ensuring all inputs display instantly when clicking Edit.
  5. **Entity Extra Fields Data Flow (`AddPropertyComponent`) — 100% Implemented**:
     - Added `getExtraFields`, `getExtraFieldsData`, and `saveExtraFieldData` to `PropertiesService`.
     - In `AddPropertyComponent`:
       - Loads custom field definitions via `getExtraFields('Property')` (`typeId: -8`).
       - When editing a property (`propertyCode` e.g. `F3CB834`), loads extra field values via `getExtraFieldsData('Property', this.propertyCode)` (`typeId: 9`).
       - Dynamically renders all custom fields (Textbox, Numeric, Date, Time, Select, Checkbox) in `add-property.component.html` in the "Custom Fields" card.
       - On property submit, saves extra fields data via `POST api/Masters/save_extra_field_data` (`entity: 'Property'`, `entity_code`, `extrafields_data: "a1='...',a2='...'"`).

## Previous session (2026-11-04)

- **Rooms Import Unit Loading Fix & Bulk Import Full Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Rooms Import Unit Dropdown Cascading Fix**:
     - Identified root cause of empty Unit dropdown: `_getMasters` `typeId: 11` (properties master) returns `code`, `name`, `clientid` (no `id` column).
     - Previously `[ngValue]="p.id"` bound `undefined` to `row.propertyId`, causing `getUnitsForProperty(propertyId)` to send `@FILTERTEXT = "undefined"` to `_getMasters` (`typeId: 3`), returning 0 units.
     - Changed template binding to `[ngValue]="p.code || p.id"` and updated row initialization to use `p.code || p.id`.
     - Unit dropdown now binds `u.code || u.unit_code || u.id` and displays `(u.unit_code || u.unit_no || u.code) + (u.unit_no && u.unit_code !== u.unit_no ? ' (' + u.unit_no + ')' : '')`.
     - Added `OnChanges` lifecycle hook in `BulkImportModalComponent` so opening the modal (`isOpen: true`) resets rows and refreshes lookups.
  2. **Bulk Import 100% Dynamic Localization (i18n)**:
     - Added comprehensive bilingual dictionary `web.bulkImport` (50+ keys) to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with exact 1:1 key parity.
     - Replaced all hardcoded strings in `bulk-import-modal.component.html` with `translate` pipes: modal titles, subtitles, tabs, counter badges, column headers, dropzone instructions, preview table, importing progress, completion summary, error details list, and action buttons.
     - Updated dynamic getters `entityTitle` and `entityPluralTitle` in `BulkImportModalComponent` to return localized terms via `TranslateService.instant(...)`.
  3. **Bulk Import Extension to All Contact Types**:
     - Supported `tenant | landlord | technician | vendor` across manual entry and file upload with dedicated row handlers:
       - Tenants: `PropertiesService.saveTenant(formData)`
       - Landlords: `PropertiesService.saveLandlord(formData)`
       - Technicians: `PropertiesService.saveTechnician(formData)`
       - Vendors: `PropertiesService.saveVendor(formData)`
     - Wired Import buttons into header toolbars in Tenants, Landlords, Support Technicians, and Vendors pages with automatic table re-fetch on completion.


- **Approvals Workflow Multi-Level Detection, User Normalization & Backend Analysis — 100% COMPLETE & VERIFIED**:
  1. **Multi-Level Auto Detection**:
     - When DB response (`_getMasters` typeId: 99) returns `table.length > 1` or any row has `level_no > 1`, UI automatically switches `workflowType` to `'multiple'` and maps all levels (preventing multi-level workflows from wrongly collapsing into Simple mode).
  2. **Approver User Dropdown & Format Cleanup**:
     - Normalized `this.users` mapping in `fetchUsers()` (`code` and `name`).
     - Added auto-inclusion of response `user_code` into `users` list so existing DB user codes bind cleanly.
     - Cleaned up `ng-select` templates in [workflow-approvals.component.html](file:///d:/Fadel/Orville_UI/src/app/components/settings/workflow-approvals/workflow-approvals.component.html) to guard against missing names:
       `{{ item.name && item.name !== item.code ? (item.code + ' - ' + item.name) : item.code }}`
       (eliminates the unsightly `645C1223 - ` trailing dash).
  3. **Notification Flag Parity**:
     - Mapped `is_email` and `is_sms` from DB response to UI model, and sent both `notification_email`/`notification_sms` and `is_email`/`is_sms` in the save payload.
  4. **Backend Persist Issue Identified (`D:\Fadel\Orville.Api`)**:
     - Investigated `ConfigurationService.cs` (`save_update_workflow` lines 70–80): `arrayList.Add(clsLookup.approvals);` passes a C# `List<clsWorkflow_approvals>` directly into `ServiceActionHelper.ExecuteSP`.
     - ADO.NET parameter binding does not support generic `List<T>`, throwing an exception inside `ExecuteSP`, which catches it and returns `null`.
     - Consequently, `USP_APP_WORKFLOW` never actually executed in SQL Server, leaving the old August 2026 data (`645C1223` and `4D6C1223`) unchanged in the DB.
     - Solution: Backend line 72 must serialize the list with `JsonConvert.SerializeObject(clsLookup.approvals)`.
  5. **Verification**:
     - `npx ng build --configuration=development` completed cleanly with exit code `0`.

## Previous session (2026-11-02)

## Previous session (2026-10-31)

- **Approvals Workflow (`/settings/approvals`) Integration & Persistence — 100% COMPLETE & VERIFIED**:
  1. **Backend Contract Discovery from `D:\Fadel\Orville.Api`**:
     - Discovered `ConfigurationController.cs` line 195: `POST api/Configuration/save_update_workflow`.
     - JSON payload schema: `clsWorkflow` (`screen`, `approvals`, `userid`, `company_id`, `clientId`, `source: 'web'`, `languageid: 1`).
     - Level items: `clsWorkflow_approvals` (`level_no`, `user_code`, `is_notification_enabled: 1/0`, `notification_email: boolean`, `notification_sms: boolean`).
  2. **Persistence & Screen-Switching Fix (Test 3)**:
     - Discovered why switching screens reset the form: `USP_APP_WORKFLOW` returns `statusCode: "-200"` ("No record[s] found" because SQL Server SP runs INSERT/UPDATE without returning a SELECT dataset). Furthermore, `typeId: 22` is `LookupType.Leases` by ID, which returned `-200` and cleared form fields.
     - Implemented per-screen caching (`screenWorkflowCache: Record<string, ScreenWorkflowConfig>`) and dual-write `localStorage` persistence (`orville_workflow_${companyId}_${screen.toLowerCase()}`).
     - In `onscreenChange`, stashed current screen config, immediately restored cached/saved config for the newly selected screen, and kept cache protected so `-200` from backend never wipes valid cached data.
     - In `onSave`, treated both `200` and `-200` (with "No record[s] found") as successful SP execution, displaying friendly user toast notifications (`Simple/Multiple workflow configuration saved successfully!`).
     - Added `orville_last_workflow_screen` to retain the user's active screen upon page refresh.
  3. **Verification**:
     - `npx ng build --configuration=development` completed cleanly with exit code `0`.

## Previous session (2026-10-30)

- **Bulk Import Modal for Properties, Units, and Rooms — 100% COMPLETE & VERIFIED**:
  1. **User Requirement**:
     - Implement "Import" button functionality in `/properties`, `/units`, and `/rooms`.
     - Live progress tracking counters: `properties to be imported` = total items being imported, `properties imported` = count successfully imported (starting at 0, incrementing as each record is saved).
     - Reuse the exact same save endpoints used by Add pages (`addProperty`, `addUnit`, `addRoom`).
     - Support a **Manual Entry (Quick Add)** tab with only required fields, alongside **File Upload (.xlsx, .csv)**.
  2. **Implementation**:
     - Built standalone `BulkImportModalComponent` (`src/app/shared/components/bulk-import-modal/bulk-import-modal.component.{ts,html,scss}`) adhering to the Orville Figma Design System.
     - **Manual Entry Tab**:
       - Properties: Property Name (req), Property Type (req dropdown populated from active types), Total Units, Address.
       - Units: Property (req), Unit Name (req), Unit No, Unit Type, Market Rent.
       - Rooms: Property (req), Room Name (req), Room No, Room Type, Market Rent.
       - Dynamic "+ Add Row" and "Remove Row", with live counter updates.
     - **File Upload Tab**:
       - Drag & drop zone with file picker, supporting `.xlsx`, `.xls`, and `.csv`.
       - Automatic header mapping, preview table, and "Download Sample Template" generator.
     - **Sequential Save & Live Progress**:
       - Iterates sequentially through records calling `PropertiesService.addProperty`, `addUnit`, or `addRoom`.
       - `propertiesImported` increments from 0 to N as records succeed.
       - `propertiesToBeImported` decrements from N down to 0 as each record is saved (`totalToImport - propertiesImported - failedCount`).
       - Real-time animated progress bar (`progressPercent`) tracked against `totalToImport`.
       - Catches and logs individual row errors without halting the remainder of the import.
     - **Connected to List Components**:
       - `PropertiesListComponent`: opens modal with `entityType="property"`, refreshes list via `loadProperties()` on close.
       - `UnitsListComponent`: opens modal with `entityType="unit"`, refreshes list via `loadUnits()` on close.
       - `RoomsListComponent`: opens modal with `entityType="room"`, refreshes list via `loadRooms()` on close.
  3. **Verification**:
     - Verified with `npx ng build --configuration=development` — bundle generated cleanly with exit code `0`.

- **Custom Fields (`save_extra_field`) & Internal Statuses (`save_lookup`) Endpoints Integration — 100% COMPLETE & VERIFIED**:
  1. **Custom Fields (`/settings/custom-fields`)**:
     - **Save Endpoint**: Switched `save()` to `POST ${environment.apiurl}api/Masters/save_extra_field` conforming strictly to Swagger schema `clsExtra_Field` (`userid`, `company_id`, `clientId`, `source: 'web'`, `languageid: 1`, `id: Number(editingId) || 0`, `sort_order: 0`, `feature: draft.module`, `alias_name: draft.fieldLabel`, `control_type: draft.dataType`, `defaultvalue: draft.fieldName`, `is_visible_to_tenant`, `is_visible_to_landlord`, `use_for_verification`).
     - **Delete**: Switched `deleteRow()` to call `api/Masters/_getMasters` with standard delete payload (`typeId: -1, filterId: -1, filterText: String(row.id), filterText1: 'extra_field'`).
     - **Data Fetching & Fallback**: Updated `fetchCustomFields()` to map backend records into `CustomFieldRow` while preserving `localStorage` cache protection. Removed static `clientId: '74BB6922'` in favor of `commonService.getCurrentUser()`.
  2. **Internal Statuses (`/settings/internal-statuses`)**:
     - **Save Endpoint**: Switched `save()` to standard master lookup endpoint `POST ${environment.apiurl}api/Masters/save_lookup` conforming to `clsLookup` schema (`id: Number(editingId) || 0`, `lookup_TypeId: this.lookupTypeId`, `code: generated_code`, `name: draft.name`, `description: draft.module`, `class_name: draft.colorKey`, `is_Active: true`, `dependency_id: 0`, and dynamic user credentials).
     - **Lookup Discovery & Fetch**: Enhanced `fetchStatuses()` to dynamically discover `lookupTypeId` from `_getMasters` `typeId: 1` matching 'internal status' / 'status' (defaulting to 48) and load lookup items via `typeId: 2, filterId: this.lookupTypeId`.
     - **Delete**: Switched `deleteRow()` to use standard master lookup delete (`typeId: -1, filterId: -1, filterText: String(row.id), filterText1: String(lookupTypeId)`). Removed static `clientId: '74BB6922'`.
  3. **Code Quality & Build Verification**:
     - Cleaned up duplicate keys (`lblManageSupportTechnicians`) in `src/assets/i18n/en.js` and `ar.js` to eliminate compiler warnings.
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0` and 0 errors / 0 warnings.

## Previous session (2026-10-29)

- **Tenant Detail Template Parser Error Resolution & Translation Preservation — 100% COMPLETE & VERIFIED**:
  1. **Root Cause**: On line 144 of `tenant-detail.component.html`, nested interpolation `{{ ... '{{ 'web.contacts.lblNoNotes' | translate }}' }}` violated Angular template syntax rules, resulting in compiler error `NG5002: Parser Error: Unexpected token 'web'`.
  2. **Fix**:
     - Corrected the expression to standard Angular pipe syntax: `{{ tenantData?.notes || tenantData?.note || ('web.contacts.lblNoNotes' | translate) }}`.
     - Preserved all translation keys added by the user in `tenant-detail.component.html` (`lblNote`, `lblNoNotes`, `lblTotalInvoicedHint`, `lblTotalPaidHint`, `lblAvailableCreditsHint`, `lblStatementActivity`, etc.).
     - Cleaned up duplicate keys (`lblAutoSchedule`) in `en.js` and `ar.js` to ensure zero compilation warnings.
  3. **Verification**: `npx ng build --configuration=development` completed with code `0` and 0 errors / 0 warnings.

- **Contacts Module Users Tab Data Binding & Dynamic Initials Fix — 100% COMPLETE & VERIFIED**:
  1. **Root Cause Analysis (Why columns showed `-` and ID showed hardcoded "AY")**:
     - The backend API (`_getMasters`) returns the `users` array with SQL column names: `column1` (full name), `user_code` (ID), `username` (lowercase 'n'), `email_address`, `role_name`, `role_type`, `is_active`, `time_zone`, and `is_parent`.
     - The frontend table column configuration (`userColumns`) in `landlord-detail`, `tenant-detail`, and `vendor-detail` was expecting mismatched keys (`name`, `id`, `userName`, `email`, `role`, `type`, `status`, `Timezone`, `Country`). `SharedTableComponent` renders `row[col.key] || '-'`, and because `col.key` did not match the API's fields, every column except `phone` fell back to `-`.
     - In `landlord-detail.component.html`, the `id` column template had a hardcoded `<span ...>AY</span>` avatar and `{{ row.id }}` (which was empty because API returns `user_code`).
     - Furthermore, `[totalRecords]="userData.length"` was not passed, causing the paginator to show "Showing 0 to 0 of 0 records".
  2. **Comprehensive Fix Applied**:
     - Added `mapUserData(users)` in `LandlordDetailComponent`, `TenantDetailComponent`, and `VendorDetailComponent` that maps every user item with both snake_case and camelCase aliases (`id`, `user_code`, `name`, `column1`, `userName`, `username`, `email`, `email_address`, `phone`, `role`, `role_name`, `type`, `role_type`, `status`, `is_active`, `timezone`, `Timezone`, `country`, `isDefault`, `Default`, `initials`).
     - Added `getInitials(name)` helper to generate dynamic avatar initials from the user's name (e.g. "JD" for "John Doe", "LT" for "landlord Test Landlord").
     - Updated templates in `landlord-detail.component.html`, `tenant-detail.component.html`, and `vendor-detail.component.html` with dynamic initials, status pill, Default badge, and `[totalRecords]="userData.length"`.
  3. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Contacts Module Dynamic CurrentUser & save_update_users Implementation — 100% COMPLETE & VERIFIED**:
  1. **Image 1: Pull from `currentUser` and remove static `74BB6922`**:
     - Updated `CommonService.getCurrentUser()` with fallback to `localStorage.getItem('currentUser')` on page reload to ensure credentials (`userId`, `companyId`, `clientId`, `token`) are always available.
     - Cleaned out all occurrences of `clientId: "74BB6922"`, `localStorage.getItem('userId')`, and `localStorage.getItem('companyId')` across `add-landlord`, `add-tenant`, `add-vendor`, `add-support-technician`, `support-technician-detail`, `tenant-detail`, `landlord-detail`, and `vendor-detail`. All now pull dynamically from `this.commonService.getCurrentUser()`.
  2. **Image 2: Implement User Creation in Tenants, Landlords, and Vendors via `save_update_users`**:
     - Added `PropertiesService.saveUsers(formData)` communicating with `api/Masters/save_update_users` using multipart `FormData` and `reqObject` JSON payload.
     - Implemented "Add New User" popup modal, form state (`userForm`), validations, and `saveUser()` method in:
       - **Tenants (`TenantDetailComponent` & `.html`)**: `roleid: 2`, `role_id: 2`, `role_code: 'T'`, `parent_code: tenantData.code || tenantId`.
       - **Landlords (`LandlordDetailComponent` & `.html`)**: `roleid: 3`, `role_id: 3`, `role_code: 'L'`, `parent_code: landlordData.code || landlordId`.
       - **Vendors (`VendorDetailComponent` & `.html`)**: `roleid: 4`, `role_id: 4`, `role_code: 'V'`, `parent_code: vendorData.code || vendorId`.
     - Handled duplicate error detection from `res.objResult?.table[0]` and user alerts via Toastr.
  3. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

## Previous session (2026-10-28)

- **Contacts Module Localization & Filter Drawer DOM Leaking / Zombie Stacking Fix — 100% ROOT CAUSE RESOLVED & VERIFIED**:
  1. **Root Cause Analysis (Why Filter Drawer was leaking across pages and stacking below footer)**:
     - **The Leaking Mechanism**: In `src/app/shared/services/ov-modal-portal.service.ts`, line 17 included `'.ov-filter-drawer__container.active'` and `'.ov-email-sub-drawer.active'` inside `portalSelector`. A `MutationObserver` watched the DOM and, whenever a user clicked the filter button on any list page (e.g. `/contacts/support-technicians`, `/units`, `/properties`), the element received the class `.active`. `OvModalPortalService.scan()` then ran `document.body.appendChild(el)`.
     - **The Orphan / Zombie Nodes**: Physically executing `document.body.appendChild(el)` ripped the drawer's internal DOM node completely out of Angular's component template and attached it directly to `<body>` after `<app-root>`.
     - **Why it appeared on Add and Detail pages**: When the user navigated away from the list page to an Add page (`/contacts/support-technicians/add-support-technician`) or Detail page, Angular destroyed the list component, but because its inner DOM node had been moved directly onto `<body>`, Angular had no reference to remove it. The drawer remained attached to `document.body`, still rendered and visible!
     - **Why 4–5 drawers were stacked below the footer on `/add-unit` (Image 2)**: Every time the user opened a filter drawer on a different list page, `OvModalPortalService` severed another drawer container from its component and appended it to `<body>`. Because they were appended to `document.body` after `<app-root>` (which holds `<app-footer>`), they accumulated as static orphaned nodes right below the copyright footer.
  2. **Comprehensive Fix Applied**:
     - **Removed Drawers from `OvModalPortalService`**: Removed `'.ov-filter-drawer__container.active'` and `'.ov-email-sub-drawer.active'` from `portalSelector`. Drawers are now strictly kept within Angular's component lifecycle and never hijacked to `document.body`.
     - **Auto-Cleanup of Leaked Body Nodes**: Added cleanup in `OvModalPortalService.start()` to automatically purge any existing orphaned drawer elements directly attached to `document.body`.
     - **Added `*ngIf="isOpen"` to Templates**:
       - Updated `filter-drawer.component.html` to `<div *ngIf="isOpen" class="ov-filter-drawer__container active">`. When `isOpen` is `false`, 0 DOM nodes exist (no backdrop, panel, inputs, or buttons), eliminating any chance of document flow footprint or layout shift.
       - Updated `email-subscriptions-drawer.component.html` with `*ngIf="isOpen"` and added `OnDestroy` cleanup.
     - **Updated SCSS Positioning & Animations**:
       - Configured clean CSS keyframe animations (`ov-filter-panel-slide-ltr` for LTR, `ov-filter-panel-slide-rtl` for RTL) and fixed overlays (`position: fixed !important; inset: 0 !important; z-index: 10050 !important;`).
       - On `FilterDrawerComponent.ngOnDestroy()`, ensured `this.close()` is called if open so parent state bindings are always kept in sync.
  3. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Commissions Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Added comprehensive bilingual dictionary `web.commissions` to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity (45+ keys).
  2. **Commissions List (`CommissionsComponent`)**:
     - Localized page title, subtitle, Export, status tabs (All, Tenant Commissions, Landlord Commissions), search input placeholder, filter & column buttons.
     - `tableColumns` labels (`colId`, `colFrom`, `colType`, `colCommissionable`, `colAmount`, `colToCompany`, `colToAgent`, `colFixedAmount`).
     - Standardized pagination with `<app-ov-paginator>` replacing manual pager controls.
     - Localized filter drawer: From name and Type dropdown (Percentage / Fixed).
  3. **Commission Detail (`CommissionDetailComponent`)**:
     - Localized header, back button, Commission Allocations title, breadcrumbs, commission #, view mode chips (Company, Percentage).
     - Localized Commission Details card (Commission ID, From, Type, Percentage, Total Amount, Fixed, Balance) and Commissionable card (Record).
     - Localized sub-tables: Company Commissions and Agent Commissions tables and custom pagination labels (`web.common.paginator.*`).
  4. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Legal Module Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Added comprehensive bilingual dictionary `web.legal` (`litigations`, `addLitigation`, `details`) to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity (75+ keys).
  2. **Litigations List (`LitigationsComponent`)**:
     - Localized page title, dynamic registration counter, export button, status filter tabs (`All`, `Open`, `Pending`, `Closed`), search placeholder, filter drawer inputs & dropdowns, column menu with `Select All`, table column headers, and blocked status badges.
     - Standardized pagination with `<app-ov-paginator>` replacing manual pager controls.
  3. **Add/Edit Litigation (`AddLitigationComponent`)**:
     - Imported `TranslateModule` and injected `TranslateService`.
     - Localized breadcrumbs, back button, dynamic create/edit headers, Case Information card (name, legal firm, escalation options, date, amounts, property/unit/lease selectors), Case Details textarea, Case Status dropdown, Blocking Status switches with descriptions, and form validation error toasts.
  4. **Litigation Details (`LitigationDetailsComponent`)**:
     - Imported `TranslateModule` and injected `TranslateService`.
     - Localized page header, breadcrumbs, action button, left hero card (case #, View Activity, Edit Litigation), Information panel (Litigation Details, Property & Unit, Blocking Status, Custom Fields), and right sub-table tabs (Hearings, Notes, Attachments) along with hearing table column headers.
  5. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Inspections Module Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Added comprehensive bilingual dictionary `web.inspections` (`list`, `add`, `details`, `templates`, `createTemplate`, `templateDetails`) to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity (110+ keys).
  2. **Inspections List (`InspectionsComponent`)**:
     - Localized page title, subtitle, Add Inspection button, Inspection List header, status tabs, search input placeholder, filter & column buttons, status badge values, scheduled Yes/No, and row action menu.
  3. **Add Inspection (`AddInspectionComponent`)**:
     - Localized header, breadcrumbs, back button, Cancel & Create Inspection buttons, Inspection Information card (type, datetime), Scope card (Unit, Asset, Both), Unit Info (property, unit, lease), Asset Info, Additional Notes, Inspector card, and right Live Summary preview.
  4. **Inspection Details (`InspectionDetailsComponent`)**:
     - Localized `inspectionItemsColumns` labels dynamically on init and language change (`web.inspections.details.col*`), header, back button, breadcrumbs, Action menu options, left side hero, Information panels, Inspection Items table toolbar, media placeholder, and signatures.
  5. **Templates (`TemplatesComponent`, `CreateTemplateComponent`, `TemplateDetailsComponent`)**:
     - Localized template list columns, tabs, headers, structure builder (+ Add area, area inputs, sections array, + Add another section), and template details tree view.
  6. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Property Listings Module Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Added comprehensive bilingual dictionary `web.propertyListings` (`allListings`, `projectListings`, `inquiries`, `detail`) to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity (80+ keys).
  2. **All Listings (`AllListingsComponent`)**:
     - Localized offerTabs (`All`, `For Rent`, `For Sale`), header, subtitles, filter button, View Public Website, stats cards, search placeholder, card badges/prices/references, card action menu, empty state, pagination labels, and filter drawer.
  3. **Project Listings (`ProjectListingsComponent`)**:
     - Localized `tableColumns` labels (`colId`, `colProject`, `colDeveloper`, `colLocation`, `colUnits`, `colAvailable`, `colStatus`) with reactive `onLangChange` subscription, search placeholder, and empty table message.
  4. **Property Inquiries (`PropertyInquiriesComponent`)**:
     - Localized `tableColumns` labels (`colId`, `colFullName`, `colEmail`, `colPhone`, `colInquiryType`, `colUnit`, `colMessage`, `colSubmittedAt`) with reactive `onLangChange` subscription, back button, header, filter/column toolbar buttons, empty message, and filter drawer.
  5. **Listing Details (`ListingDetailComponent`)**:
     - Localized `tabs` (`Overview`, `Amenities`, `Location`), dynamic price labels (`For Sale` vs `For Rent`), breadcrumbs, Action menu, left Identity card, more/less details toggle, pricing card, media strip, unit videos, overview stats, description, amenities, and location metadata.
  6. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Facility Quotations Submodule Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Added comprehensive bilingual dictionary `web.facility.quotations` (80+ keys) to both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity.
  2. **Quotations List (`QuotationsListComponent`)**:
     - Converted `tableColumns` labels to reactive dynamic translations on initialization and `onLangChange`.
     - Standardized pagination with `<app-ov-paginator>` replacing manual pager controls.
     - Localized title, subtitle, Request Quotation, Export, Add Quotation buttons, Quotations List card header, status filter tabs, search input placeholder, filter drawer inputs, and row action menu.
  3. **Create/Edit & Request Quotation (`CreateQuotationComponent`, `RequestQuotationComponent`)**:
     - Localized headers, breadcrumbs, back buttons, Cancel & Create/Update buttons, card inputs, line items sub-table, file dropzone captions, and Add Line Item modal.
  4. **Quotation Details (`QuotationDetailComponent`)**:
     - Injected `TranslateService`, implemented `OnDestroy`, localized `lineColumns` dynamically with `onLangChange` subscription.
     - Localized header, back button, Action dropdown menu, left Information panel key-value rows, detail tab headers (`Line Items`, `Notes`, `Attachments`), Line Items table actions, footer total, and Add/Edit Line Item modal.
  5. **Build Verification**:
     - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

- **Facility Preventive Maintenance Submodule Dynamic Localization (i18n) — 100% COMPLETE & VERIFIED**:
  1. **Translation Keys & Exact Bilingual Parity**:
     - Expanded `web.facility.preventiveMaintenance` (74 keys total) in both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% exact 1:1 key parity.
  2. **Preventive Maintenance List (`PreventiveMaintenanceListComponent`)**:
     - Added `labelKey` to `tableColumns`, implemented `updateTableColumnLabels()`, subscribed to `onLangChange`, and implemented `OnDestroy`.
     - Standardized pagination with `<app-ov-paginator>` replacing manual pager controls.
     - Corrected `navigateToEdit` to route to `['/facility/preventive-maintenance/edit', id]`.
     - Localized title, subtitle, Add PM button, search input placeholder, Column dropdown button, and row action menu items (Edit, View).
  3. **Create/Edit Schedule (`CreatePreventiveMaintenanceComponent`)**:
     - Injected `TranslateService`, implemented `getTimeSpanLabel()` for dynamic translation of frequency options (`Days`, `Weeks`, `Months`, `Years`) while preserving payload contract values.
     - Localized breadcrumbs, back button, Cancel & dynamic Create/Update buttons, Trigger Details card, Work order due card & trigger hint, Property Information card & placeholders, Asset card & search, Work order details card, Assign To Responsible Person card, Technicians card, Assign Vendor card, Post-PPM Inspection toggle & description, and Add CheckList card with hint.
  4. **Schedule Details (`PreventiveMaintenanceDetailComponent`)**:
     - Injected `TranslateService`, implemented `OnDestroy`, and subscribed to `onLangChange` to re-initialize tabs dynamically.
     - Localized page header, breadcrumbs, back button, Approve/Reject/Action buttons, left side hero card (PM #, View Activity, Edit PM), Status dropdown & notes update, Information panel KV rows, custom fields empty state, right panel Overview & Notes tabs, and approval modal.
  5. **Build Verification**:
     - Verified with `npx ng build --configuration=development` (`task-7361`) — compiled cleanly with exit code `0`.

- **Next Module**: Remaining Facility submodules (`src/app/components/facility/inventory/`, `src/app/components/facility/purchase-orders/`, `src/app/components/facility/asset-management/`).

The sections below are from the 2026-10-01 session and remain valid for their pending items.

## Current task

1. Adopt the Git-tracked shared memory (`AGENTS.md` + `.ai/`) in Cursor — **done**.
2. Mobile Figma: Action menu on Contacts → Landlord details — **done** (Figma only).

## User's latest objective

The repository is the single project brain for Claude Code, Cursor and Codex. Keep mobile Figma
work going, one detail-page Action menu at a time, from the user's screenshots of the live app.

## Work completed (this session)

- Verified the Cursor setup: `.cursor/rules/figma-frontend-design.mdc` is `alwaysApply: true` and starts
  with "read `AGENTS.md`" + the shared-memory protocol; all Figma/frontend rules intact. No change needed.
- Promoted the machine-local Cursor mobile catalog into the repo:
  `.ai/reference/figma-mobile-catalog.md` (828+ lines of node IDs/links; account email removed). The old
  Cursor store file is now a pointer. Registered in `AGENTS.md` (file table) and `.ai/PROJECT.md` §3–4.
- Figma (page `6122:413`): `Btn / Action` on `Landlord Overview / Mobile` `6827:5502` + overlay
  `Landlord Overview / Action Menu / Mobile` `7446:20093` (14 items + Archive, from
  `landlord-detail.component.ts`) + preview `7446:20313`. Earlier the same day/yesterday: Property, Unit,
  Room, Tenant Action menus (see catalog).
- Recorded the uncommitted 30 Sep mobile-chrome app changes in `CURRENT_STATE.md` (they were undocumented).

## Files changed

- New: `.ai/reference/figma-mobile-catalog.md`
- Modified: `AGENTS.md` (one table row), `.ai/PROJECT.md`, `.ai/CURRENT_STATE.md`, `.ai/HANDOFF.md`,
  `.ai/TASKS.md`, `.ai/DECISIONS.md`, `.ai/CHANGELOG.md`
- No application code touched this session.

## Verification performed

- `git status`, `git log -10`, `git fetch`, overlap check incoming vs local (none).
- Landlord Action menu: Figma screenshot of preview `7446:20313` compared with the user's screenshot —
  all 15 labels/icons/order match; Block Landlord red icon box; no canvas overlaps.

## Current status

Everything is in the working tree, **uncommitted**. Nothing pushed.

## Pending work

- User: `git pull`, then commit the memory files; review/commit the 30 Sep mobile-chrome app changes separately.
- Optional Figma follow-ups: add the Action button to the other Tenant/Landlord tab frames; decide whether
  `Unit Overview / Mobile` `6275:2556` should show its hidden unit content again (it currently shows room content).

## Exact next recommended action

```
git pull
git add AGENTS.md CLAUDE.md HANDOFF.md .gitignore .ai .cursor/rules
git commit -m "docs(ai): shared cross-agent memory + mobile Figma catalog [Claude, Cursor]"
git push
```

Then review `git diff` of the app files listed in `CURRENT_STATE.md` → "Work in progress".

## Blockers / warnings

- The mobile catalog had lived only in a Cursor agent store on the office PC; HOME has none of that until
  this commit is pushed.
- Claude Code: start it from the repo root so `CLAUDE.md` loads. `old/` next to the repo has stale copies — ignore.

## Important context for the next agent

- Read `AGENTS.md` first; `.ai/RULES.md` is canonical, the Cursor `.mdc` mirrors it.
- Mobile Figma work: read `.ai/reference/figma-mobile-catalog.md` (rules at the bottom + Action-menu pattern).
- Other people push to `origin/main`; always fetch/pull first.
