import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-confirmation/delete-confirmation.component';
import {
  FLAT_PAYMENT_STATUSES,
  FLAT_ROWS,
  FLAT_STAY_STATUSES,
  FlatPaymentStatus,
  FlatRow,
  FlatStay,
  FlatStayStatus,
  addDays,
  addMonths,
  addYears,
  dateKey,
  diffDays,
  parseDateKey,
  seedFlatStays,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  staysOverlap
} from '../flat-reservations.data';

export type CalendarView = 'day' | 'week' | 'month' | 'year' | 'schedule' | 'days4';

interface CalDay {
  date: Date;
  key: string;
  weekday: string;
  dayNum: string;
  isToday: boolean;
  inMonth: boolean;
}

interface StayBar {
  stay: FlatStay;
  start: number;
  span: number;
  lane: number;
  hidden?: boolean;
}

interface AgendaGroup {
  key: string;
  heading: string;
  stays: FlatStay[];
}

interface YearBoard {
  date: Date;
  title: string;
  days: CalDay[];
}

interface StayForm {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  flatId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  status: FlatStayStatus;
  paymentStatus: FlatPaymentStatus;
  totalAmount: number;
  paidAmount: number;
  notes: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const FLAT_TONES = ['primary', 'success', 'warning', 'info', 'danger', 'muted', 'primary', 'success'];

interface MonthWeek {
  days: CalDay[];
  bars: StayBar[];
  laneCount: number;
  overflowCount: number;
}

const MAX_EVENT_LANES = 3;
const EVENT_LANE_HEIGHT = 22;
const EVENT_LANE_GAP = 4;

@Component({
  selector: 'app-flat-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, FlatpickrModule, DeleteConfirmationComponent],
  templateUrl: './flat-reservations.component.html',
  styleUrl: './flat-reservations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatReservationsComponent implements OnInit {
  readonly views: { id: CalendarView; label: string; shortcut: string }[] = [
    { id: 'day', label: 'Day', shortcut: 'D' },
    { id: 'week', label: 'Week', shortcut: 'W' },
    { id: 'month', label: 'Month', shortcut: 'M' },
    { id: 'year', label: 'Year', shortcut: 'Y' },
    { id: 'schedule', label: 'Schedule', shortcut: 'A' },
    { id: 'days4', label: '4 days', shortcut: 'X' }
  ];
  readonly hours = Array.from({ length: 24 }, (_, hour) => hour);
  readonly weekdaysShort = WEEKDAYS_SHORT;
  view: CalendarView = 'month';
  anchor = startOfDay(new Date());
  miniMonth = startOfMonth(new Date());
  flats = FLAT_ROWS;
  stays: FlatStay[] = [];
  todayKey = dateKey(new Date());
  searchQuery = '';
  flatVisible: Record<string, boolean> = {};
  showCancelled = true;
  showViewMenu = false;
  propertiesOpen = true;
  statusOptions = FLAT_STAY_STATUSES;
  paymentOptions = FLAT_PAYMENT_STATUSES;
  showFormModal = false;
  showDetailModal = false;
  showActionMenu = false;
  showDeleteConfirm = false;
  formMode: 'create' | 'edit' = 'create';
  formError = '';
  selectedStay: FlatStay | null = null;
  form: StayForm = this.emptyForm();
  nextStayId = 2000;
  dragCol = -1;
  dragEndCol = -1;
  isDragging = false;
  monthWeeks: MonthWeek[] = [];
  miniDays: CalDay[] = [];
  miniLabel = '';
  rangeLabel = '';
  propertyGroups: { name: string; flats: FlatRow[] }[] = [];
  flatSelectItems: { id: string; label: string }[] = [];
  timedDays: CalDay[] = [];
  allDayBars: StayBar[] = [];
  allDayLaneCount = 1;
  allDayOverflowCount = 0;
  yearBoards: YearBoard[] = [];
  agendaGroups: AgendaGroup[] = [];
  staysByDayKey = new Set<string>();
  private activeStaysCache: FlatStay[] = [];
  private flatToneById = new Map<string, string>();
  private detailTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.flats.forEach((flat) => {
      this.flatVisible[flat.id] = true;
      this.flatToneById.set(flat.id, FLAT_TONES[this.flats.indexOf(flat) % FLAT_TONES.length]);
    });
    this.flatSelectItems = this.buildFlatSelectItems();
    this.propertyGroups = this.buildPropertyGroups();
    this.goToToday();
    this.stays = seedFlatStays(new Date());
    this.refreshCalendar();
  }

  get viewLabel(): string {
    return this.views.find((item) => item.id === this.view)?.label ?? 'Month';
  }

  get tzLabel(): string {
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '';
    return `GMT${sign}${offset}`;
  }

  get activeStays(): FlatStay[] {
    return this.activeStaysCache;
  }

  get selectedFlat(): FlatRow | undefined {
    return this.flatById(this.selectedStay?.flatId);
  }

  get detailActions(): { label: string; asset: string; danger: boolean }[] {
    const stay = this.selectedStay;
    if (!stay) {
      return [];
    }
    const items = [{ label: 'Edit', asset: 'assets/images/action-menu/pencil.svg', danger: false }];
    if (stay.status === 'Pending') {
      items.push({ label: 'Confirm', asset: 'assets/images/action-menu/file-invoice.svg', danger: false });
    }
    if (stay.status === 'Confirmed' || stay.status === 'Pending') {
      items.push({ label: 'Check in', asset: 'assets/images/action-menu/clock.svg', danger: false });
    }
    if (stay.status === 'Checked in') {
      items.push({ label: 'Check out', asset: 'assets/images/action-menu/clock.svg', danger: false });
    }
    items.push({ label: 'Duplicate', asset: 'assets/images/action-menu/file-invoice.svg', danger: false });
    items.push({ label: 'Cancel', asset: 'assets/images/action-menu/archive.svg', danger: true });
    items.push({ label: 'Delete', asset: 'assets/images/action-menu/archive.svg', danger: true });
    return items;
  }

  staysOnDay(key: string): boolean {
    return this.staysByDayKey.has(key);
  }

  trackByWeekIndex(index: number): number {
    return index;
  }

  trackByDayKey(_index: number, day: CalDay): string {
    return day.key;
  }

  trackByStayId(_index: number, stay: FlatStay): string {
    return stay.id;
  }

  trackByBarStayId(_index: number, bar: StayBar): string {
    return bar.stay.id;
  }

  trackByFlatId(_index: number, flat: FlatRow): string {
    return flat.id;
  }

  trackByGroupName(_index: number, group: { name: string }): string {
    return group.name;
  }

  onSearchChange(): void {
    this.refreshCalendar();
  }

  onFlatVisibilityChange(): void {
    this.refreshCalendar();
  }

  onShowCancelledChange(): void {
    this.refreshCalendar();
  }

  barStyle(bar: StayBar, count: number): Record<string, string> {
    const step = EVENT_LANE_HEIGHT + EVENT_LANE_GAP;
    return {
      left: `calc(${(bar.start / count) * 100}% + 3px)`,
      width: `calc(${(bar.span / count) * 100}% - 6px)`,
      top: `${bar.lane * step}px`
    };
  }

  weekRowHeight(week: MonthWeek): number {
    const lanes = Math.max(week.laneCount, 1);
    const overflowRow = week.overflowCount > 0 ? EVENT_LANE_HEIGHT + EVENT_LANE_GAP : 0;
    return 38 + lanes * (EVENT_LANE_HEIGHT + EVENT_LANE_GAP) + overflowRow + 10;
  }

  allDayTrackHeight(): number {
    const lanes = Math.max(this.allDayLaneCount, 1);
    const overflowRow = this.allDayOverflowCount > 0 ? EVENT_LANE_HEIGHT + EVENT_LANE_GAP : 0;
    return Math.max(36, 8 + lanes * (EVENT_LANE_HEIGHT + EVENT_LANE_GAP) + overflowRow);
  }

  eventLabel(stay: FlatStay): string {
    const flat = this.flatName(stay.flatId);
    return flat ? `${stay.guestName} · ${flat}` : stay.guestName;
  }

  overflowTop(laneCount: number): number {
    return laneCount * (EVENT_LANE_HEIGHT + EVENT_LANE_GAP);
  }

  openWeekOverflow(week: MonthWeek): void {
    this.anchor = startOfDay(week.days[0].date);
    this.view = 'week';
    this.refreshCalendar();
  }

  hourLabel(hour: number): string {
    if (hour === 0) {
      return '';
    }
    const suffix = hour < 12 ? 'AM' : 'PM';
    const value = hour % 12 === 0 ? 12 : hour % 12;
    return `${value} ${suffix}`;
  }

  flatTone(flatId: string): string {
    return this.flatToneById.get(flatId) ?? 'primary';
  }

  eventClass(stay: FlatStay): string {
    return `frc-event frc-event--${this.flatTone(stay.flatId)}`;
  }

  statusChip(status: FlatStayStatus): string {
    if (status === 'Confirmed') {
      return 'ov-outline-chip ov-outline-chip--success';
    }
    if (status === 'Pending') {
      return 'ov-outline-chip ov-outline-chip--warning';
    }
    if (status === 'Checked in') {
      return 'ov-outline-chip ov-outline-chip--success';
    }
    if (status === 'Cancelled') {
      return 'ov-outline-chip ov-outline-chip--danger';
    }
    return 'ov-outline-chip ov-outline-chip--muted';
  }

  paymentChip(status: FlatPaymentStatus): string {
    if (status === 'Paid') {
      return 'ov-outline-chip ov-outline-chip--success';
    }
    if (status === 'Partial') {
      return 'ov-outline-chip ov-outline-chip--warning';
    }
    return 'ov-outline-chip ov-outline-chip--danger';
  }

  stayNights(stay: FlatStay): number {
    return Math.max(1, diffDays(stay.checkIn, stay.checkOut));
  }

  balanceDue(stay: FlatStay): number {
    return Math.max(0, stay.totalAmount - stay.paidAmount);
  }

  editFromDetail(): void {
    if (this.selectedStay) {
      this.onDetailAction('Edit');
    }
  }

  flatName(flatId: string): string {
    return this.flatById(flatId)?.name ?? '';
  }

  isDragCell(index: number): boolean {
    if (!this.isDragging || this.dragCol < 0) {
      return false;
    }
    const from = Math.min(this.dragCol, this.dragEndCol);
    const to = Math.max(this.dragCol, this.dragEndCol);
    return index >= from && index <= to;
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.showViewMenu = false;
    this.miniMonth = startOfMonth(this.anchor);
    this.refreshCalendar();
  }

  toggleViewMenu(event: Event): void {
    event.stopPropagation();
    this.showViewMenu = !this.showViewMenu;
    this.cdr.markForCheck();
  }

  goToToday(): void {
    this.anchor = startOfDay(new Date());
    this.todayKey = dateKey(this.anchor);
    this.miniMonth = startOfMonth(this.anchor);
    this.refreshCalendar();
  }

  shiftRange(direction: number): void {
    if (this.view === 'day') {
      this.anchor = addDays(this.anchor, direction);
    } else if (this.view === 'week') {
      this.anchor = addDays(this.anchor, direction * 7);
    } else if (this.view === 'days4') {
      this.anchor = addDays(this.anchor, direction * 4);
    } else if (this.view === 'year') {
      this.anchor = addYears(this.anchor, direction);
    } else {
      this.anchor = addMonths(this.anchor, direction);
    }
    this.miniMonth = startOfMonth(this.anchor);
    this.refreshCalendar();
  }

  shiftMini(direction: number): void {
    this.miniMonth = addMonths(this.miniMonth, direction);
    this.refreshCalendar();
  }

  selectDay(day: CalDay, asView?: CalendarView): void {
    this.anchor = startOfDay(day.date);
    this.miniMonth = startOfMonth(this.anchor);
    if (asView) {
      this.view = asView;
    }
    this.refreshCalendar();
  }

  openMonth(date: Date): void {
    this.anchor = startOfMonth(date);
    this.miniMonth = this.anchor;
    this.view = 'month';
    this.refreshCalendar();
  }

  isAnchor(day: CalDay): boolean {
    return day.key === dateKey(this.anchor);
  }

  openCreateBlank(): void {
    this.openCreate(startOfDay(this.anchor), addDays(this.anchor, 1));
  }

  openCreateOnDay(day: CalDay, event: Event): void {
    event.stopPropagation();
    this.openCreate(startOfDay(day.date), addDays(day.date, 1));
  }

  openDetail(stay: FlatStay, event?: Event): void {
    event?.stopPropagation();
    this.clearDrag();
    this.selectedStay = stay;
    this.showActionMenu = false;
    this.showFormModal = false;
    this.showDetailModal = true;
    this.cdr.markForCheck();
  }

  onEventDoubleClick(stay: FlatStay, event: Event): void {
    event.stopPropagation();
    this.clearDetailTimer();
    this.selectedStay = stay;
    this.openEdit(stay);
  }

  onEventClick(stay: FlatStay, event: Event): void {
    event.stopPropagation();
    this.scheduleDetail(stay);
  }

  onTimedMouseDown(index: number, event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    this.isDragging = true;
    this.dragCol = index;
    this.dragEndCol = index;
    this.cdr.markForCheck();
  }

  onTimedMouseEnter(index: number): void {
    if (this.isDragging) {
      this.dragEndCol = index;
      this.cdr.markForCheck();
    }
  }

  saveForm(): void {
    this.formError = '';
    if (!this.form.guestName.trim() || !this.form.flatId || !this.form.checkIn || !this.form.checkOut) {
      this.formError = 'Guest name, flat, start date, and end date are required.';
      return;
    }
    const checkIn = dateKey(startOfDay(this.form.checkIn));
    const checkOut = dateKey(startOfDay(this.form.checkOut));
    if (checkOut <= checkIn) {
      this.formError = 'End date must be after start date.';
      return;
    }
    const draft: FlatStay = {
      id: this.formMode === 'edit' ? this.form.id : `s-${this.nextStayId++}`,
      flatId: this.form.flatId,
      guestName: this.form.guestName.trim(),
      phone: this.form.phone.trim(),
      email: this.form.email.trim(),
      checkIn,
      checkOut,
      guests: Number(this.form.guests) || 1,
      status: this.form.status,
      paymentStatus: this.form.paymentStatus,
      totalAmount: Number(this.form.totalAmount) || 0,
      paidAmount: Number(this.form.paidAmount) || 0,
      notes: this.form.notes.trim()
    };
    if (!this.commitStay(draft)) {
      return;
    }
    this.showFormModal = false;
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
    this.cdr.markForCheck();
  }

  onDetailAction(label: string): void {
    this.showActionMenu = false;
    const stay = this.selectedStay;
    if (!stay) {
      return;
    }
    if (label === 'Edit') {
      this.openEdit(stay);
      return;
    }
    if (label === 'Duplicate') {
      this.duplicateStay(stay);
      return;
    }
    if (label === 'Delete') {
      this.showDeleteConfirm = true;
      return;
    }
    const nextStatus: Record<string, FlatStayStatus> = {
      Confirm: 'Confirmed',
      'Check in': 'Checked in',
      'Check out': 'Checked out',
      Cancel: 'Cancelled'
    };
    const status = nextStatus[label];
    if (status) {
      this.stays = this.stays.map((row) => (row.id === stay.id ? { ...row, status } : row));
      this.selectedStay = this.stays.find((row) => row.id === stay.id) ?? null;
      this.refreshCalendar();
    }
  }

  confirmDelete(): void {
    if (this.selectedStay) {
      this.stays = this.stays.filter((stay) => stay.id !== this.selectedStay?.id);
    }
    this.showDeleteConfirm = false;
    this.showDetailModal = false;
    this.selectedStay = null;
    this.refreshCalendar();
  }

  formatDate(key: string): string {
    return parseDateKey(key).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  amount(value: number): string {
    return `AED ${value.toLocaleString('en-AE')}`;
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (!this.isDragging || this.dragCol < 0) {
      this.clearDrag();
      return;
    }
    const from = Math.min(this.dragCol, this.dragEndCol);
    const to = Math.max(this.dragCol, this.dragEndCol);
    const start = this.timedDays[from]?.date ?? this.anchor;
    const end = addDays(this.timedDays[to]?.date ?? start, 1);
    this.clearDrag();
    this.openCreate(startOfDay(start), startOfDay(end));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!target?.isContentEditable;
    if (event.key === 'Escape') {
      this.showViewMenu = false;
      this.showFormModal = false;
      this.showDetailModal = false;
      this.showActionMenu = false;
      this.showDeleteConfirm = false;
      this.cdr.markForCheck();
      return;
    }
    if (typing || this.showFormModal) {
      return;
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.showDetailModal && this.selectedStay) {
      event.preventDefault();
      this.showDeleteConfirm = true;
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 't') {
      this.goToToday();
    } else if (key === 'd') {
      this.setView('day');
    } else if (key === 'w') {
      this.setView('week');
    } else if (key === 'm') {
      this.setView('month');
    } else if (key === 'y') {
      this.setView('year');
    } else if (key === 'a') {
      this.setView('schedule');
    } else if (key === 'x') {
      this.setView('days4');
    } else if (key === 'c') {
      this.openCreateBlank();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.shiftRange(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.shiftRange(1);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.showActionMenu || this.showViewMenu) {
      this.showActionMenu = false;
      this.showViewMenu = false;
      this.cdr.markForCheck();
    }
  }

  private refreshCalendar(): void {
    this.activeStaysCache = this.buildActiveStays();
    this.rangeLabel = this.buildRangeLabel();
    this.miniLabel = this.miniMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    this.miniDays = this.buildDays(startOfWeek(this.miniMonth), 42, this.miniMonth);
    this.monthWeeks = this.buildMonthWeeks();
    this.timedDays = this.buildTimedDays();
    this.allDayBars = this.buildAllDayBars();
    this.yearBoards = this.buildYearBoards();
    this.agendaGroups = this.buildAgendaGroups();
    this.staysByDayKey = this.buildStaysByDayKey(this.yearBoards);
    this.cdr.markForCheck();
  }

  private buildPropertyGroups(): { name: string; flats: FlatRow[] }[] {
    const names = [...new Set(this.flats.map((flat) => flat.property))];
    return names.map((name) => ({ name, flats: this.flats.filter((flat) => flat.property === name) }));
  }

  private buildFlatSelectItems(): { id: string; label: string }[] {
    return this.flats
      .filter((flat) => flat.status !== 'Maintenance')
      .map((flat) => ({ id: flat.id, label: `${flat.name} · ${flat.property}` }));
  }

  private buildActiveStays(): FlatStay[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.stays.filter((stay) => {
      if (!this.flatVisible[stay.flatId]) {
        return false;
      }
      if (!this.showCancelled && stay.status === 'Cancelled') {
        return false;
      }
      if (!query) {
        return true;
      }
      const flat = this.flatById(stay.flatId);
      return [stay.guestName, stay.phone, stay.email, flat?.name, flat?.property].some((value) =>
        (value || '').toLowerCase().includes(query)
      );
    });
  }

  private buildRangeLabel(): string {
    if (this.view === 'day') {
      return this.anchor.toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (this.view === 'month') {
      return this.anchor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    }
    if (this.view === 'year') {
      return String(this.anchor.getFullYear());
    }
    if (this.view === 'schedule') {
      const end = addYears(startOfMonth(this.anchor), 1);
      return `${this.anchor.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} – ${end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
    }
    const days = this.buildTimedDays();
    const start = days[0].date;
    const end = days[days.length - 1].date;
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-GB', { month: 'short' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-GB', { month: 'short' })} – ${end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
  }

  private buildMonthWeeks(): MonthWeek[] {
    const start = startOfWeek(startOfMonth(this.anchor));
    return Array.from({ length: 6 }, (_, week) => {
      const days = this.buildDays(addDays(start, week * 7), 7, this.anchor);
      const layout = this.layoutBars(this.barsInRange(days[0].key, dateKey(addDays(days[6].date, 1)), 7));
      return {
        days,
        bars: layout.bars,
        laneCount: layout.laneCount,
        overflowCount: layout.overflowCount
      };
    });
  }

  private buildTimedDays(): CalDay[] {
    const count = this.view === 'day' ? 1 : this.view === 'days4' ? 4 : 7;
    const start = this.view === 'week' ? startOfWeek(this.anchor) : startOfDay(this.anchor);
    return this.buildDays(start, count, start);
  }

  private buildAllDayBars(): StayBar[] {
    const days = this.timedDays;
    if (!days.length) {
      this.allDayLaneCount = 1;
      this.allDayOverflowCount = 0;
      return [];
    }
    const startKey = days[0].key;
    const endKey = dateKey(addDays(days[days.length - 1].date, 1));
    const layout = this.layoutBars(this.barsInRange(startKey, endKey, days.length));
    this.allDayLaneCount = layout.laneCount;
    this.allDayOverflowCount = layout.overflowCount;
    return layout.bars;
  }

  private buildYearBoards(): YearBoard[] {
    const year = this.anchor.getFullYear();
    return Array.from({ length: 12 }, (_, month) => {
      const date = new Date(year, month, 1);
      return {
        date,
        title: date.toLocaleDateString('en-GB', { month: 'long' }),
        days: this.buildDays(startOfWeek(date), 42, date)
      };
    });
  }

  private buildAgendaGroups(): AgendaGroup[] {
    const start = startOfDay(this.anchor);
    const end = addYears(start, 1);
    const startKey = dateKey(start);
    const endKey = dateKey(end);
    const groups = new Map<string, FlatStay[]>();
    this.activeStaysCache
      .filter((stay) => stay.checkIn < endKey && stay.checkOut > startKey)
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
      .forEach((stay) => {
        const list = groups.get(stay.checkIn) ?? [];
        list.push(stay);
        groups.set(stay.checkIn, list);
      });
    return [...groups.entries()].map(([key, stays]) => {
      const date = parseDateKey(key);
      return {
        key,
        heading: `${date.getDate()} ${date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}, ${WEEKDAYS[date.getDay()].toUpperCase()}`,
        stays
      };
    });
  }

  private buildStaysByDayKey(boards: YearBoard[]): Set<string> {
    const keys = new Set<string>();
    for (const board of boards) {
      for (const day of board.days) {
        if (!day.inMonth) {
          continue;
        }
        if (this.activeStaysCache.some((stay) => stay.checkIn <= day.key && stay.checkOut > day.key)) {
          keys.add(day.key);
        }
      }
    }
    return keys;
  }

  private buildDays(start: Date, count: number, monthRef: Date): CalDay[] {
    const month = monthRef.getMonth();
    const year = monthRef.getFullYear();
    return Array.from({ length: count }, (_, index) => {
      const date = addDays(start, index);
      const key = dateKey(date);
      return {
        date,
        key,
        weekday: WEEKDAYS[date.getDay()],
        dayNum: String(date.getDate()),
        isToday: key === this.todayKey,
        inMonth: date.getMonth() === month && date.getFullYear() === year
      };
    });
  }

  private barsInRange(startKey: string, endKey: string, count: number): StayBar[] {
    return this.activeStaysCache
      .filter((stay) => stay.checkIn < endKey && stay.checkOut > startKey)
      .map((stay) => {
        const start = Math.max(0, diffDays(startKey, stay.checkIn));
        const rawEnd = Math.min(count, diffDays(startKey, stay.checkOut));
        return { stay, start, span: Math.max(1, rawEnd - start), lane: 0 };
      });
  }

  private layoutBars(bars: StayBar[]): { bars: StayBar[]; laneCount: number; overflowCount: number } {
    if (!bars.length) {
      return { bars: [], laneCount: 0, overflowCount: 0 };
    }

    const sorted = [...bars].sort((a, b) => a.start - b.start || a.span - b.span);
    const laneEnds: number[] = [];

    for (const bar of sorted) {
      const end = bar.start + bar.span;
      let lane = laneEnds.findIndex((laneEnd) => laneEnd <= bar.start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(end);
      } else {
        laneEnds[lane] = end;
      }
      bar.lane = lane;
    }

    let overflowCount = 0;
    for (const bar of sorted) {
      if (bar.lane >= MAX_EVENT_LANES) {
        bar.hidden = true;
        overflowCount++;
      }
    }

    const visibleLanes = sorted.filter((bar) => !bar.hidden).map((bar) => bar.lane);
    const laneCount = visibleLanes.length ? Math.max(...visibleLanes) + 1 : 0;

    return { bars: sorted, laneCount, overflowCount };
  }

  private flatById(id?: string | null): FlatRow | undefined {
    return this.flats.find((flat) => flat.id === id);
  }

  private openCreate(checkIn: Date, checkOut: Date): void {
    this.formMode = 'create';
    this.formError = '';
    this.form = { ...this.emptyForm(), checkIn, checkOut };
    this.showDetailModal = false;
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  private openEdit(stay: FlatStay): void {
    this.formMode = 'edit';
    this.formError = '';
    this.form = {
      id: stay.id,
      guestName: stay.guestName,
      phone: stay.phone,
      email: stay.email,
      flatId: stay.flatId,
      checkIn: parseDateKey(stay.checkIn),
      checkOut: parseDateKey(stay.checkOut),
      guests: stay.guests,
      status: stay.status,
      paymentStatus: stay.paymentStatus,
      totalAmount: stay.totalAmount,
      paidAmount: stay.paidAmount,
      notes: stay.notes
    };
    this.showDetailModal = false;
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  private duplicateStay(stay: FlatStay): void {
    const nights = Math.max(1, diffDays(stay.checkIn, stay.checkOut));
    const draft: FlatStay = {
      ...stay,
      id: `s-${this.nextStayId++}`,
      guestName: `${stay.guestName} (copy)`,
      checkIn: stay.checkOut,
      checkOut: dateKey(addDays(parseDateKey(stay.checkOut), nights)),
      status: 'Pending'
    };
    if (!this.commitStay(draft, true)) {
      this.openEdit(draft);
      this.formMode = 'create';
      this.formError = 'Choose free dates for the duplicated stay.';
    }
  }

  private commitStay(draft: FlatStay, quiet = false): boolean {
    const conflict = this.stays.some(
      (stay) => stay.id !== draft.id && stay.flatId === draft.flatId && stay.status !== 'Cancelled' && staysOverlap(stay, draft)
    );
    if (conflict) {
      if (!quiet) {
        this.formError = 'This flat already has a stay on the selected dates.';
      }
      return false;
    }
    const exists = this.stays.some((stay) => stay.id === draft.id);
    this.stays = exists ? this.stays.map((stay) => (stay.id === draft.id ? draft : stay)) : [...this.stays, draft];
    if (this.selectedStay?.id === draft.id) {
      this.selectedStay = draft;
    }
    this.formError = '';
    this.refreshCalendar();
    return true;
  }

  private scheduleDetail(stay: FlatStay): void {
    this.clearDetailTimer();
    this.detailTimer = setTimeout(() => this.openDetail(stay), 220);
  }

  private clearDetailTimer(): void {
    if (this.detailTimer) {
      clearTimeout(this.detailTimer);
      this.detailTimer = null;
    }
  }

  private clearDrag(): void {
    this.isDragging = false;
    this.dragCol = -1;
    this.dragEndCol = -1;
  }

  private emptyForm(): StayForm {
    return {
      id: '',
      guestName: '',
      phone: '',
      email: '',
      flatId: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      totalAmount: 0,
      paidAmount: 0,
      notes: ''
    };
  }
}
