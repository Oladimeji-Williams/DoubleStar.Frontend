import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-kpi-card',
  standalone: true,
  templateUrl: './dashboard-kpi-card.component.html',
  styleUrl: './dashboard-kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardKpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<string>('•');
  readonly tone = input<'default' | 'success' | 'warning' | 'danger'>(
    'default',
  );
}