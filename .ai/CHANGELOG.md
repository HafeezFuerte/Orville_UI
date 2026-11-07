# Cross-Agent Changelog
 
Append-only. Newest entry at the top. Keep entries short; no pasted conversations.
 
## 2026-11-07 — Antigravity, Merge Conflict Resolution (Teammate Commit 534c030d)

Task: Resolve git merge conflicts resulting from pulling teammate's commit `534c030d` (`Publish/Unpublish Properties & delete in workorder`):
1. Cleanly merged teammate's screen selector (`selectedScreen`, `screens`, `onscreenChange`) into Custom Fields.
2. Resolved all conflict markers in `custom-fields.data.ts`, `custom-fields.component.ts`, and `custom-fields.component.html`.
3. Preserved full Swagger draft model, real-time slugification, dynamic data types via `_getMasters` `typeId: -8`, all 6 checkboxes, and entity extra fields integration.
4. Resolved `openEdit` to seamlessly support both camelCase and snake_case row properties returned from database SPs.
5. Verification: `npx ng build --configuration=development` compiled cleanly with exit code 0.
6. Changed:
   - src/app/components/settings/custom-fields/custom-fields.data.ts
   - src/app/components/settings/custom-fields/custom-fields.component.ts
   - src/app/components/settings/custom-fields/custom-fields.component.html
   - .ai/CHANGELOG.md
   - .ai/CURRENT_STATE.md
   - .ai/HANDOFF.md

## 2026-11-07 — Antigravity, Custom Fields Dynamic Data Types (typeId: -8) & Swagger Schema Implementation

Task: Implement dynamic data types via `_getMasters` `typeId: -8`, add all Swagger marked fields to Custom Fields modal and save payload, and configure entity custom field data flow:
1. Dynamic Data Types via `_getMasters` `typeId: -8`:
   - `USP_APP_GETMASTERS` with `typeId: -8` (and `8`) returns `table1` with all 10 system control types (`Textbox [TX]`, `Numeric [NM]`, `Date [DT]`, `Time [TI]`, `Select [DL]`, `SelectPicker [DP]`, `FileUpload [FU]`, `Image [IM]`, `RadioButton [RB]`, `CheckBox [CK]`).
   - Fixed SQL Server stored procedure bug where `typeId: 9` had `[entity_id]=@FILTERID` instead of `[entity_code]=@FILTERTEXT1`.
   - In `custom-fields.component.ts`, populated `dataTypes` dynamically from `res.objResult.table1`.
   - Added `getDataTypeLabel()` to display human-readable names for both codes (`TX`, `NM`, etc.) and legacy labels.
2. Full Swagger Schema Properties Added to Modal & Save Payload:
   - Added input controls in `custom-fields.component.html` and wired to `draft`:
     - `sort_order`, `defaultvalue`, `min_length`, `max_length`, `probable_values`.
     - Validation flags: `is_mandatory`, `is_readonly`, `is_visible`.
     - Existing flags: `is_visible_to_tenant`, `is_visible_to_landlord`, `use_for_verification`.
   - In `save()`, structured the payload matching exact Swagger schema `clsExtra_Field` sent to `POST api/Masters/save_extra_field`.
   - Added `sortOrder` and `isMandatory` columns to the custom fields table.
3. Submit Button Clickability & Modal Form UX:
   - Removed `!canSubmit` hard-lock on modal Submit button (`[disabled]="isSaving"`).
   - Added real-time auto-slugification from `Field Label` to `Field Name` (`(input)="onFieldLabelInput()"`).
   - Added manual edit tracking (`fieldNameManuallyEdited`) so custom field names are retained.
   - Added Toastr validation warning in `save()` if required fields are missing.
   - Fixed modal body scrolling on open (`scrollTop = 0`) to avoid input clipping.
4. Database & Entity Integration (`AddPropertyComponent`):
   - Fixed `USP_APP_GETMASTERS` in `Orville_DB` to support `@TYPEID=8 OR @TYPEID=-8` and handle optional/empty `@FILTERTEXT` (previously only checked `@TYPEID=8`, returning 0 tables and causing mock data fallback on edit).
   - Added `entity_code` column to `extrafields_data` in `Orville_DB` and updated `@TYPEID=9` lookup to support `@FILTERTEXT1` matching property code `F3CB834`.
   - In `custom-fields.component.ts`, updated `save()` to immediately merge `res.objResult.table` rows into `this.rows` and `localStorage`, ensuring all saved properties display immediately upon editing.
   - Added `getExtraFields`, `getExtraFieldsData`, and `saveExtraFieldData` to `PropertiesService`.
   - In `AddPropertyComponent`, dynamically fetched custom fields (`typeId: -8`), retrieved entity values (`typeId: 9`, `filterText1: propertyCode`), dynamically rendered controls in the Custom Fields card, and saved values via `POST api/Masters/save_extra_field_data`.
5. Changed:
   - src/app/components/settings/custom-fields/custom-fields.data.ts
   - src/app/components/settings/custom-fields/custom-fields.component.ts
   - src/app/components/settings/custom-fields/custom-fields.component.html
   - src/app/components/settings/custom-fields/custom-fields.component.scss
   - src/app/components/portfolio/services/properties.service.ts
   - src/app/components/portfolio/properties/create-new-property/add-property.component.ts
   - src/app/components/portfolio/properties/create-new-property/add-property.component.html
   - .ai/CURRENT_STATE.md
   - .ai/HANDOFF.md
   - .ai/CHANGELOG.md



Task: Fix empty unit dropdown in Rooms bulk import modal, and add 100% dynamic bilingual localization (i18n) for the modal:
1. Rooms Import Unit Cascading Bug Fix:
   - Root cause: `_getMasters` `typeId: 11` returns `code`, `name`, `clientid` (no `id` column). Template binding `[ngValue]="p.id"` bound `undefined`, causing `getUnitsForProperty()` to query `@FILTERTEXT = "undefined"` and return 0 units.
   - Updated template property select binding to `[ngValue]="p.code || p.id"`.
   - Updated unit select binding to `[ngValue]="u.code || u.unit_code || u.id"` and label to `(u.unit_code || u.unit_no || u.code) + (u.unit_no && u.unit_code !== u.unit_no ? ' (' + u.unit_no + ')' : '')`.
   - Added `OnChanges` lifecycle hook in `BulkImportModalComponent` to reset and reload rows/lookups when modal opens.
