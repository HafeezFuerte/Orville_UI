import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

// Color palette cycles for category chips
const CHIP_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-sky-100 text-sky-700',
  'bg-pink-100 text-pink-700',
  'bg-violet-100 text-violet-700',
  'bg-lime-100 text-lime-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
];

interface LookupType {
  id: number;
  lookup_name: string;
  records: number;
  colorClass?: string;
}

interface LookupItem {
  id: number;
  code: string;
  name: string;
  arabic_name?: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
  class_name?: string;
  dependency_id?: number;
}

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedTableComponent, NgSelectModule],
  templateUrl: './masters.component.html',
  styles: [
    `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      display: block !important;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.03);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15) !important;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25) !important;
    }
    `
  ]
})
export class MastersComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  // Category tabs
  categories: LookupType[] = [];
  selectedCategoryId: number | null = null;

  // Table data
  categoryItems: LookupItem[] = [];
  loadingItems: boolean = false;

  // Dependency filtering data
  dependencyItems: LookupItem[] = [];
  loadingDependencyItems: boolean = false;

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 50;

  // Form toggle
  showForm: boolean = false;

  tableColumns = [
    { key: 'code', label: 'Code', isHtml: true, width: '20%' },
    { key: 'name', label: 'Name', isHtml: true, width: '30%' },
    { key: 'description', label: 'Description', isHtml: true, width: '30%' },
    { key: 'is_active', label: 'Status', useTemplate: true, width: '20%' }
  ];

  masterForm: FormGroup = this.fb.group({
    id: [0],
    lookup_TypeId: [0],
    code: ['', Validators.required],
    name: ['', Validators.required],
    arabic_name: [''],
    description: [''],
    is_Active: [true],
    company_id: [1],
    display_order: [0],
    user_id: [1],
    dependency_type_id: [null], // Holds chosen Lookup Category ID
    dependency_id: [null],      // Holds actual item ID filtered by lookup category
    class_name: [''],
    clientid: ['74BB6922']
  });

  ngOnInit(): void {
    this.fetchCategories();
  }

  // ── Step 1: Load all lookup types (typeId: 1) ──────────────────────────────
  fetchCategories(): void {
    const user = this.commonService.getCurrentUser();
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = {
      typeId: 1,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.categories = res.objResult.table.map((item: any, idx: number) => ({
            id: item.id,
            lookup_name: item.lookup_name,
            records: item.records ?? 0,
            colorClass: CHIP_COLORS[idx % CHIP_COLORS.length]
          }));

          // Auto-select the first category
          if (this.categories.length > 0) {
            this.selectCategory(this.categories[0]);
          }
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load master categories', 'Error');
        console.error(err);
      }
    });
  }

  // ── Step 2: Load items for selected category (typeId: 2, filterId: category.id) ──
  selectCategory(cat: LookupType): void {
    this.selectedCategoryId = cat.id;
    this.showForm = false;
    this.loadCategoryItems(cat.id);
  }

  loadCategoryItems(lookupTypeId: number): void {
    this.loadingItems = true;
    this.categoryItems = [];

    const user = this.commonService.getCurrentUser();
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = {
      typeId: 2,
      filterId: lookupTypeId,
      filterText: '',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.loadingItems = false;
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.categoryItems = res.objResult.table.map((item: any) => ({
            id: item.id,
            code: item.code || item.account_code || item.country_code || item.state_code || item.city_code || '-',
            name: item.name || item.country_name || item.state_name || item.city_name || item.account_name || item.profile_name || '',
            arabic_name: item.arabic_name || item.state_name_ar || item.city_name_ar || '',
            description: item.description || item.account_desc || '',
            is_active: item.is_active ?? item.isActive ?? true,
            display_order: item.display_order ?? 0,
            class_name: item.class_name || '',
            dependency_id: item.dependency_id ?? null
          }));
        }
      },
      error: (err) => {
        this.loadingItems = false;
        this.toastr.error('Failed to load items', 'Error');
        console.error(err);
      }
    });
  }

  // ── Step 3: Load items for the selected dependency lookup type ──
  onDependencyTypeChange(lookupTypeId: number | null): void {
    this.masterForm.get('dependency_id')?.setValue(null);
    this.dependencyItems = [];
    if (!lookupTypeId) return;

    this.loadingDependencyItems = true;
    const user = this.commonService.getCurrentUser();
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = {
      typeId: 2,
      filterId: lookupTypeId,
      filterText: '',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.loadingDependencyItems = false;
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.dependencyItems = res.objResult.table.map((item: any) => ({
            id: item.id,
            code: item.code || item.account_code || item.country_code || item.state_code || item.city_code || '-',
            name: item.name || item.country_name || item.state_name || item.city_name || item.account_name || item.profile_name || '',
            arabic_name: item.arabic_name || item.state_name_ar || item.city_name_ar || '',
            description: item.description || item.account_desc || '',
            is_active: item.is_active ?? item.isActive ?? true,
            display_order: item.display_order ?? 0,
            class_name: item.class_name || '',
            dependency_id: item.dependency_id ?? null
          }));
        }
      },
      error: (err) => {
        this.loadingDependencyItems = false;
        console.error(err);
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  getActiveCategory(): LookupType | null {
    return this.categories.find(c => c.id === this.selectedCategoryId) || null;
  }

  toggleStatus(item: LookupItem): void {
    item.is_active = !item.is_active;
  }

  // ── Form open / close ──────────────────────────────────────────────────────
  openAddForm(): void {
    const user = this.commonService.getCurrentUser();
    this.dependencyItems = [];
    this.masterForm.reset({
      id: 0,
      lookup_TypeId: this.selectedCategoryId || 0,
      code: '',
      name: '',
      arabic_name: '',
      description: '',
      is_Active: true,
      company_id: user?.companyId || 1,
      display_order: 0,
      user_id: user?.userId || 1,
      dependency_type_id: null,
      dependency_id: null,
      class_name: '',
      clientid: user?.clientId || '74BB6922'
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSubmitMaster(): void {
    if (this.masterForm.invalid) return;

    const user = this.commonService.getCurrentUser();
    const formVal = this.masterForm.value;

    const payload = {
      id:             formVal.id ?? 0,
      lookup_TypeId:  this.selectedCategoryId || 0,
      code:           formVal.code || '',
      name:           formVal.name || '',
      arabic_name:    formVal.arabic_name || '',
      description:    formVal.description || '',
      is_Active:      formVal.is_Active ?? true,
      company_id:     user?.companyId || 1,
      display_order:  formVal.display_order ?? 0,
      user_id:        user?.userId || 1,
      dependency_id:  formVal.dependency_id ?? 0,
      class_name:     formVal.class_name || '',
      clientid:       user?.clientId || '74BB6922'
    };

    const url = environment.apiurl + 'api/Masters/save_lookup';

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Record saved successfully', 'Success');
          this.closeForm();
          // Refresh items list and update record count
          if (this.selectedCategoryId !== null) {
            this.loadCategoryItems(this.selectedCategoryId);
          }
        } else {
          this.toastr.error(res?.message || 'Failed to save record', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while saving', 'Error');
        console.error(err);
      }
    });
  }
}
