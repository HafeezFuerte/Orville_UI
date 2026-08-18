import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounting-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounting-placeholder.component.html'
})
export class AccountingPlaceholderComponent implements OnInit {
  title = 'Accounting';
  subtitle = 'This section will be available soon.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.title = data['title'] || this.title;
    this.subtitle = data['subtitle'] || this.subtitle;
  }
}
