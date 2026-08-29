import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_WORK_ORDER_SETTINGS,
  WORK_ORDER_OPTIONS,
  WORK_ORDER_USERS,
  WorkOrderOptionDef,
  WorkOrderSettingsModel,
  WorkOrderUserOption,
} from './work-order-settings.data';

@Component({
  selector: 'app-work-order-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-order-settings.component.html',
  styleUrl: './work-order-settings.component.scss',
})
export class WorkOrderSettingsComponent {
  readonly users: WorkOrderUserOption[] = WORK_ORDER_USERS;
  readonly options: WorkOrderOptionDef[] = WORK_ORDER_OPTIONS;

  model: WorkOrderSettingsModel = {
    ...DEFAULT_WORK_ORDER_SETTINGS,
    participantIds: [],
  };

  draftParticipantId = '';
  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  get availableUsers(): WorkOrderUserOption[] {
    return this.users.filter((u) => !this.model.participantIds.includes(u.id));
  }

  userName(id: string): string {
    return this.users.find((u) => u.id === id)?.name ?? id;
  }

  addParticipant(): void {
    const id = this.draftParticipantId;
    if (!id || this.model.participantIds.includes(id)) {
      return;
    }
    this.model.participantIds = [...this.model.participantIds, id];
    this.draftParticipantId = '';
  }

  removeParticipant(id: string): void {
    this.model.participantIds = this.model.participantIds.filter((x) => x !== id);
  }

  getOption(key: WorkOrderOptionDef['key']): boolean {
    return !!this.model[key];
  }

  setOption(key: WorkOrderOptionDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  save(): void {
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
