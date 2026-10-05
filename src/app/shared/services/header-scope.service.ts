import { Injectable } from '@angular/core';

/** Branch / building picker state shared by the header selects and the mobile menu drawer. */
@Injectable({ providedIn: 'root' })
export class HeaderScopeService {
  branches: string[] = ['Main Branch', 'Downtown Branch', 'Dubai Marina Branch', 'Business Bay Branch'];
  buildings: any[] = [];
  selectedBranch: string | null = null;
  selectedBuilding: string | null = null;
}
