import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-health-card',
  standalone: true,
  templateUrl: './dashboard-health-card.component.html',
  styleUrl: './dashboard-health-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHealthCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<'good' | 'warning' | 'danger'>('good');
}