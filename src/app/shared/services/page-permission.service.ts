import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common.service';
import { getScreenId, ScreenId } from '../config/screen-ids.config';

export interface ActionPermission {
  Key: string;
  Value: string | number;
  Label?: string;
  JsonLabel?: string;
}

export interface ScreenPermissionState {
  screenId: number | null;
  menuName?: string;
  permissions: Record<string, boolean>;
  actions: ActionPermission[];
  loading: boolean;
  error?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PagePermissionService {
  private http = inject(HttpClient);
  private commonService = inject(CommonService);
  private router = inject(Router);

  // Active screen permission state
  private currentStateSubject = new BehaviorSubject<ScreenPermissionState>({
    screenId: null,
    permissions: {},
    actions: [],
    loading: false,
    error: null
  });

  public readonly state$ = this.currentStateSubject.asObservable();
  public readonly permissions$ = this.currentStateSubject.pipe(
    map(state => state.permissions)
  );

  // In-memory cache by screenId
  private cache = new Map<number, ScreenPermissionState>();

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects || event.url;
      const screenId = getScreenId(url);
      if (screenId) {
        this.loadPagePermissions(screenId).subscribe();
      }
    });
  }

  /**
   * Load permissions for a given screenId or URL/route string.
   * If screenIdOrUrl is omitted, attempts to auto-detect from router.url.
   */
  loadPagePermissions(screenIdOrUrl?: number | string, forceRefresh = false): Observable<Record<string, boolean>> {
    let resolvedScreenId: number | null = null;

    if (typeof screenIdOrUrl === 'number') {
      resolvedScreenId = screenIdOrUrl;
    } else if (typeof screenIdOrUrl === 'string') {
      resolvedScreenId = getScreenId(screenIdOrUrl);
    } else {
      resolvedScreenId = getScreenId(this.router.url);
    }

    if (!resolvedScreenId) {
      console.warn(`[PagePermissionService] No screen ID found for '${screenIdOrUrl || this.router.url}'`);
      const emptyState: ScreenPermissionState = {
        screenId: null,
        permissions: {},
        actions: [],
        loading: false,
        error: 'Screen ID not found'
      };
      this.currentStateSubject.next(emptyState);
      return of({});
    }

    // Check cache
    if (!forceRefresh && this.cache.has(resolvedScreenId)) {
      const cached = this.cache.get(resolvedScreenId)!;
      this.currentStateSubject.next(cached);
      return of(cached.permissions);
    }

    // Set loading state
    this.currentStateSubject.next({
      ...this.currentStateSubject.value,
      screenId: resolvedScreenId,
      loading: true,
      error: null
    });

    const user = this.commonService.getCurrentUser();
    const payload = {
      TypeId: 111,
      filterId: resolvedScreenId,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      ClientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1
    };

    const url = `${environment.apiurl}api/Masters/_getMasters`;
    const headers = this.commonService.updateHeaders ? this.commonService.updateHeaders() : undefined;

    return this.http.post<any>(url, payload, { headers }).pipe(
      map(res => {
        const row = res?.objResult?.table?.[0] || res?.data?.[0];
        const rawActions: any = row?.actions;
        let actionList: ActionPermission[] = [];

        if (typeof rawActions === 'string') {
          try {
            actionList = JSON.parse(rawActions);
          } catch (e) {
            console.error('[PagePermissionService] Error parsing actions JSON:', e, rawActions);
          }
        } else if (Array.isArray(rawActions)) {
          actionList = rawActions;
        }

        const permMap: Record<string, boolean> = {};

        if (Array.isArray(actionList)) {
          for (const item of actionList) {
            if (item?.Key) {
              const isAllowed = String(item.Value) === '1' || Number(item.Value) === 1;
              // Exact key (e.g. 'AddTenant')
              permMap[item.Key] = isAllowed;
              // Lowercase key (e.g. 'addtenant')
              permMap[item.Key.toLowerCase()] = isAllowed;
            }
          }
        }

        const newState: ScreenPermissionState = {
          screenId: resolvedScreenId,
          menuName: row?.menuName || '',
          permissions: permMap,
          actions: actionList,
          loading: false,
          error: null
        };

        this.cache.set(resolvedScreenId!, newState);
        this.currentStateSubject.next(newState);
        return permMap;
      }),
      catchError(err => {
        console.error('[PagePermissionService] Failed to load permissions for screen', resolvedScreenId, err);
        const errorState: ScreenPermissionState = {
          screenId: resolvedScreenId,
          permissions: {},
          actions: [],
          loading: false,
          error: err?.message || 'Error loading permissions'
        };
        this.currentStateSubject.next(errorState);
        return of({});
      })
    );
  }

  /**
   * Synchronously checks if an action is permitted on the current screen (or specific screenId).
   * Checks exact key, lowercase key, and semantic keyword matching.
   */
  hasPermission(actionKey: string | string[], screenId?: number): boolean {
    if (!actionKey) return true;

    const targetPermissions = screenId && this.cache.has(screenId)
      ? this.cache.get(screenId)!.permissions
      : this.currentStateSubject.value.permissions;

    if (!targetPermissions || Object.keys(targetPermissions).length === 0) {
      return false;
    }

    const keysToCheck = (Array.isArray(actionKey) ? actionKey : [actionKey]).filter(Boolean);
    if (keysToCheck.length === 0) return true;

    // Pass 1: Exact / lowercase key matches take precedence over loose keyword fallbacks
    let foundExactKey = false;
    for (const key of keysToCheck) {
      if (targetPermissions[key] !== undefined) {
        foundExactKey = true;
        if (targetPermissions[key]) return true;
      } else {
        const lowerKey = key.toLowerCase();
        if (targetPermissions[lowerKey] !== undefined) {
          foundExactKey = true;
          if (targetPermissions[lowerKey]) return true;
        }
      }
    }
    if (foundExactKey) {
      return false;
    }

    // Pass 2: Semantic keyword match (e.g. 'export' matches 'ExportLease')
    return keysToCheck.some(key => this.checkSemanticPermission(key, targetPermissions));
  }

  /**
   * Checks permission ONLY if at least one matching action key exists in the loaded screen's
   * TypeId 111 actions. If no matching key is configured for this screen, returns `true`
   * so secondary workflow buttons (e.g. Print, Approve/Decline) are not hidden unintentionally.
   */
  hasPermissionIfDefined(actionKey: string | string[], screenId?: number): boolean {
    if (!actionKey) return true;

    const targetPermissions = screenId && this.cache.has(screenId)
      ? this.cache.get(screenId)!.permissions
      : this.currentStateSubject.value.permissions;

    if (!targetPermissions || Object.keys(targetPermissions).length === 0) {
      return true;
    }

    const keysToCheck = (Array.isArray(actionKey) ? actionKey : [actionKey]).filter(Boolean);
    const allPermKeys = Object.keys(targetPermissions);
    const hasConfiguredKey = keysToCheck.some(key => {
      const lk = key.toLowerCase();
      return targetPermissions[key] !== undefined ||
        targetPermissions[lk] !== undefined ||
        allPermKeys.some(pk => pk.toLowerCase().includes(lk));
    });

    return hasConfiguredKey ? this.hasPermission(keysToCheck, screenId) : true;
  }

  private checkSemanticPermission(key: string, permissions: Record<string, boolean>): boolean {
    if (!key) return true;
    const lowerKey = key.toLowerCase();

    const matchingKey = Object.keys(permissions).find(k => {
      const lk = k.toLowerCase();
      return lk === lowerKey || lk.includes(lowerKey);
    });

    return matchingKey !== undefined ? permissions[matchingKey] : false;
  }

  /**
   * Get all actions returned for the current or specified screen
   */
  getActions(screenId?: number): ActionPermission[] {
    if (screenId && this.cache.has(screenId)) {
      return this.cache.get(screenId)!.actions;
    }
    return this.currentStateSubject.value.actions;
  }

  /**
   * Convenience helpers
   */
  canAdd(screenId?: number): boolean {
    return this.hasPermission(['add', 'create', 'new'], screenId);
  }

  canEdit(screenId?: number): boolean {
    return this.hasPermission(['edit', 'update'], screenId);
  }

  canDelete(screenId?: number): boolean {
    return this.hasPermission(['delete', 'remove'], screenId);
  }

  canExport(screenId?: number): boolean {
    return this.hasPermission(['export', 'download'], screenId);
  }

  canImport(screenId?: number): boolean {
    return this.hasPermission(['import', 'upload'], screenId);
  }

  /**
   * Clear permissions cache (e.g. on logout or company switch)
   */
  clearCache(): void {
    this.cache.clear();
    this.currentStateSubject.next({
      screenId: null,
      permissions: {},
      actions: [],
      loading: false,
      error: null
    });
  }
}
