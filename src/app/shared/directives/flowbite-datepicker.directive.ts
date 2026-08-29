import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { ORVILLE_FLOWBITE_DATEPICKER_OPTIONS } from '../config/orville-flowbite-datepicker.config';

type FlowbiteDatepickerInstance = {
  destroy?: () => void;
  setDate?: (value: string | Date) => void;
  picker?: {
    element?: HTMLElement;
    active?: boolean;
    place?: () => void;
  };
};

@Directive({
  selector: 'input[appFlowbiteDatepicker]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlowbiteDatepickerDirective),
      multi: true,
    },
  ],
})
export class FlowbiteDatepickerDirective
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  @Input() appFlowbiteDatepicker: Record<string, unknown> | '' = '';

  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly zone = inject(NgZone);

  private instance: FlowbiteDatepickerInstance | null = null;
  private removeInputListener?: () => void;
  private removeChangeListener?: () => void;
  private removeBlurListener?: () => void;
  private removeDateListener?: () => void;
  private removeShowListener?: () => void;
  private removeHideListener?: () => void;
  private scrollTargets: Array<Window | Element> = [];
  private readonly onScrollOrResize = () => this.repositionPicker();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    const options = {
      ...ORVILLE_FLOWBITE_DATEPICKER_OPTIONS,
      ...((this.appFlowbiteDatepicker || {}) as Record<string, unknown>),
    };

    this.zone.runOutsideAngular(() => {
      this.instance = new (Datepicker as any)(element, options);
      this.stylePickerLayer();
    });

    const emitValue = () => {
      this.zone.run(() => {
        this.onChange(element.value);
      });
    };

    const emitTouched = () => {
      this.zone.run(() => this.onTouched());
    };

    const onShow = () => {
      this.stylePickerLayer();
      this.bindScrollListeners();
      // Double rAF so calendar has measurable height before anchoring.
      requestAnimationFrame(() => {
        this.repositionPicker();
        requestAnimationFrame(() => this.repositionPicker());
      });
    };

    const onHide = () => {
      this.unbindScrollListeners();
    };

    element.addEventListener('input', emitValue);
    element.addEventListener('change', emitValue);
    element.addEventListener('blur', emitTouched);
    element.addEventListener('changeDate', emitValue as EventListener);
    element.addEventListener('show', onShow as EventListener);
    element.addEventListener('hide', onHide as EventListener);
    element.addEventListener('changeView', onShow as EventListener);
    element.addEventListener('changeMonth', onShow as EventListener);
    element.addEventListener('changeYear', onShow as EventListener);

    this.removeInputListener = () => element.removeEventListener('input', emitValue);
    this.removeChangeListener = () => element.removeEventListener('change', emitValue);
    this.removeBlurListener = () => element.removeEventListener('blur', emitTouched);
    this.removeDateListener = () =>
      element.removeEventListener('changeDate', emitValue as EventListener);
    this.removeShowListener = () => {
      element.removeEventListener('show', onShow as EventListener);
      element.removeEventListener('changeView', onShow as EventListener);
      element.removeEventListener('changeMonth', onShow as EventListener);
      element.removeEventListener('changeYear', onShow as EventListener);
    };
    this.removeHideListener = () =>
      element.removeEventListener('hide', onHide as EventListener);
  }

  writeValue(value: unknown): void {
    const element = this.elementRef.nativeElement;
    const normalized = this.normalizeValue(value);
    element.value = normalized;

    if (normalized && this.instance?.setDate) {
      this.instance.setDate(normalized);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.unbindScrollListeners();
    this.removeInputListener?.();
    this.removeChangeListener?.();
    this.removeBlurListener?.();
    this.removeDateListener?.();
    this.removeShowListener?.();
    this.removeHideListener?.();
    this.instance?.destroy?.();
  }

  private stylePickerLayer(): void {
    const pickerEl = this.getPickerElement();
    if (!pickerEl) {
      return;
    }
    pickerEl.classList.add('orville-datepicker');
    // Above .ov-modal-backdrop (10050). Fixed so it tracks viewport (modals / page scroll).
    pickerEl.style.zIndex = '10100';
    pickerEl.style.position = 'fixed';
  }

  /**
   * Flowbite places with position:absolute + document scroll offsets, which drifts
   * when the page scrolls under a position:fixed modal. Re-anchor in viewport space.
   */
  private repositionPicker(): void {
    const picker = this.instance?.picker;
    const pickerEl = this.getPickerElement();
    const input = this.elementRef.nativeElement;
    if (!pickerEl || !picker?.active) {
      return;
    }

    this.stylePickerLayer();

    const gap = 6;
    const inputRect = input.getBoundingClientRect();
    const calRect = pickerEl.getBoundingClientRect();
    const calWidth = calRect.width || 280;
    const calHeight = calRect.height || 280;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = inputRect.left;
    if (left + calWidth > viewportW - 8) {
      left = Math.max(8, inputRect.right - calWidth);
    }
    left = Math.max(8, left);

    const spaceBelow = viewportH - inputRect.bottom - gap;
    const spaceAbove = inputRect.top - gap;
    const openAbove = spaceBelow < calHeight && spaceAbove > spaceBelow;

    let top = openAbove ? inputRect.top - calHeight - gap : inputRect.bottom + gap;
    top = Math.min(Math.max(8, top), Math.max(8, viewportH - calHeight - 8));

    pickerEl.style.position = 'fixed';
    pickerEl.style.left = `${Math.round(left)}px`;
    pickerEl.style.top = `${Math.round(top)}px`;
    pickerEl.style.right = 'auto';
    pickerEl.style.bottom = 'auto';
    pickerEl.style.margin = '0';
    pickerEl.style.transform = 'none';
  }

  private getPickerElement(): HTMLElement | undefined {
    return (
      ((this.instance as any)?.getPickerElement?.() as HTMLElement | undefined) ||
      this.instance?.picker?.element
    );
  }

  private bindScrollListeners(): void {
    this.unbindScrollListeners();
    this.scrollTargets = this.collectScrollTargets(this.elementRef.nativeElement);
    this.zone.runOutsideAngular(() => {
      this.scrollTargets.forEach((target) => {
        target.addEventListener('scroll', this.onScrollOrResize, true);
      });
      window.addEventListener('resize', this.onScrollOrResize);
    });
  }

  private unbindScrollListeners(): void {
    this.scrollTargets.forEach((target) => {
      target.removeEventListener('scroll', this.onScrollOrResize, true);
    });
    window.removeEventListener('resize', this.onScrollOrResize);
    this.scrollTargets = [];
  }

  private collectScrollTargets(start: HTMLElement): Array<Window | Element> {
    const targets: Array<Window | Element> = [window];
    let node: HTMLElement | null = start.parentElement;
    while (node) {
      const style = window.getComputedStyle(node);
      const overflow = `${style.overflow}|${style.overflowY}|${style.overflowX}`;
      if (/(auto|scroll|overlay)/.test(overflow)) {
        targets.push(node);
      }
      node = node.parentElement;
    }
    return targets;
  }

  private normalizeValue(value: unknown): string {
    if (!value) {
      return '';
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const day = String(value.getDate()).padStart(2, '0');
      const month = String(value.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}/${value.getFullYear()}`;
    }
    if (typeof value === 'string') {
      return value.replace(/-/g, '/');
    }
    return String(value);
  }
}
