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
  picker?: { element?: HTMLElement };
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
      const picker = (this.instance as any)?.picker;
      // Reposition after layout so month/year views stay clear of the header.
      requestAnimationFrame(() => picker?.place?.());
    };

    element.addEventListener('input', emitValue);
    element.addEventListener('change', emitValue);
    element.addEventListener('blur', emitTouched);
    element.addEventListener('changeDate', emitValue as EventListener);
    element.addEventListener('show', onShow as EventListener);
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
    this.removeInputListener?.();
    this.removeChangeListener?.();
    this.removeBlurListener?.();
    this.removeDateListener?.();
    this.removeShowListener?.();
    this.instance?.destroy?.();
  }

  private stylePickerLayer(): void {
    const pickerEl =
      ((this.instance as any)?.getPickerElement?.() as HTMLElement | undefined) ||
      this.instance?.picker?.element;
    if (!pickerEl) {
      return;
    }
    pickerEl.classList.add('orville-datepicker');
    pickerEl.style.zIndex = '9';
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
