import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Schema, MarkSpec } from 'prosemirror-model';
import { marks, nodes } from 'ngx-editor/schema';
import { CmsService } from './cms.service';
import {
  CmsItem,
  CMS_PAGE_DEFINITIONS,
  DEFAULT_CMS_ITEMS,
  SETTINGS_FIELD_GROUPS,
  WebSettingGroup,
} from './cms.data';

/**
 * Custom MarkSpec for Font Size.
 * Parses style="font-size: ..." and renders <span style="font-size: ...;">
 */
const fontSizeMark: MarkSpec = {
  attrs: {
    fontSize: { default: null },
  },
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: (value: any) => ({ fontSize: value }),
    },
  ],
  toDOM(mark: any) {
    const { fontSize } = mark.attrs;
    return ['span', { style: `font-size:${fontSize};` }, 0];
  },
};

/**
 * Custom MarkSpec for Font Family.
 * Parses style="font-family: ..." and renders <span style="font-family: ...;">
 */
const fontFamilyMark: MarkSpec = {
  attrs: {
    fontFamily: { default: null },
  },
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: (value: any) => ({ fontFamily: value }),
    },
  ],
  toDOM(mark: any) {
    const { fontFamily } = mark.attrs;
    return ['span', { style: `font-family:${fontFamily};` }, 0];
  },
};

/**
 * Extended ProseMirror Schema containing font_size and font_family marks.
 */
export const customEditorSchema = new Schema({
  nodes,
  marks: {
    ...marks,
    font_size: fontSizeMark,
    font_family: fontFamilyMark,
  },
});

@Component({
  selector: 'app-cms-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxEditorModule, TranslateModule],
  templateUrl: './cms-settings.component.html',
  styleUrls: ['./cms-settings.component.scss'],
})
export class CmsSettingsComponent implements OnInit, OnDestroy {
  private cmsService = inject(CmsService);
  private toastr = inject(ToastrService);
  private editorSub: Subscription | null = null;

  // Active top-level tab: 'pages' (CMS Content) or 'settings' (Web Settings)
  public activeTab: 'pages' | 'settings' = 'pages';

  // CMS Pages Tab State
  public pageDefinitions = CMS_PAGE_DEFINITIONS;
  public cmsPages: CmsItem[] = [...DEFAULT_CMS_ITEMS];
  public selectedPageType = 'privacy_policy';
  public selectedLanguage = 'en';
  public currentContent = '';
  public currentCode = 'CBCFB07B';
  public isCmsLoading = false;
  public isSavingCms = false;
  public isPreviewMode = false;