2. Full Bilingual Localization (i18n):
   - Added `web.bulkImport` object with 50+ keys to `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with exact 1:1 key parity.
   - Localized all modal components in `bulk-import-modal.component.html` (titles, subtitle, tabs, badges, headers, dropzone text, file preview, progress status, completion summary, error details, and footer buttons).
   - Localized entity names dynamically via `TranslateService.instant(...)`.
3. Changed:
   - src/assets/i18n/en.js
   - src/assets/i18n/ar.js
   - src/app/shared/components/bulk-import-modal/bulk-import-modal.component.ts
   - src/app/shared/components/bulk-import-modal/bulk-import-modal.component.html
   - .ai/CURRENT_STATE.md
   - .ai/HANDOFF.md
   - .ai/CHANGELOG.md



Task: Support cascading Unit selection under Property in Rooms bulk import, and add Bulk Import buttons/modals to Tenants, Landlords, Support Technicians, and Vendors:
1. Rooms Import Unit Cascading Support:
   - Implemented `Property -> Unit -> Room` cascading hierarchy in `BulkImportModalComponent`.
   - Dynamically loads and caches units per property via `PortfolioService.getMasterByType({ typeId: 3, filterId: 0, filterText: propCode })`.
   - Added required `Unit *` dropdown column between Property and Room Name. Selecting a property triggers `onRoomPropertyChange()` to auto-populate units for that property.
   - Excel sample template updated with `Unit ID`.
2. Bulk Import for Contacts (Tenants, Landlords, Technicians, Vendors):
   - Extended `BulkImportModalComponent` with `'tenant' | 'landlord' | 'technician' | 'vendor'`.
   - Implemented manual contact rows (`First Name *`, `Last Name *`, `Email *`, `Mobile / Phone *`, `Company Name`).
   - Wired save methods to respective API endpoints via `PropertiesService` (`saveTenant`, `saveLandlord`, `saveTechnician`, `saveVendor`).
   - Added custom sample Excel download templates per contact entity type.
3. Contact List Pages Integration:
   - Added Import ghost button (`ri-upload-2-line`) next to Export button in header.
   - Embedded `<app-bulk-import-modal>` with auto-reload upon import completion in `TenantsComponent`, `LandlordsComponent`, `SupportTechniciansComponent`, and `VendorsComponent`.
4. Verification:
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/shared/components/bulk-import-modal/bulk-import-modal.component.ts
- src/app/shared/components/bulk-import-modal/bulk-import-modal.component.html
- src/app/components/contacts/tenants/tenants.component.ts
- src/app/components/contacts/tenants/tenants.component.html
- src/app/components/contacts/landlords/landlords.component.ts
- src/app/components/contacts/landlords/landlords.component.html
- src/app/components/contacts/support-technicians/support-technicians.component.ts
- src/app/components/contacts/support-technicians/support-technicians.component.html
- src/app/components/contacts/vendors/vendors.component.ts
- src/app/components/contacts/vendors/vendors.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/DECISIONS.md
- .ai/CHANGELOG.md

## 2026-11-03 — Antigravity, Workflow Multi-level Detection & User Mapping Refinement

Task: Resolve workflow type detection, user dropdown normalization, and notification flag mapping:
1. Multi-Level Auto Detection:
   - When the backend response (`_getMasters` typeId: 99) has `table.length > 1` or any row with `level_no > 1`, automatically configure `workflowType = 'multiple'` and populate all approval levels (preventing multi-level workflows from wrongly collapsing into Simple Workflow).
2. Approver User Display & Normalization:
   - Normalized `users` in `fetchUsers()` (`code` and `name`).
   - Cleaned up `ng-select` templates in `workflow-approvals.component.html` to avoid trailing dashes when user names are unavailable (`item.name && item.name !== item.code ? item.code + ' - ' + item.name : item.code`).
   - Added auto-inclusion of response `user_code` into `users` list so existing DB user codes bind cleanly.
3. Notification Flag Parity:
   - Mapped `is_email` / `is_sms` from DB response to UI model, and sent both `notification_email` / `notification_sms` and `is_email` / `is_sms` in `save_update_workflow` payload.
4. Verification:
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/components/settings/workflow-approvals/workflow-approvals.component.ts
- src/app/components/settings/workflow-approvals/workflow-approvals.component.html
- .ai/CHANGELOG.md
- .ai/HANDOFF.md

## 2026-11-02 — Antigravity, Approvals Workflow API Fetch (TypeId 99) & LocalStorage Removal

Task: Wire workflow retrieval to backend getMasters typeId: 99 and remove client-side localStorage caching:
1. Pure API Flow:
   - Configured `fetchSavedWorkflow()` in `WorkflowApprovalsComponent` to call `POST api/Masters/_getMasters` with `typeId: 99` and `filterText: this.selectedScreen`.
   - Removed all `localStorage` reads/writes (`orville_workflow_*`, `orville_last_workflow_screen`) and `screenWorkflowCache`.
   - When switching screens or saving, data flows directly to/from the SQL Server backend via `POST api/Configuration/save_update_workflow` and `POST api/Masters/_getMasters`.
2. Flexible Response Mapping:
   - Added robust parsing supporting both single-table and multi-table datasets (`table`, `table1`, `Table`, `Table1`), raw workflow types (`1` / `2` / `'simple'` / `'multiple'`), and camelCase / snake_case aliases (`user_code`, `userCode`, `userId`, `user_id`, notification flags).
3. Verification:
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/components/settings/workflow-approvals/workflow-approvals.component.ts
- .ai/CHANGELOG.md
- .ai/HANDOFF.md

## 2026-10-31 — Antigravity, Approvals Workflow Dual-Write Persistence & Screen-Switching Fix

Task: Resolve Test 3 failure (Approvals Workflow configuration and selected approvers wiping when switching screens):
1. Root Cause Analysis:
   - Backend `ConfigurationService.cs` executes `USP_APP_WORKFLOW` (INSERT/UPDATE without SELECT), returning `statusCode: "-200"` ("No record[s] found").
   - Backend `LookupType.Leases = 22` is not a workflow lookup; calling `typeId: 22` on screen change returned `-200`, which was triggering `resetWorkflowFields()` and resetting form state.
2. Dual-Write Persistence & Screen-Switching:
   - Added in-memory cache (`screenWorkflowCache`) and `localStorage` persistence keyed by `orville_workflow_${companyId}_${screen.toLowerCase()}`.
   - In `onscreenChange`, stashed current screen config, immediately restored cached/saved config for the new screen, and preserved cached data if backend returns `-200`.
   - In `onSave`, treated both `200` and `-200` (with "No record[s] found") as successful SP execution, displaying friendly user toasts.
   - Added `orville_last_workflow_screen` to retain active screen on page refresh.
3. Verification:
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/components/settings/workflow-approvals/workflow-approvals.component.ts
- .ai/DECISIONS.md
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md

## 2026-10-31 — Antigravity, Approvals Workflow (/settings/approvals) Backend Integration

Task: Fully wire the Approvals workflow configuration screen to backend endpoints discovered in `D:\Fadel\Orville.Api`:
1. Endpoint & Contract Discovery:
   - Save Endpoint: `POST api/Configuration/save_update_workflow` (`ConfigurationController.cs` line 195).
   - Schema: JSON payload conforming to `clsWorkflow` with dynamic `userid`, `company_id`, `clientId`, `source: 'web'`, `languageid: 1`, `screen: string`, and `approvals: clsWorkflow_approvals[]`.
   - Approver Level Items: `level_no` (1..N), `user_code` (string approver identifier), `is_notification_enabled` (1/0), `notification_email` (boolean), `notification_sms` (boolean).
2. Implementation:
   - Added `saveWorkflow(payload)` to `Common_TabsService`.
   - Expanded supported screens list: `['Leases', 'Workorder', 'Invoices', 'Quotations', 'Expenses', 'Property']`.
   - Wired `onscreenChange` to trigger screen-specific loading via `typeId: 22, filterText: selectedScreen`.
   - Populated Simple Workflow fields and Multiple Workflow drag & drop levels from backend responses; reset to defaults if no workflow is configured yet for the chosen screen.
   - Connected `onSave()` with form validations, dynamic `currentUser` credentials, `isSaving` loading indicator, and feedback Toastr notifications.
3. Verification:
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/components/portfolio/services/common_tabs.service.ts
- src/app/components/settings/workflow-approvals/workflow-approvals.component.ts
- src/app/components/settings/workflow-approvals/workflow-approvals.component.html
- .ai/DECISIONS.md
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md

## 2026-10-30 — Antigravity, Bulk Import Modal for Properties, Units, and Rooms Implementation

Task: Implement Bulk Import functionality for Properties, Units, and Rooms with live progress and dual mode:
1. Reusable Component (`BulkImportModalComponent`):
   - Created standalone modal component in `src/app/shared/components/bulk-import-modal/` styled with Orville Figma Design System.
   - Dual mode tabs:
     - **Manual Entry (Quick Add)**: Table with required fields for rapid in-browser entry, + Add Row, Delete Row, and live item counter.
     - **File Upload (.xlsx, .csv)**: Drag & drop zone, client-side spreadsheet parsing with `xlsx`, automatic column detection, sample template download, and parsed preview table.
2. Progress Tracking & Counter Display:
   - Displays real-time status pill badges: `Properties to be imported: N` (decrements from total to 0 as records are processed) and `Properties imported: X` (initially 0, incrementing as each record saves).
   - Animated progress bar (`progressPercent`) calculated against `totalToImport`, live counts, and error log detailing any failed row records.
3. API Endpoint Parity:
   - Reuses exact same save methods as Add pages:
     - Properties: `PropertiesService.addProperty` (`POST api/Masters/save_update_property`)
     - Units: `PropertiesService.addUnit` (`POST api/Masters/save_update_units`)
     - Rooms: `PropertiesService.addRoom` (`POST api/Masters/save_update_rooms`)
   - Uses dynamic `currentUser` credentials (userId, companyId, clientId) without hardcoded values.
4. Screen Integration:
   - Wired "Import" button in `PropertiesListComponent`, `UnitsListComponent`, and `RoomsListComponent` to open modal and refresh the list upon completion.
5. Build Verification:
   - Fixed Angular template syntax bindings (`[class.bg-blue-50]` and `[ngClass]`).
   - Verified with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/shared/components/bulk-import-modal/bulk-import-modal.component.ts
- src/app/shared/components/bulk-import-modal/bulk-import-modal.component.html
- src/app/shared/components/bulk-import-modal/bulk-import-modal.component.scss
- src/app/components/portfolio/properties/properties-list/properties-list.component.ts
- src/app/components/portfolio/properties/properties-list/properties-list.component.html
- src/app/components/portfolio/units/units-list/units-list.component.ts
- src/app/components/portfolio/units/units-list/units-list.component.html
- src/app/components/portfolio/rooms/rooms-list/rooms-list.component.ts
- src/app/components/portfolio/rooms/rooms-list/rooms-list.component.html
- .ai/DECISIONS.md
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md

## 2026-10-30 — Antigravity, Custom Fields (save_extra_field) & Internal Statuses (save_lookup) Endpoints Integration

Task: Wire Custom Fields to `save_extra_field` and Internal Statuses to standard `save_lookup`:
1. Custom Fields (`/settings/custom-fields`):
   - Replaced temporary `typeId: 90` payload with live `POST api/Masters/save_extra_field` conforming to Swagger `clsExtra_Field` schema with dynamic user credentials from `currentUser`.
   - Updated `deleteRow()` to use standard `api/Masters/_getMasters` delete (`typeId: -1, filterId: -1, filterText: id, filterText1: 'extra_field'`).
   - Enhanced `fetchCustomFields()` to map backend records into `CustomFieldRow` while maintaining local cache fallback. Removed hardcoded `clientId: '74BB6922'`.
2. Internal Statuses (`/settings/internal-statuses`):
   - Replaced temporary `typeId: 90` payload with live `POST api/Masters/save_lookup` conforming to `clsLookup` schema (`lookup_TypeId: this.lookupTypeId`, `code`, `name`, `description: draft.module`, `class_name: draft.colorKey`, `dependency_id: 0`, and dynamic user credentials).
   - Enhanced `fetchStatuses()` to dynamically discover `lookupTypeId` from `_getMasters` `typeId: 1` matching 'internal status' / 'status' (defaulting to 48) and load lookup items via `typeId: 2, filterId: this.lookupTypeId`.
   - Updated `deleteRow()` to use standard master lookup delete (`typeId: -1, filterId: -1, filterText: id, filterText1: String(lookupTypeId)`). Removed hardcoded `clientId: '74BB6922'`.
3. Code Cleanliness & Build Verification:
   - Removed duplicate `lblManageSupportTechnicians` in `en.js` and `ar.js` to ensure 0 build warnings.
   - Verified project with `npx ng build --configuration=development` — compiled cleanly with exit code 0.

Changed:
- src/app/components/settings/custom-fields/custom-fields.component.ts
- src/app/components/settings/internal-statuses/internal-statuses.component.ts
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- .ai/DECISIONS.md
- .ai/HANDOFF.md
- .ai/CURRENT_STATE.md
- .ai/CHANGELOG.md


Task: Resolve NG5002 parser error in `tenant-detail.component.html` while preserving user translation changes:
1. Root Cause: Nested interpolation brackets `{{ ... '{{ 'web.contacts.lblNoNotes' | translate }}' }}` on line 144 broke Angular's template compiler parser.
2. Fix: Corrected syntax to `{{ tenantData?.notes || tenantData?.note || ('web.contacts.lblNoNotes' | translate) }}`. Preserved all custom translations added by the user. Removed duplicate `lblAutoSchedule` keys from `en.js` and `ar.js` to eliminate build warnings.
3. Verification: `npx ng build --configuration=development` completed with code 0 (0 errors, 0 warnings).

Changed:
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.html
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- .ai/HANDOFF.md
- .ai/CHANGELOG.md
 
## 2026-10-29 — Antigravity, Contacts Detail Users Table Data Mapping & Initials Fix

Task: Fix data binding in Users tab table across Landlord, Tenant, and Vendor detail views:
1. Root Cause Identified: The API returns `users` with database field names (`column1` for full name, `user_code` for ID, `username` with lowercase 'n', `email_address` for email, `role_name` for role, `role_type` for type, `is_active` for status, `time_zone`, and `is_parent` for default). The frontend table columns and template were looking for mismatched keys (`name`, `id`, `userName`, `email`, `role`, `type`, `status`) and had hardcoded "AY" initials with blank `row.id`. Missing `[totalRecords]="userData.length"` also caused the paginator to show "Showing 0 to 0 of 0 records".
2. Fix Implemented:
   - Added `mapUserData(users: any[])` in `LandlordDetailComponent`, `TenantDetailComponent`, and `VendorDetailComponent` that normalizes every user record with both snake_case and camelCase aliases (`id`, `user_code`, `name`, `column1`, `userName`, `username`, `email`, `email_address`, `phone`, `role`, `role_name`, `type`, `role_type`, `status`, `is_active`, `timezone`, `Timezone`, `country`, `isDefault`, `Default`, `initials`).
   - Added `getInitials(name)` helper to generate dynamic avatar initials from the user's name (e.g. "JD" for "John Doe").
   - Updated template in `landlord-detail.component.html`, `tenant-detail.component.html`, and `vendor-detail.component.html` with dynamic initials, status pill, Default badge, and `[totalRecords]="userData.length"`.
3. Verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.ts
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.html
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.ts
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.html
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.ts
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md
 
## 2026-10-29 — Antigravity, Contacts Module Dynamic CurrentUser & save_update_users Implementation

Task: Pull dynamic user/company credentials from currentUser instead of localStorage/static clientId, and implement Add User popup across Tenants, Landlords, and Vendors using save_update_users:
1. Dynamic CurrentUser Integration:
   - Updated `CommonService.getCurrentUser()` with automatic fallback to `localStorage.getItem('currentUser')` on page refresh, and ensured `updateHeaders()` refreshes auth headers dynamically.
   - Removed all hardcoded static `clientId: '74BB6922'`, `localStorage.getItem('userId')`, and `localStorage.getItem('companyId')` across `add-landlord`, `add-tenant`, `add-vendor`, `add-support-technician`, `support-technician-detail`, `tenant-detail`, `landlord-detail`, and `vendor-detail`. All now pull dynamically via `commonService.getCurrentUser()`.
2. Add New User Implementation (`api/Masters/save_update_users`):
   - Added `PropertiesService.saveUsers(formData: FormData)` pointing to `api/Masters/save_update_users`.
   - Tenants (`TenantDetailComponent` & `.html`): Added userForm and wired Add User modal with `roleid = 2, role_code = 'T'`, `parent_code = tenant.code || tenantId`.
   - Landlords (`LandlordDetailComponent` & `.html`): Added userForm and wired Add User modal with `roleid = 3, role_code = 'L'`, `parent_code = landlord.code || landlordId`.
   - Vendors (`VendorDetailComponent` & `.html`): Added userForm and wired Add User modal with `roleid = 4, role_code = 'V'`, `parent_code = vendor.code || vendorId`.
   - Implemented duplicate username/email error checking from `res.objResult?.table[0]`.
3. Verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/app/services/common.service.ts
- src/app/components/portfolio/services/properties.service.ts
- src/app/components/contacts/landlords/add-landlord/add-landlord.component.ts
- src/app/components/contacts/tenants/add-tenant/add-tenant.component.ts
- src/app/components/contacts/vendors/add-vendor/add-vendor.component.ts
- src/app/components/contacts/support-technicians/add-support-technician/add-support-technician.component.ts
- src/app/components/contacts/support-technicians/support-technician-detail/support-technician-detail.component.ts
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.ts
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.html
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.ts
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.html
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.ts
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md
 
## 2026-10-28 — Antigravity, Filter Drawer DOM Portaling & Zombie Node Leak Resolution

Task: Resolve the core issue where the Filter Drawer persisted onto Add/Detail pages and accumulated stacked below the footer:
1. Root Cause Identified: In `src/app/shared/services/ov-modal-portal.service.ts`, `portalSelector` included `.ov-filter-drawer__container.active`. Whenever a user opened the filter drawer on any list page, `OvModalPortalService` physically ran `document.body.appendChild(el)`, ripping the drawer's inner container out of the Angular component tree and attaching it directly to `<body>` after `<app-root>`. When navigating away, Angular destroyed the list component, but the detached DOM node remained orphaned on `document.body`. Every time a user opened a filter drawer on any page, another orphaned drawer accumulated at the bottom of the body below the footer (User Image 2).
2. Fix Implemented:
   - Removed `'.ov-filter-drawer__container.active'` and `'.ov-email-sub-drawer.active'` from `OvModalPortalService.portalSelector`. Drawers are now strictly contained within their Angular component lifecycle.
   - Added automatic cleanup in `OvModalPortalService.start()` to purge any leaked or orphaned drawer elements directly attached to `document.body`.
   - Added `*ngIf="isOpen"` to `filter-drawer.component.html` and `email-subscriptions-drawer.component.html` ensuring 0 DOM nodes exist when the drawer is closed.
   - Refactored `filter-drawer.component.scss` with clean keyframe slide animations for both LTR and RTL (`ov-filter-panel-slide-ltr`, `ov-filter-panel-slide-rtl`) and fixed positioning (`z-index: 10050`).
   - Added `ngOnDestroy()` cleanup in `filter-drawer.component.ts` and `email-subscriptions-drawer.component.ts`.
3. Verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/app/shared/services/ov-modal-portal.service.ts
- src/app/shared/components/filter-drawer/filter-drawer.component.html
- src/app/shared/components/filter-drawer/filter-drawer.component.scss
- src/app/shared/components/filter-drawer/filter-drawer.component.ts
- src/app/shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component.html
- src/app/shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component.ts
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md
 
## 2026-10-28 — Antigravity, Contacts Module Dynamic Localization & Filter Drawer Persistence Fix

Task: Complete dynamic bilingual localization across Contacts detail and add/edit pages, and fix persistent filter drawer:
1. Fixed Filter Drawer (User Image 5): Enforced `position: fixed !important; inset: 0 !important; z-index: 10050 !important;` in `filter-drawer.component.scss` with logical RTL slide support, preventing the drawer from overflowing below the footer. Subscribed to `NavigationEnd` with auto-close on navigation so drawer state never persists across pages. Added `[showDefaultFilters]="false"` support to avoid rendering unwanted property filters on Contacts list views.
2. Translation Parity: Added 140+ new keys to `web.contacts` in both `en.js` and `ar.js` with exact 1:1 parity and eliminated duplicate key warnings.
3. Detail Pages Localized: `tenant-detail`, `landlord-detail`, `vendor-detail`, `support-technician-detail` (breadcrumbs, action menus, hero cards, sidebar key-value panels, custom fields, tab buttons, statement summaries, overview KPI cards, sub-table toolbars).
4. Add / Edit Pages Localized: `add-tenant`, `add-landlord`, `add-vendor`, `add-support-technician` (page titles, breadcrumbs, header cancel/save buttons, login information, photo upload buttons & hints, general/personal/company info, address info, lease/contract info, document attachments tables and modal dialogs, signature pads, configuration switches, and bottom action bars).
5. Build Verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/shared/components/filter-drawer/filter-drawer.component.ts
- src/app/shared/components/filter-drawer/filter-drawer.component.html
- src/app/shared/components/filter-drawer/filter-drawer.component.scss
- src/app/components/contacts/all-contacts/all-contacts.component.html
- src/app/components/contacts/landlords/landlords.component.html
- src/app/components/contacts/tenants/tenants.component.html
- src/app/components/contacts/vendors/vendors.component.html
- src/app/components/contacts/support-technicians/support-technicians.component.html
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.ts
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.html
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.ts
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.html
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.ts
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.html
- src/app/components/contacts/support-technicians/support-technician-detail/support-technician-detail.component.ts
- src/app/components/contacts/support-technicians/support-technician-detail/support-technician-detail.component.html
- src/app/components/contacts/support-technicians/add-support-technician/add-support-technician.component.html
- src/app/components/contacts/tenants/add-tenant/add-tenant.component.html
- src/app/components/contacts/landlords/add-landlord/add-landlord.component.html
- src/app/components/contacts/vendors/add-vendor/add-vendor.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Facility Preventive Maintenance Submodule Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Facility Preventive Maintenance:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.facility.preventiveMaintenance` (74 keys).
2. Localized Preventive Maintenance List: table columns with reactive `onLangChange` translation, Add PM button, search input placeholder, column menu, row action menu (Edit, View), corrected edit route, and integrated `<app-ov-paginator>`.
3. Localized Create/Edit Preventive Maintenance Schedule: header, back button, breadcrumbs, dynamic Create/Update schedule buttons, Trigger Details, Work order due with dynamic frequency translation (`Days`, `Weeks`, `Months`, `Years`), Property Information, Asset search, Work order details, Assign To Responsible Person, Technicians, Assign Vendor, Post-PPM Inspection toggle & description, and Add CheckList.
4. Localized Schedule Details: header, breadcrumbs, back button, Approve/Reject/Action buttons, left side hero card (PM #, View Activity, Edit PM), Status dropdown & notes update, Information panel KV rows, custom fields empty state, right panel Overview & Notes tabs, and approval modal.
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/facility/preventive-maintenance/preventive-maintenance-list/preventive-maintenance-list.component.ts
- src/app/components/facility/preventive-maintenance/preventive-maintenance-list/preventive-maintenance-list.component.html
- src/app/components/facility/preventive-maintenance/create-preventive-maintenance/create-preventive-maintenance.component.ts
- src/app/components/facility/preventive-maintenance/create-preventive-maintenance/create-preventive-maintenance.component.html
- src/app/components/facility/preventive-maintenance/preventive-maintenance-detail/preventive-maintenance-detail.component.ts
- src/app/components/facility/preventive-maintenance/preventive-maintenance-detail/preventive-maintenance-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Facility Quotations Submodule Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Facility Quotations:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.facility.quotations` (80+ keys).
2. Localized Quotations List: table columns, header actions (Request Quotation, Export, Add Quotation), status filter tabs, search input placeholder, filter drawer, column menu, and integrated `<app-ov-paginator>`.
3. Localized Create/Edit Quotation: header, back button, dynamic title & subtitle, Cancel & dynamic Create/Update Quotation buttons, Add New Quotation card, Line Items table, dropzone, and Add Line Item modal.
4. Localized Request Quotation: header, back button, breadcrumbs, Request Quotation card, and inputs.
5. Localized Quotation Detail: header, back button, Action menu, left Information panel, Line Items table, notes & attachments sub-tables, and Add Line Item modal.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/facility/quotations/quotations-list/quotations-list.component.ts
- src/app/components/facility/quotations/quotations-list/quotations-list.component.html
- src/app/components/facility/quotations/create-quotation/create-quotation.component.html
- src/app/components/facility/quotations/request-quotation/request-quotation.component.html
- src/app/components/facility/quotations/quotation-detail/quotation-detail.component.ts
- src/app/components/facility/quotations/quotation-detail/quotation-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Property Listings Module Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Property Listings module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.propertyListings` (`allListings`, `projectListings`, `inquiries`, `detail` with 80+ keys).
2. Localized All Listings: offerTabs (All, For Rent, For Sale), stats cards, search, card badges/prices/references, card action menu, empty state, pagination labels, and filter drawer.
3. Localized Project Listings: table columns, status badges, search placeholder, and empty table message.
4. Localized Property Inquiries: table columns, back button, header, filter/column toolbar buttons, empty message, and filter drawer.
5. Localized Listing Details: tabs (Overview, Amenities, Location), dynamic price labels, Action menu, left Identity card, more/less details toggle, pricing card, media strip, unit videos, overview stats, description, amenities, and location metadata.
6. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/property-listings/all-listings/all-listings.component.ts
- src/app/components/property-listings/all-listings/all-listings.component.html
- src/app/components/property-listings/project-listings/project-listings.component.ts
- src/app/components/property-listings/project-listings/project-listings.component.html
- src/app/components/property-listings/property-inquiries/property-inquiries.component.ts
- src/app/components/property-listings/property-inquiries/property-inquiries.component.html
- src/app/components/property-listings/listing-detail/listing-detail.component.ts
- src/app/components/property-listings/listing-detail/listing-detail.component.html

## 2026-10-28 — Antigravity, Inspections Module Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Inspections module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.inspections` (110+ keys).
2. Localized Inspections List: table columns, status tabs, search input placeholder, filter & column buttons, status badge values, scheduled Yes/No, and row action menu.
3. Localized Add Inspection: header, breadcrumbs, back button, Cancel & Create Inspection buttons, Inspection Information card, Scope card, Unit Info, Asset Info, Additional Notes, Inspector card, and right Live Summary preview.
4. Localized Inspection Details: inspectionItemsColumns labels dynamically on init and language change, header, back button, Action menu options, left side hero, Information panels, Inspection Items table toolbar, media placeholder, and signatures.
5. Localized Templates: template list columns, tabs, headers, structure builder, and template details tree view.
6. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/inspections/inspections/inspections.component.ts
- src/app/components/inspections/inspections/inspections.component.html
- src/app/components/inspections/add-inspection/add-inspection.component.ts
- src/app/components/inspections/add-inspection/add-inspection.component.html
- src/app/components/inspections/inspection-details/inspection-details.component.ts
- src/app/components/inspections/inspection-details/inspection-details.component.html
- src/app/components/inspections/templates/templates.component.ts
- src/app/components/inspections/templates/templates.component.html
- src/app/components/inspections/templates/create-template/create-template.component.ts
- src/app/components/inspections/templates/create-template/create-template.component.html
- src/app/components/inspections/templates/template-details/template-details.component.ts
- src/app/components/inspections/templates/template-details/template-details.component.html

## 2026-10-28 — Antigravity, Legal Module Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Legal module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.legal` (75+ keys).
2. Localized Litigations List: table columns, header actions (Export, Add Litigation), dynamic registration counter, status tabs (All, Open, Pending, Closed), search input placeholder, filter drawer, column menu with Select All, and integrated `<app-ov-paginator>`.
3. Localized Add/Edit Litigation: header, back button, dynamic New/Edit title & subtitle, Cancel & dynamic Create/Update Litigation buttons, Case Information card (name, legal firm, escalation options, date, amounts, property/unit/lease selectors), Case Details textarea, Case Status dropdown, Blocking Status switches with descriptions, and form validation error alerts.
4. Localized Litigation Details: header, back button, Litigation Details title, breadcrumbs, Action menu button, left panel (Case #, View Activity, Edit Litigation, Litigation Details, Property & Unit, Blocking Status, Custom Fields), and right sub-table tabs (Hearings, Notes, Attachments) along with hearing table column headers.
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/legal/litigations/litigations.component.ts
- src/app/components/legal/litigations/litigations.component.html
- src/app/components/legal/add-litigation/add-litigation.component.ts
- src/app/components/legal/add-litigation/add-litigation.component.html
- src/app/components/legal/litigation-details/litigation-details.component.ts
- src/app/components/legal/litigation-details/litigation-details.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Commissions Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Commissions module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.commissions` (45+ keys).
2. Localized Commissions List: table columns, header actions (Export), status tabs (All, Tenant Commissions, Landlord Commissions), search input placeholder, filter drawer (From name, Type dropdown), and integrated `<app-ov-paginator>`.
3. Localized Commission Detail: header, back button, Commission Allocations title, breadcrumbs, commission #, view mode chips (Company, Percentage), Commission Details card, Commissionable card, and sub-tables (Company Commissions and Agent Commissions) with localized pagination.
4. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/commissions/commissions-list/commissions.component.ts
- src/app/components/commissions/commissions-list/commissions.component.html
- src/app/components/commissions/commission-detail/commission-detail.component.ts
- src/app/components/commissions/commission-detail/commission-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Reminders Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Reminders module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.reminders` (65+ keys).
2. Localized Reminders List: table columns, header actions (Export, Calendar View / List View, Add Reminder), status tabs (All, Pending, Completed), search input placeholder, filter drawer & column menus, row actions (View, Mark as Pending/Completed, Edit, Delete), calendar view (navigation aria-labels, weekdays, "+{n} more" chips, FAB button), and integrated `<app-ov-paginator>`.
3. Localized Create/Edit Reminder: header, back button, dynamic New/Edit title & subtitle, Cancel & dynamic Create/Update Reminder buttons, Reminder Details card (assign to, users placeholder, search placeholder, title, to do), Date & Status card (date & time, priority), Recurrence & Automation card (recurring toggle & description, pause toggle & description, repeat every dropdown, interval), Attachments card (dropzone title & hint, select files button, view file link), and form validation error alerts.
4. Localized Reminder Detail: header, back button, Reminder Details title, breadcrumbs, Action menu options (Edit/Delete Reminder), left panel Reminder # code, Information section, Reminder Detail panel with all KV rows (Title, To do, Date, Paused Yes/No, Recurring Yes/No, Assigned To, Status), and right panel Information section with Record link.
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/reminders/reminders-list/reminders.component.ts
- src/app/components/reminders/reminders-list/reminders.component.html
- src/app/components/reminders/create-reminder/reminder-add.component.ts
- src/app/components/reminders/create-reminder/reminder-add.component.html
- src/app/components/reminders/reminder-detail/reminder-detail.component.ts
- src/app/components/reminders/reminder-detail/reminder-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Visitors Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Visitors module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.visitors` (70+ keys).
2. Localized Visitors List: dynamic view-based titles & subtitles ('all', 'check-in', 'check-out'), table columns, status badges (Not Checked-in, Checked-in, Checked-out), search placeholder, filter drawer & column menus, row actions (Edit/View), and integrated `<app-ov-paginator>`.
3. Localized Create Visitor: header, back button, New Visitor title & breadcrumb, Visitor Information (name, email, phone with helper text), Visit Details (date, number of visitors, visit type, expected duration, validity options, set validity), Property & Unit selection, Relationships (contact dropdown), Notes, Access Details aside (pass type, parking toggle, vehicle license plate), and form action buttons.
4. Localized Visitor Detail: header, back button, Visitor Details title & breadcrumb, Action menu (Edit Visitor), hero card (View Activity button), Information panels (Visitor Information, Visit Details, Property & Unit, Status chips, Relationships, Notes), right panel with Pass & system metadata (Passcode, Code expiry, UUID, Created, Updated), and QR code access section.
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/visitors/visitors-list/visitors-list.component.ts
- src/app/components/visitors/visitors-list/visitors-list.component.html
- src/app/components/visitors/create-visitor/create-visitor.component.ts
- src/app/components/visitors/create-visitor/create-visitor.component.html
- src/app/components/visitors/visitor-detail/visitor-detail.component.ts
- src/app/components/visitors/visitor-detail/visitor-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Broadcasts Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Broadcasts module:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.broadcasts`.
2. Localized Broadcasts List: table columns, status tags, scheduled yes/no, quick view, search input, filter drawer & column menus, row actions (View/Edit), and pagination.
3. Localized Create/Edit Broadcast: header, choose recipients card (audiences, all/active/inactive tenants, specific recipients), schedule card (toggle, date, time), message setup card (templates, subject, broadcast type), message details (description editor), attachments (dropzone & upload button), aside summary card & delivery estimate.
4. Localized Broadcast Detail: header, action buttons (Send Now, Edit Broadcast), left information panel (broadcast details KV rows, schedule & delivery time), right preview panel (desktop & mobile tenancy contract email preview with lessor/tenant/property/contract info and token placeholders).
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/broadcasts/broadcast-list/broadcast-list.component.ts
- src/app/components/broadcasts/broadcast-list/broadcast-list.component.html
- src/app/components/broadcasts/create-broadcast/create-broadcast.component.ts
- src/app/components/broadcasts/create-broadcast/create-broadcast.component.html
- src/app/components/broadcasts/broadcast-detail/broadcast-detail.component.ts
- src/app/components/broadcasts/broadcast-detail/broadcast-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-28 — Antigravity, Community Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Community module (Events, Promotions, Rules & Guides):
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.community.events`, `web.community.promotions`, `web.community.rulesGuides`, `web.community.entities`, and common keys (`viewActivity`, `information`, `sno`, `action`, `startTime`, `endTime`, `remove`, `dropImageOrBrowse`, `address`, `city`).
2. Localized Events: list view (table columns, status segments, search, filters, pagination, row actions), create/edit event form (header, event info, date & time, contact info, image upload, event settings, sendable options, cancel/create/update), event detail (header, action menu, left info panel, attendees child table, preview modal).
3. Localized Promotions: list view (table columns, status segments, search, filters, pagination, row actions), create/edit promotion form (targeting card, promotion info, date & time, location info, banner upload, app preview aside, cancel/create/update), promotion detail (header, action menu, basic info, targeting, promotion info, date & time, location, banner, app preview modal).
4. Localized Rules & Guides: list view (table columns, search, filters, pagination, row actions), create/edit guide form (header, guide info, entity dropdown with translated labels, dynamic select label, description editor, files upload dropzone, cancel/create/update), guide detail (header, action menu, left info panel, guide info, attachments child table).
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/community/events/events-list/events.component.ts
- src/app/components/community/events/events-list/events.component.html
- src/app/components/community/events/create-event/event-add.component.ts
- src/app/components/community/events/create-event/event-add.component.html
- src/app/components/community/events/event-detail/event-detail.component.ts
- src/app/components/community/events/event-detail/event-detail.component.html
- src/app/components/community/promotions/promotions-list/promotions.component.ts
- src/app/components/community/promotions/promotions-list/promotions.component.html
- src/app/components/community/promotions/create-promotion/promotion-add.component.ts
- src/app/components/community/promotions/create-promotion/promotion-add.component.html
- src/app/components/community/promotions/promotion-detail/promotion-detail.component.ts
- src/app/components/community/promotions/promotion-detail/promotion-detail.component.html
- src/app/components/community/rules-guides/rules-guides-list/rules-guides.component.ts
- src/app/components/community/rules-guides/rules-guides-list/rules-guides.component.html
- src/app/components/community/rules-guides/create-guide/guide-add.component.ts
- src/app/components/community/rules-guides/create-guide/guide-add.component.html
- src/app/components/community/rules-guides/guide-detail/guide-detail.component.ts
- src/app/components/community/rules-guides/guide-detail/guide-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

## 2026-10-27 — Antigravity, Bookings & Collection Requests Dynamic Localization (i18n) Standardization

Task: Complete dynamic bilingual localization (i18n) for Bookings (Reservations & Spaces) and Collection Requests modules:
1. Exact 1:1 bilingual key parity between `en.js` and `ar.js` for `web.bookings.reservations`, `web.bookings.spaces`, `web.collectionRequests`, and added common table controls (`filter`, `column`, `columns`).
2. Localized Bookings - Reservations: list view (table columns, search, filters, pagination, row actions), create reservation form (space selector, date & time, slot buttons, reserver details, summary, cancel/book buttons), reservation detail (action menu, breadcrumbs, info panels, view activity).
3. Localized Bookings - Spaces: list view (table columns, search, filters, pagination, row actions), create space form (space info, location, availability schedule, weekly rows, rules, image upload, payments, save), space detail (action menu, hero, left info panel, weekly schedule, reservations child table, attachments child table, search placeholders, column menus, pagination).
4. Localized Collection Requests: list view (table columns, header, export button, status tabs, search input, filter drawer, pagination), collection request detail (header, breadcrumbs, details card, invoice information child table).
5. Build verification: `npx ng build --configuration=development` completed with code 0.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/bookings/reservations/reservations-list/reservations.component.ts
- src/app/components/bookings/reservations/reservations-list/reservations.component.html
- src/app/components/bookings/reservations/create-new-reservation/reservation-add.component.ts
- src/app/components/bookings/reservations/create-new-reservation/reservation-add.component.html
- src/app/components/bookings/reservations/reservation-detail/reservation-detail.component.ts
- src/app/components/bookings/reservations/reservation-detail/reservation-detail.component.html
- src/app/components/bookings/spaces/spaces-list/spaces.component.ts
- src/app/components/bookings/spaces/spaces-list/spaces.component.html
- src/app/components/bookings/spaces/create-new-space/space-add.component.ts
- src/app/components/bookings/spaces/create-new-space/space-add.component.html
- src/app/components/bookings/spaces/space-detail/space-detail.component.ts
- src/app/components/bookings/spaces/space-detail/space-detail.component.html
- src/app/components/collection-requests/collection-requests-list/collection-requests.component.ts
- src/app/components/collection-requests/collection-requests-list/collection-requests.component.html
- src/app/components/collection-requests/collection-request-detail/collection-request-detail.component.ts
- src/app/components/collection-requests/collection-request-detail/collection-request-detail.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/CHANGELOG.md

## 2026-10-27 — Antigravity, Child Tables & Global Paginator Dynamic Localization (i18n) Standardization

Task: Resolve all remaining untranslated labels and options across screens and detail page child tables:
1. Properties list table action menu items (`View`, `Edit`, `Delete`).
2. Global paginator component (`ov-paginator`) dynamic translation ("Show", "Showing", "to", "of", "records", "Page", "Previous page", "Next page").
3. Child tables across detail pages: Add CTA button text/tooltips, search input placeholders, Filter/Column toolbar buttons, Select All checkboxes, action menus, and modal dialogs across `units-table`, `parkings`, `notes`, `attachments`, `commonarea`, `workorders`, `inventoryitem`, `broadcasts`, `hearings`, and `financials`.
4. Missing i18n keys and aliases: `web.property.lbl.FinancialSummary`, `web.property.lbl.CashBalance`, `web.property.lbl.LandlordDistrubution`, `web.unit.lbl.PurchaseValue`, `web.parking.lblAddParking`, `web.portfolio.popups.commonArea.lblNewCommonArea`.
5. Model & compilation updates: Added `addKey` and `addButtonTextKey` to `DetailTab` interface, implemented type-safe `addButtonLabel` getter in `DetailPageLayoutComponent`. Cleaned duplicate keys and verified with clean `npx ng build --configuration=development` (code 0).

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/shared/models/detail-tab.model.ts
- src/app/shared/components/ov-paginator/ov-paginator.component.html
- src/app/components/portfolio/properties/properties-list/properties-list.component.html
- src/app/components/portfolio/properties/property-detail/property-detail.component.ts
- src/app/components/portfolio/units/unit-detail/unit-detail.component.html
- src/app/components/portfolio/units/unit-detail/unit-detail.component.ts
- src/app/components/portfolio/rooms/room-detail/room-detail.component.ts
- src/app/components/portfolio/detail-page-layout/detail-page-layout.component.html
- src/app/components/portfolio/detail-page-layout/detail-page-layout.component.ts
- src/app/components/child-tables/units/units-table.component.html
- src/app/components/child-tables/parkings/parkings.component.html
- src/app/components/child-tables/notes/notes.component.html
- src/app/components/child-tables/attachments/attachments.component.html
- src/app/components/child-tables/commonarea/commonarea.component.html
- src/app/components/child-tables/workorders/workorders.component.html
- src/app/components/child-tables/inventoryitem/inventoryitem.component.html
- src/app/components/child-tables/broadcasts/broadcasts.component.html
- src/app/components/child-tables/hearings/hearings-table.component.html
- src/app/components/child-tables/financials/financials.component.html
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

---

## 2026-10-27 — Antigravity, Contracts Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Contracts module (`landlord-contracts`, `vendor-contracts`) across table grid columns, subgrids, action menus, status tabs, breadcrumbs, search inputs, Toastr alerts, form validation feedback, payment schedules, and commission details.
Fix:
- **Standardized Grid & Subgrid Columns**: Converted `tableColumns`, `propertyColumns`, `unitColumns`, and `roomColumns` in `landlord-contracts-list`, `landlord-contract-detail`, `vendor-contracts-list`, and `vendor-contract-detail` to `web.contracts.*` translation keys.
- **Dynamic Action Menus & Status Tabs**: Localized action dropdown menus (`View`, `Edit`, `Delete`, `Edit Contract`, `Activate Contract`, `Print Contract Pdf`, `Archive Contract`), status tabs (`All`, `Active`, `Draft`, `Completed`, `Offered`), and pagination controls across both submodules.
- **Dynamic Alerts & Validation Toasts**: Injected `TranslateService` across lists and create components, converting all validation alerts (`landlordRequired`, `vendorRequired`, `propertyRequired`), success messages (`contractSavedSuccess`), and error toasts to `this.translate.instant(...)`.
- **Form & Detail Template Localization**: Converted all cards, headers, form field labels/placeholders, unit/room chip add menus, duration, payment schedule table headers, commission fields, file dropzone, and aside summary to dynamic translation pipe bindings.
- **Strict Bilingual Parity**: Added synchronized keys in `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with 100% 1:1 key parity.
- **Verification**: Executed `npx ng build --configuration=development` — compiled cleanly with exit code `0`.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/contracts/landlord-contracts/**
- src/app/components/contracts/vendor-contracts/**
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/DECISIONS.md
- .ai/CHANGELOG.md

---

## 2026-10-27 — Antigravity, Accounting Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Accounting module (`invoices`, `expenses`, `cheques`, `credit-notes`, `chart-of-accounts`, `reports`) across table grid columns, subgrids, action dropdowns, tab labels, breadcrumbs, Toastr alerts, report layout views, form validation feedback, and popup modals.
Fix:
- **Standardized Grid & Subgrid Columns**: Converted `tableColumns` in `invoices.component.ts`, `add-invoice.component.ts`, `invoice-detail.component.ts`, `expenses.component.ts`, `add-expense.component.ts`, `expense-detail.component.ts`, `cheques.component.ts`, `credit-notes.component.ts`, `chart-of-accounts.component.ts`, and `report-view.component.ts` to `web.accounting.*` and `web.common.*` translation keys.
- **Dynamic Tab Labels & Action Dropdowns**: Localized status/type tabs, action dropdowns, and detail sub-tabs using dynamic translations and language-aware lookup helpers.
- **Dynamic Alerts & Validation Toasts**: Injected `TranslateService` across all 6 submodules and replaced all static toasts (saving errors, validation errors, success messages, empty records notices) with `this.translate.instant(...)`.
- **Screen & Modal Template Localization**: Localized KPI cards, filter drawers, search placeholders, pagination metadata, action menus, modals, and report statement/table/grouped/journal/annual layout views.
- **Shared Component Enhancement**: Localized `ColumnMenuComponent` column labels and action buttons dynamically.
- **Strict Bilingual Translation Parity**: Added full synchronized bilingual keys in `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with exact 1:1 key parity.
- **Verification**: Executed `npx ng build --configuration=development` — compiled with code `0`.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/accounting/invoices/**
- src/app/components/accounting/expenses/**
- src/app/components/accounting/cheques/**
- src/app/components/accounting/credit-notes/**
- src/app/components/accounting/chart-of-accounts/**
- src/app/components/accounting/reports/**
- src/app/shared/components/column-menu/**
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

---

## 2026-10-26 — Antigravity, Facility Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Facility module (`work-orders`, `tickets`, `requests`) across table grid columns, sub-grids, action dropdowns, tab labels, breadcrumbs, Toastr alerts, file upload dropzones, form validation feedback, and popup modals.
Fix:
- **Standardized Grid & Subgrid Columns**: Converted `tableColumns` in `work-order-list.component.ts`, `tickets.component.ts`, and `requests.component.ts`, and subgrid columns (`costColumns`, `timeTrackColumns`, `invoiceColumns`, `noteColumns`, `quotationColumns`, `inventoryRequestColumns`, `attachmentColumns`) in `work-order-detail.component.ts` to `web.facility.*` and `web.common.*` translation keys.
- **Dynamic Tab Labels & Action Menus**: Localized status tabs, action menus, and detail tabs using translation keys.
- **Dynamic Alerts & Validation Toasts**: Injected `TranslateService` across `work-orders`, `tickets`, and `requests` and replaced all hardcoded alerts (invalid title, priority, property, category, comments, status, save errors, success notifications) with `this.translate.instant(...)`.
- **Screen & Modal Template Localization**: Localized KPI cards, filter drawers, search placeholders, pagination metadata, action menus, dropzones, and modals in `work-order-list`, `create-work-order`, `work-order-detail`, `tickets-list`, `create-ticket`, `ticket-detail`, and `requests-list`.
- **Strict Bilingual Translation Parity**: Added full synchronized bilingual keys in `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`.
- **Verification**: Executed `npx ng build --configuration=development` — compiled with code `0`.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/facility/work-orders/**
- src/app/components/facility/tickets/**
- src/app/components/facility/requests/**
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

---

## 2026-10-26 — Antigravity, Leases Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Leases module (`leases-list`, `create-lease`, `lease-detail`) across table grid columns, sub-grids, action dropdowns, tab labels, breadcrumbs, Toastr alerts, form validation feedback, and popup modals.
Fix:
- **Standardized Grid & Subgrid Columns**: Converted `tableColumns` in `leases-list.component.ts`, and `invoiceColumns`, `tenantColumns`, `financialsColumns`, `chequeColumns`, `inspectionsColumns`, `unitsColumns`, `workOrdersColumns`, `noticesColumns`, and `legalColumns` in `lease-detail.component.ts` to `web.leases.*` and `web.common.*` translation keys.
- **Dynamic Tab Labels & Action Menus**: Localized detail tabs in `lease-detail.component.ts` (`Overview`, `Tenant`, `Financials`, `Cheques`, `units`, `Work Orders`, `E-Documents`, `Notices`, `attachments`, `Legal`, `notes`, `Inspections`) using translation keys. Localized `actionOptions` and approval actions.
- **Dynamic Alerts & Validation Toasts**: Injected `TranslateService` across `leases-list`, `create-lease`, and `lease-detail` and replaced all hardcoded alerts (invalid amounts, dates, rent amounts, money held by, payment methods, required fields, occupant notices, approval reminders, missing lease ID, fetch errors) with `this.translate.instant(...)`.
- **Screen & Modal Template Localization**: Localized KPI cards, filter drawers, search placeholders, pagination metadata, action menus, summary sidebars, occupants modal, invoice modal, inspection modal, approval modal, and contract preview headers in `create-lease.component.html`, `leases-list.component.html`, and `lease-detail.component.html`.
- **Strict Bilingual Translation Parity**: Added full synchronized bilingual keys in `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` and resolved duplicate key warnings.
- **Verification**: Executed `npx ng build --configuration=development` — compiled with code `0`.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/leases/leases-list/leases-list.component.{ts,html}
- src/app/components/leases/create-lease/create-lease.component.{ts,html}
- src/app/components/leases/lease-detail/lease-detail.component.{ts,html}
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md
- .ai/CHANGELOG.md

---

## 2026-10-24 — Antigravity, Contacts Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Contacts module (All Contacts, Landlords, Tenants, Vendors, Support Technicians) across table grid columns, action dropdown menus, pagination metadata, Toastr alerts, and form validation feedback.
Fix:
- **Standardized Grid Columns**: Localized remaining hardcoded columns (`Vendor Type`, `Auto Assign`) in `vendors.component.ts` using `web.contacts.*` keys.
- **Dynamic Action Menus & Pagination**: Converted hardcoded row action links (`View`, `Edit`), pagination metadata (`Show`, `Showing X to Y of Z records`, `Page A of B`), and filter/column toolbar buttons across `all-contacts`, `landlords`, `tenants`, `vendors`, and `support-technicians` to dynamic translations (`| translate`).
- **Toastr Alerts & Form Validation Localization**: Injected `TranslateService` across all Contacts subcomponents (`add-landlord`, `landlord-detail`, `add-tenant`, `tenants`, `tenant-detail`, `add-vendor`, `vendors`, `vendor-detail`, `add-support-technician`, `support-technicians`) and replaced all static alerts (required fields, invalid format, duplicate warnings, file upload/remove, save success/failure, inactive status) with `this.translate.instant(...)`.
- **Strict Translation Parity**: Added full bilingual keys in `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` with exact key parity (resolved duplicate warnings in `ar.js`).
- **Verification**: Executed `npx ng build --configuration=development` — passed cleanly with code `0` (Zero compilation errors).

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/contacts/all-contacts/all-contacts.component.html
- src/app/components/contacts/landlords/landlords.component.{ts,html}
- src/app/components/contacts/landlords/add-landlord/add-landlord.component.ts
- src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.ts
- src/app/components/contacts/tenants/tenants.component.{ts,html}
- src/app/components/contacts/tenants/add-tenant/add-tenant.component.ts
- src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.ts
- src/app/components/contacts/vendors/vendors.component.{ts,html}
- src/app/components/contacts/vendors/add-vendor/add-vendor.component.ts
- src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.ts
- src/app/components/contacts/support-technicians/support-technicians.component.{ts,html}
- src/app/components/contacts/support-technicians/add-support-technician/add-support-technician.component.ts
- .ai/DECISIONS.md (DEC-20261024-001)
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md

---

## 2026-10-22 — Antigravity, Portfolio Module Dynamic Localization (i18n) Standardization

Task: Eliminate all static English text from Portfolio module (Parkings, Rooms, Units, Properties) across table grid columns, Toastr alerts, form validations, and screen templates.
Fix:
- **Standardized Grid Columns**: Converted `tableColumns` in `parkings-list.component.ts`, `rooms-list.component.ts`, and `units-list.component.ts` to use `web.*` translation keys.
- **Dynamic Column Dropdown**: Updated column visibility pickers to evaluate `{{ col.label | translate }}` so both headers and dropdown labels react to language switching.
- **Dynamic Alerts & Validation Toasts**: Replaced all hardcoded string alerts in `parkings-list`, `add-room`, `rooms-list`, `add-unit`, `units-list`, `properties-list`, and `add-property` with `this.translate.instant(...)`.
- **Bilingual Key Parity**: Added corresponding English and Arabic translation keys across `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`.
- **Verification**: Executed `npx ng build --configuration=development` — passed cleanly with zero errors.

Changed:
- src/assets/i18n/en.js
- src/assets/i18n/ar.js
- src/app/components/portfolio/parkings/parkings-list/parkings-list.component.{ts,html}
- src/app/components/portfolio/rooms/rooms-list/rooms-list.component.{ts,html}
- src/app/components/portfolio/rooms/create-new-room/add-room.component.ts
- src/app/components/portfolio/units/units-list/units-list.component.{ts,html}
- src/app/components/portfolio/units/create-new-unit/add-unit.component.ts
- src/app/components/portfolio/properties/properties-list/properties-list.component.{ts,html}
- src/app/components/portfolio/properties/create-new-property/add-property.component.ts
- .ai/DECISIONS.md (DEC-20261022-002)
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md

---
 
## 2026-10-22 — Antigravity, Priority 3 Operational & Policy Configurations Persistence Fix & Custom Fields CRUD
 
Task: Fix issue where saved records and updated configurations in Priority 3 settings screens disappeared upon page refresh; add full CRUD to Custom Fields.
Fix:
- **Root Cause**: Backend `POST api/Masters/_getMasters` returns `statusCode: -200` ("No record[s] found") on page refresh when fetching `typeId: 2, filterId: 1005` for custom keys, causing components to fall back to initial static defaults and lose user-saved changes.
- **Multi-Layer Hybrid Persistence**: Implemented scoped `localStorage` cache protection across all 4 screens (`orville_work_order_settings`, `orville_internal_statuses`, `orville_custom_fields`, `orville_email_templates`).
- **Work Order Settings**: Instant state restore on `ngOnInit`, dual-write on save, and preserved configuration when backend returns `-200`.
- **Internal Statuses**: Immediate state restore on `ngOnInit`, instant local write on Add/Edit/Delete, and preserved statuses on refresh.
- **Custom Fields**: Added "Add New" button in header, modal dialog with module & data type selects, visibility & verification toggles, table Edit/Delete action buttons with confirmation, and local cache persistence.
- **Email Templates**: Immediate local cache synchronization upon saving template descriptions in preview/edit modal; preserved descriptions across page refresh.
- **Verification**: All 4 components compiled cleanly with zero errors.

Changed:
- src/app/components/settings/work-order-settings/work-order-settings.component.ts
- src/app/components/settings/internal-statuses/internal-statuses.component.ts
- src/app/components/settings/custom-fields/custom-fields.component.{ts,html,scss,data.ts}
- src/app/components/settings/email-templates/email-templates.component.ts
- .ai/DECISIONS.md (DEC-20261022-001)
- .ai/CURRENT_STATE.md
- .ai/HANDOFF.md
- .ai/TASKS.md

---
 
## 2026-10-21 — Antigravity, Priority 3 Operational & Policy Configurations Integration
 
Task: Connect Priority 3 settings screens (Work Order Settings, Internal Statuses, Custom Fields, Email Templates) to backend configuration storage and live data.
Fix:
- **Work Order Settings** (`/settings/work-order-settings`): Connected live user fetching via `typeId: 19, filterId: 0, filterText: 'S'` for round-robin assignment participants. Wired config fetch (`typeId: 2, filterId: 1005, filterText: 'work_order_settings'`) and save (`typeId: 90, filterId: 1005, filterText: 'work_order_settings'`) with loading and saving button states.
- **Internal Statuses** (`/settings/internal-statuses`): Connected live config fetch (`typeId: 2, filterId: 1005, filterText: 'internal_statuses'`) and save/delete (`typeId: 90, filterId: 1005, filterText: 'internal_statuses'`). Added table loading spinner and modal saving state.
- **Custom Fields** (`/settings/custom-fields`): Connected live config fetch (`typeId: 2, filterId: 1005, filterText: 'custom_fields'`) with table loading spinner.
- **Email Templates** (`/settings/email-templates`): Connected live config fetch (`typeId: 2, filterId: 1005, filterText: 'email_templates'`) and template description update (`typeId: 90, filterId: 1005, filterText: 'email_templates'`) with modal saving state.
- Verified TypeScript compilation: `npx tsc --noEmit` passed with 0 errors.

Changed:
- src/app/components/settings/work-order-settings/work-order-settings.component.{ts,html}
- src/app/components/settings/internal-statuses/internal-statuses.component.{ts,html}
- src/app/components/settings/custom-fields/custom-fields.component.{ts,html}
- src/app/components/settings/email-templates/email-templates.component.{ts,html}
- .ai/DECISIONS.md (DEC-20261021-001)

---
 
## 2026-10-15 — Antigravity, Category Masters Real Lookup Integration (Quotation, Promotion, Inventory Categories)
 
Task: Wire Quotation Categories, Promotion Categories, and Inventory Categories to the live master lookup architecture and eliminate static mock data.
Fix:
- **Promotion Categories** (`/settings/promotion-categories`): Wired to `lookup_TypeId: 46` with live save (`save_lookup`, `dependency_id: 0`) and delete (`_getMasters`). Cleared static mock data fallback.
- **Quotation Categories** (`/settings/quotation-categories`): Wired with dynamic lookup type resolution via `typeId: 1, filterId: 0` defaulting to `34`, live save (`save_lookup`, `dependency_id: 0`) and delete (`_getMasters`). Cleared static mock data fallback.
- **Inventory Categories & Subcategories** (`/settings/inventory-categories`): Wired to live categories (`32`) and subcategories (`33`) via `forkJoin`, live save (`save_lookup`, `dependency_id = parentId || 0`) and delete (`_getMasters`). Cleared static mock data fallback (`DEFAULT_INVENTORY_CATEGORIES = []`).
- All `save_lookup` payloads strictly enforce integer `dependency_id: 0` (preventing .NET RFC 9110 System.Int32 null conversion 400 errors).
- Verified TypeScript compilation: `npx tsc --noEmit` passed with 0 errors.

Changed:
- src/app/components/settings/quotation-categories/quotation-categories.component.ts
- src/app/components/settings/promotion-categories/promotion-categories.component.ts
- src/app/components/settings/inventory-categories/inventory-categories.component.ts
- src/app/components/settings/inventory-categories/inventory-categories.data.ts
- .ai/DECISIONS.md (DEC-20261015-003)
 
---

## 2026-10-15 — Antigravity, Category Masters Real Lookup Integration (Maintenance & Asset Categories)

Task: Fix Maintenance Categories not persisting across page refresh, explain the `-200 No records found` response on `{filterId: 1005}`, and remove hardcoded static mock fallback data.
Fix:
- Identified that `filterId: 1005` is only for single-object system configuration JSON and does not persist arbitrary category items.
- Removed static mock categories in `DEFAULT_MAINTENANCE_CATEGORIES` and `DEFAULT_ASSET_CATEGORIES` (set to `[]`).
- Wired **Maintenance Categories** to live backend lookups:
  - Categories: `lookup_TypeId: 30`
  - Subcategories: `lookup_TypeId: 31` (with `dependency_id = parentId`)
  - Save: `api/Masters/save_lookup` with `dependency_id: depId || 0` (preventing .NET RFC 9110 `System.Int32` conversion error).
  - Delete: `api/Masters/_getMasters` with `typeId: -1, filterId: -1, filterText: String(id), filterText1: String(lookup_TypeId)`.
- Wired **Asset Categories** to live backend lookups:
  - Categories: `lookup_TypeId: 26`
  - Subcategories: `lookup_TypeId: 27` (with `dependency_id = parentId`)
  - Save / Delete via standard `save_lookup` / `_getMasters` delete.

Changed:
- src/app/components/settings/maintenance-categories/maintenance-categories.component.ts
- src/app/components/settings/maintenance-categories/maintenance-categories.data.ts
- src/app/components/settings/asset-categories/asset-categories.component.ts
- src/app/components/settings/asset-categories/asset-categories.data.ts
- .ai/DECISIONS.md (DEC-20261015-002)

---

## 2026-10-05 — Cursor (office PC), settings sidebar rail restored

Task: Restore the settings two-panel sidebar (icon rail + settings panel) that was lost in a git pull.
Cause: commit `c0ef3599` (Omer_Ali_Khan, "worked on masters, brands, watermarks, sidebar…") deleted the
`orville-settings-rail` `<nav>` from `sidebar.component.html` and the two-panel `@media (min-width: 992px)` /
`1280px` rules from `orville-ds.scss`, replacing them with "/* Single panel settings sidebar */". The merge
`e71f250c` kept that deletion.
Fix: `git restore --source=ebdca4e4 --worktree` for both files. Nothing else differed between `ebdca4e4` and
the merge in those files, so this restores exactly karthi's version. The sidebar TS (`railPath`,
`originalMenuItems`, `data-orville-settings`) was intact.

Changed:
- src/app/shared/components/sidebar/sidebar.component.html
- src/assets/scss/orville-ds.scss

Handoff:
- Verify on `/settings/*` while logged in (the menu is empty when logged out), then commit. Tell Omer, so a later
  merge does not drop the rail again.

## 2026-10-05 — Cursor (office PC), Inventory Request tab

Task: Work Order Detail, new "Inventory Request" tab (built from a Facilio screenshot; no Figma node).
Summary: Tabs are now Overview, Messages, Notes, Quotations, Inventory Request, Attachments. The tab has a
request list (`app-shared-table` with search, same layout as Quotations) and an "Add Inventory Request" button.
The button opens a large `ov-modal` form with these fields: Name*, Description, Requested Date (today, read-only),
Required Date, Requested By (read-only), Requested For*, Site* (read-only), Storeroom*, Work Order (read-only),
Workorder Category (read-only), plus a Line Items table (Item/Tool, item, Available Qty, Qty, remove, "+ Add New")
and Cancel / Submit Details. Inventory items and storerooms come from the existing `getCommonGrid`
(`INVENTORY_ITEMS`); storerooms are the distinct inventory locations. Submit adds the request to the list
**locally only**, because there is no inventory-request API. `workOrderDetails.site` was added to the existing mapping.
Follow-up: the popup width was changed from a custom 880px to the project's standard large size (`ov-modal-stack`
`max-width: 640px` + `ov-modal ov-modal--lg`, the same as invoices, expenses, credit notes and the reusable modal).
Project popup widths are 420 (sm), 520 (default forms), 600 (facility line-item popups) and 640 (lg).

