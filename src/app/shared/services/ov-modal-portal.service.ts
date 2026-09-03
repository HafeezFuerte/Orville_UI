import { Injectable, NgZone, OnDestroy } from '@angular/core';

/**
 * Moves nested modal/drawer overlays to document.body so they escape page
 * stacking contexts (sticky table heads, detail panels) and sit above
 * app-header / sidebar (z-49).
 */
@Injectable({ providedIn: 'root' })
export class OvModalPortalService implements OnDestroy {
  private observer: MutationObserver | null = null;
  private readonly portaled = new WeakSet<Element>();

  /** Elements that should live on document.body while shown. */
  private readonly portalSelector = [
    '.ov-modal-backdrop',
    '.ov-create-overlay',
    '.ov-filter-drawer__container.active',
    '.ov-email-sub-drawer.active',
    '[data-ov-modal-portal]',
  ].join(',');

  start(zone: NgZone): void {
    if (this.observer || typeof document === 'undefined') {
      return;
    }

    zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => {
        this.scan();
        this.syncBodyClass();
      });
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
      this.scan();
      this.syncBodyClass();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    document.body.classList.remove('ov-modal-open');
  }

  /** Portal a component host (delete-confirmation / reusable-modal). */
  portalHost(el: HTMLElement): void {
    if (!el) {
      return;
    }
    el.setAttribute('data-ov-modal-portaled', 'true');
    if (el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
    this.portaled.add(el);
    this.syncBodyClass();
  }

  releaseHost(): void {
    this.syncBodyClass();
  }

  private scan(): void {
    document.querySelectorAll(this.portalSelector).forEach((node) => {
      const el = node as HTMLElement;
      if (this.shouldSkip(el)) {
        return;
      }
      this.portalElement(el);
    });
  }

  private shouldSkip(el: HTMLElement): boolean {
    if (this.portaled.has(el)) {
      return true;
    }
    // Child of an already-portaled host (e.g. backdrop inside app-delete-confirmation)
    const portaledAncestor = el.parentElement?.closest('[data-ov-modal-portaled="true"]');
    if (portaledAncestor && portaledAncestor !== el) {
      return true;
    }
    return false;
  }

  private portalElement(el: HTMLElement): void {
    el.setAttribute('data-ov-modal-portaled', 'true');
    if (el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
    this.portaled.add(el);
  }

  private syncBodyClass(): void {
    const nodes = document.querySelectorAll('[data-ov-modal-portaled="true"]');
    let anyOpen = false;

    nodes.forEach((node) => {
      const el = node as HTMLElement;
      if (!document.body.contains(el)) {
        return;
      }
      if (
        el.classList.contains('ov-filter-drawer__container') ||
        el.classList.contains('ov-email-sub-drawer')
      ) {
        if (el.classList.contains('active')) {
          anyOpen = true;
        }
        return;
      }
      anyOpen = true;
    });

    document.body.classList.toggle('ov-modal-open', anyOpen);
  }
}