  // Font Options
  public fontFamilies = [
    { label: 'Hanken Grotesk', value: "'Hanken Grotesk', sans-serif" },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'Courier New', value: "'Courier New', monospace" },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
  ];

  public fontSizes = [
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px (Normal)', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '36px', value: '36px' },
    { label: '48px', value: '48px' },
  ];

  public selectedFontFamily = '';
  public selectedFontSize = '';

  // NgxEditor instance
  public editor!: Editor;
  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  // Web Settings Tab State
  public fieldGroups: WebSettingGroup[] = SETTINGS_FIELD_GROUPS;
  public settingsMap: { [key: string]: string } = {};
  public isSettingsLoading = false;
  public isSavingSettings = false;
  public savingKey: string | null = null;

  ngOnInit(): void {
    this.editor = new Editor({
      schema: customEditorSchema,
    });

    // Listen to editor selection changes to reflect font size & font family in toolbar dropdowns
    this.editorSub = this.editor.update.subscribe((view) => {
      if (!view) return;
      const state = view.state;
      const { from, to, empty } = state.selection;

      if (empty) {
        const marks = state.storedMarks || state.selection.$from.marks();
        const sizeMark = marks.find((m: any) => m.type.name === 'font_size');
        this.selectedFontSize = sizeMark?.attrs?.['fontSize'] || '';

        const familyMark = marks.find((m: any) => m.type.name === 'font_family');
        this.selectedFontFamily = familyMark?.attrs?.['fontFamily'] || '';
      } else {
        const sizeMarkType = state.schema.marks['font_size'];
        const familyMarkType = state.schema.marks['font_family'];

        if (sizeMarkType && state.doc.rangeHasMark(from, to, sizeMarkType)) {
          const mark = state.selection.$from.marks().find((m: any) => m.type.name === 'font_size');
          this.selectedFontSize = mark?.attrs?.['fontSize'] || '';
        } else {
          this.selectedFontSize = '';
        }

        if (familyMarkType && state.doc.rangeHasMark(from, to, familyMarkType)) {
          const mark = state.selection.$from.marks().find((m: any) => m.type.name === 'font_family');
          this.selectedFontFamily = mark?.attrs?.['fontFamily'] || '';
        } else {
          this.selectedFontFamily = '';
        }
      }
    });

    this.loadCmsPages();
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.editorSub?.unsubscribe();
    this.editor?.destroy();
  }

  // =========================================================================
  // Font Styling Actions
  // =========================================================================

  public applyFontSize(size: string): void {
    if (!this.editor || !this.editor.view) return;
    const { state, dispatch } = this.editor.view;
    const markType = state.schema.marks['font_size'];
    if (!markType) return;

    const { from, to, empty } = state.selection;
    const tr: any = state.tr;

    if (empty) {
      const currentMarks = state.storedMarks || state.selection.$from.marks();
      const filtered = currentMarks.filter((m: any) => m.type !== markType);
      if (size) {
        filtered.push((markType as any).create({ fontSize: size }));
      }
      dispatch(tr.setStoredMarks(filtered));
    } else {
      tr.removeMark(from, to, markType);
      if (size) {
        tr.addMark(from, to, (markType as any).create({ fontSize: size }));
      }
      dispatch(tr);
    }
    this.editor.view.focus();
  }

  public applyFontFamily(family: string): void {
    if (!this.editor || !this.editor.view) return;
    const { state, dispatch } = this.editor.view;
    const markType = state.schema.marks['font_family'];
    if (!markType) return;

    const { from, to, empty } = state.selection;
    const tr: any = state.tr;

    if (empty) {
      const currentMarks = state.storedMarks || state.selection.$from.marks();
      const filtered = currentMarks.filter((m: any) => m.type !== markType);
      if (family) {
        filtered.push((markType as any).create({ fontFamily: family }));
      }
      dispatch(tr.setStoredMarks(filtered));
    } else {
      tr.removeMark(from, to, markType);
      if (family) {
        tr.addMark(from, to, (markType as any).create({ fontFamily: family }));
      }
      dispatch(tr);
    }
    this.editor.view.focus();
  }

  // =========================================================================
  // CMS Content Management Methods
  // =========================================================================

  public setTab(tab: 'pages' | 'settings'): void {
    this.activeTab = tab;
  }

  public loadCmsPages(): void {
    this.isCmsLoading = true;
    this.cmsService.getCmsByType('', this.selectedLanguage).subscribe({
      next: (res: any) => {
        this.isCmsLoading = false;
        const fetchedList =
          res?.objResult && typeof res.objResult === 'object' && Array.isArray(res.objResult.cms)
            ? res.objResult.cms
            : [];

        // Build/update pages list
        this.cmsPages = this.pageDefinitions.map((def) => {
          const found = fetchedList.find((item: any) => item.type === def.type);
          if (found) {
            return {
              type: def.type,
              display_name: found.display_name || def.displayName,
              language: found.language || this.selectedLanguage,
              str_content: found.str_content || '',
              code: found.code || def.defaultCode,
            };
          }

          // If not in fetched list (e.g. Arabic not yet saved), keep code from default so user can save
          return {
            type: def.type,
            display_name: def.displayName,
            language: this.selectedLanguage,
            str_content: '',
            code: def.defaultCode,
          };
        });

        this.syncCurrentPageContent();
      },
      error: (err: any) => {
        this.isCmsLoading = false;
        console.warn('Failed to fetch CMS from server, using local fallback:', err);
        this.syncCurrentPageContent();
      },
    });
  }

  public onSelectPage(type: string): void {
    if (this.selectedPageType === type) return;

    // Persist in-memory edits to the current page before switching
    const currentPg = this.cmsPages.find((p) => p.type === this.selectedPageType);
    if (currentPg) {
      currentPg.str_content = this.currentContent;
    }

    this.selectedPageType = type;
    this.syncCurrentPageContent();
  }

  public onLanguageChange(lang: string): void {
    if (this.selectedLanguage === lang) return;

    // Persist in-memory edits to current page before switching language
    const currentPg = this.cmsPages.find((p) => p.type === this.selectedPageType);
    if (currentPg) {
      currentPg.str_content = this.currentContent;
    }

    this.selectedLanguage = lang;
    this.loadCmsPages();
  }

  private syncCurrentPageContent(): void {
    const page = this.cmsPages.find((p) => p.type === this.selectedPageType);
    if (page) {
      this.currentContent = page.str_content || '';
      this.currentCode = page.code || '';
    } else {
      const def = this.pageDefinitions.find((d) => d.type === this.selectedPageType);
      this.currentContent = '';
      this.currentCode = def?.defaultCode || '';
    }
  }

  public togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  public saveCms(): void {
    if (!this.currentCode) {
      this.toastr.error('Page code is required to save CMS content.');
      return;
    }

    this.isSavingCms = true;
    this.cmsService
      .saveWebCms(this.currentCode, this.currentContent, this.selectedLanguage)
      .subscribe({
        next: (res: any) => {
          this.isSavingCms = false;
          if (
            res?.statusCode === '200' ||
            res?.message === 'LBL_SUCCESS' ||
            res?.message === 'success'
          ) {
            this.toastr.success('CMS content saved successfully!');
            // Update local state
            const target = this.cmsPages.find((p) => p.type === this.selectedPageType);
            if (target) {
              target.str_content = this.currentContent;
              target.language = this.selectedLanguage;
            }
          } else {
            this.toastr.warning(res?.message || 'Server returned unexpected status');
          }
        },
        error: (err: any) => {
          this.isSavingCms = false;
          console.error('Error saving CMS:', err);
          this.toastr.error('Failed to save CMS content. Please check connection.');
        },
      });
  }

  // =========================================================================
  // Web Settings Methods
  // =========================================================================

  public loadSettings(): void {
    this.isSettingsLoading = true;
    this.cmsService.getSettingsByType().subscribe({
      next: (res: any) => {
        this.isSettingsLoading = false;
        const list =
          res?.objResult && typeof res.objResult === 'object' && Array.isArray(res.objResult.settings)
            ? res.objResult.settings
            : [];
        const map: { [key: string]: string } = {};
        for (const item of list) {
          if (item.strKey) {
            map[item.strKey] = item.strValue || '';
          }
        }
        this.settingsMap = map;
      },
      error: (err: any) => {
        this.isSettingsLoading = false;
        console.warn('Failed to load web settings:', err);
      },
    });
  }

  public saveSingleSetting(key: string): void {
    const value = this.settingsMap[key] || '';
    this.savingKey = key;

    this.cmsService.saveSettingsByType(key, value).subscribe({
      next: (res: any) => {
        this.savingKey = null;
        if (res?.statusCode === '200' || res?.message === 'success') {
          this.toastr.success('Saved successfully!');
        } else {
          this.toastr.warning(res?.message || 'Could not save setting');
        }
      },
      error: (err: any) => {
        this.savingKey = null;
        console.error(`Error saving ${key}:`, err);
        this.toastr.error('Failed to save setting.');
      },
    });
  }

  public saveAllSettings(): void {
    this.isSavingSettings = true;
    const keys = Object.keys(this.settingsMap);
    let completed = 0;
    let failed = 0;

    if (keys.length === 0) {
      this.isSavingSettings = false;
      return;
    }

    for (const key of keys) {
      const val = this.settingsMap[key] || '';
      this.cmsService.saveSettingsByType(key, val).subscribe({
        next: () => {
          completed++;
          if (completed + failed === keys.length) {
            this.isSavingSettings = false;
            this.toastr.success('All settings saved successfully!');
          }
        },
        error: () => {
          failed++;
          if (completed + failed === keys.length) {
            this.isSavingSettings = false;
            if (completed > 0) {
              this.toastr.info(`Saved ${completed} settings (${failed} failed).`);
            } else {
              this.toastr.error('Failed to save settings.');
            }
          }
        },
      });
    }
  }

  public getSelectedPageDisplayName(): string {
    const found = this.pageDefinitions.find((p) => p.type === this.selectedPageType);
    return found?.displayName || 'Page';
  }
}