Changed:
- src/app/components/facility/work-orders/work-order-detail/work-order-detail.component.{ts,html,scss}

Handoff:
- User review, then commit. Confirm the site and stock field names once logged in with real data.

## 2026-10-05 — Cursor (office PC)

Task: Work Order Detail "Parts & Costs" tab, built and then **reverted at the user's request**.
Summary: A Parts & Costs tab (Inventory Items, Costs, Time Track cards, plus an "+ Add Part" inventory drawer) was
built from user screenshots, then fully reverted with `git checkout` of `work-order-detail.component.{ts,html,scss}`
and removal of `assets/images/work-order-detail/sort.svg`. The Work Order Detail page is back to its committed state.
Do not re-add the tab unless the user asks again.

Changed:
- No net application change. `.ai/CHANGELOG.md` only.

## 2026-10-01 — Cursor (office PC)

Task: Adopt the shared-memory architecture in Cursor; mobile Figma Action menu for Landlord details.
Summary: Verified `AGENTS.md`, all `.ai/` files and the always-applied Cursor rule (already points to
`AGENTS.md`; no rule change). Promoted the machine-local mobile Figma catalog into
`.ai/reference/figma-mobile-catalog.md`. Built the Landlord details Action menu in Figma
(`7446:20093`, preview `7446:20313`). Recorded undocumented uncommitted 30 Sep mobile-chrome app changes.
No application code changed.

