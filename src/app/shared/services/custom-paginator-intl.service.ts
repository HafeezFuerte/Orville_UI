import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
    constructor(protected translate: TranslateService) {
        super();
        this.translate.onLangChange.subscribe(() => this.getAndInitTranslations());
        this.getAndInitTranslations();
    }

    getAndInitTranslations() {
        this.itemsPerPageLabel = this.localizeDigits(this.translate.instant('web.common.lblItemsPerPage'));
        this.nextPageLabel = this.localizeDigits(this.translate.instant('web.common.lblNextPage'));
        this.previousPageLabel = this.localizeDigits(this.translate.instant('web.common.lblPreviousPage'));
        this.firstPageLabel = this.localizeDigits(this.translate.instant('web.common.lblFirstPage'));
        this.lastPageLabel = this.localizeDigits(this.translate.instant('web.common.lblLastPage'));
        this.changes.next();
    }

    override getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return this.localizeDigits(`0 ${this.translate.instant('web.common.lblOf')} ${length}`);
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        const range = `${startIndex + 1} - ${endIndex} ${this.translate.instant('web.common.lblOf')} ${length}`;
        return this.localizeDigits(range);
    };

    private localizeDigits(text: string): string {
        // Check if language is Arabic (case-insensitive check)
        if (this.translate.currentLang?.toUpperCase() === 'AR') {
            const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return text.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)]);
        }
        return text;
    }
}
