import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1 page-header !py-4">
      <h3 class="ov-page-title">{{ title }}</h3>
      <p class="ov-page-sub">{{ subtitle }}</p>
    </div>
  `,
})
export class SettingsPlaceholderComponent implements OnInit {
  title = 'Settings';
  subtitle = 'This settings page will be available soon.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.title = (data['title'] as string) || this.title;
    this.subtitle = (data['subtitle'] as string) || this.subtitle;
  }
}