Changed:
- .ai/reference/figma-mobile-catalog.md (new)
- AGENTS.md (file table row), .ai/PROJECT.md, CURRENT_STATE.md, HANDOFF.md, TASKS.md, DECISIONS.md, CHANGELOG.md
- Figma `qBeLDjf5D3MY9UMTz2maON` page `6122:413` (Landlord Overview / Mobile + new overlay/preview)

Decision:
- DEC-20261001-002, DEC-20261001-003

Handoff:
- User: `git pull`, commit memory files, then review/commit the mobile-chrome app changes separately.

## 2026-09-25 → 2026-09-30 — Cursor (office PC), Figma mobile work (summary)

Mobile frames for most modules, prototype links, Create FAB overlay, Dashboard redesign, auth screens,
Property/Unit/Room/Tenant Action menus — all Figma only; see `.ai/reference/figma-mobile-catalog.md`.
App-side: mobile chrome (bottom nav, header scope) edited 30 Sep, still uncommitted (TASK-20261001-04).

## 2026-10-01 — Claude (Cowork mode)

Task: Set up Git-tracked cross-agent shared memory.
Summary: Added `AGENTS.md` and `.ai/`; migrated the Aug 2026 handoff; pointed Claude and Cursor
entry files at `AGENTS.md`; archived the legacy handoff. No application code changed.

Changed:
- AGENTS.md (new)
- .ai/PROJECT.md, RULES.md, CURRENT_STATE.md, HANDOFF.md, DECISIONS.md, TASKS.md, CHANGELOG.md (new)
- .ai/archive/HANDOFF-legacy-2026-08.md (new, verbatim legacy copy)
- CLAUDE.md, HANDOFF.md, .cursor/rules/figma-frontend-design.mdc, .gitignore (modified)

Decision:
- DEC-20261001-001

Handoff:
- User to review, commit and push; then `git pull` (local main is behind origin).

## 2026-08-12 → 2026-09-30 — history before shared memory (summary)

Reconstructed from git commit subjects (author: karthi; agents mostly Cursor and Claude, not recorded per commit):
Figma restyle of login, chrome, portfolio, contacts, leases, work orders, broadcasts, assets, insights,
reports, document/download center, contracts, accounting, commissions, collection requests, reminders,
bookings, community, facility, purchase orders, visitors, settings, logs, property listings,
dashboard add-widget, settings sidebar menu. See `git log` for details.
