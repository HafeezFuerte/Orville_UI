import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PagePermissionService } from '../services/page-permission.service';

/**
 * Structural directive to conditionally render DOM elements based on page-level permissions.
 *
 * Usage:
 *   <button *appHasPermission="'AddTenant'">Add Tenant</button>
 *   <button *appHasPermission="'ExportTenant'">Export</button>
 *   <button *appHasPermission="['AddProperty', 'create']">Add Property</button>
 *   <button *appHasPermission="'ExportTenant'; screenId: 10">Export</button>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PagePermissionService);
  private cdr = inject(ChangeDetectorRef);

  private actionKey: string | string[] = '';
  private targetScreenId?: number;
  private isHidden = true;
  private sub?: Subscription;

  @Input()
  set appHasPermission(action: string | string[]) {
    this.actionKey = action;
    this.updateView();
  }

  @Input()
  set appHasPermissionScreenId(screenId: number | undefined) {
    this.targetScreenId = screenId;
    this.updateView();
  }

  ngOnInit(): void {
    this.sub = this.permissionService.state$.subscribe(() => {
      this.updateView();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateView(): void {
    const hasPerm = this.permissionService.hasPermission(
      this.actionKey,
      this.targetScreenId
    );

    if (hasPerm && this.isHidden) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else if (!hasPerm && !this.isHidden) {
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
}
