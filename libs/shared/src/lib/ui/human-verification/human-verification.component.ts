// libs/shared/src/lib/ui/human-verification/human-verification.component.ts
import { Component, OnInit, inject, output, signal } from '@angular/core';
import { ApiClientService } from '../../api/api-client.service';
import { IconComponent, IconName } from '../icon/icon.component';

const DECOY_ICONS: IconName[] = ['phone-new', 'battery', 'screen', 'charging-port', 'accessories', 'mail', 'phone-call', 'clock', 'water-damage', 'map-pin'];

@Component({
  selector: 'app-human-verification',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './human-verification.component.html',
  styleUrl: './human-verification.component.scss',
})
export class HumanVerificationComponent implements OnInit {
  private readonly api = inject(ApiClientService);
  readonly verified = output<string | null>();

  protected readonly icons = signal<IconName[]>([]);
  protected readonly starIndex = signal(-1);
  protected readonly challengeId = signal<string | null>(null);
  protected readonly status = signal<'pending' | 'checking' | 'success' | 'failed'>('pending');

  ngOnInit(): void {
    this.loadChallenge();
  }

  protected loadChallenge(): void {
    this.status.set('pending');
    this.verified.emit(null);
    this.api.post<{ challengeId: string; iconCount: number; correctIndex: number }>('/verification/challenge', undefined).subscribe((res) => {
      this.challengeId.set(res.challengeId);
      this.starIndex.set(res.correctIndex);
      const shuffled = [...DECOY_ICONS].sort(() => Math.random() - 0.5).slice(0, res.iconCount - 1);
      shuffled.splice(res.correctIndex, 0, 'star');
      this.icons.set(shuffled);
    });
  }

  protected select(index: number): void {
    const id = this.challengeId();
    if (!id || this.status() === 'checking' || this.status() === 'success') return;

    this.status.set('checking');
    this.api.post<{ success: boolean }>('/verification/verify', { challengeId: id, selectedIndex: index }).subscribe((res) => {
      if (res.success) {
        this.status.set('success');
        this.verified.emit(id);
      } else {
        this.status.set('failed');
        setTimeout(() => this.loadChallenge(), 800);
      }
    });
  }
}