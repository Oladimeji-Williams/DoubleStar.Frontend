// libs/shared/src/lib/ui/avatar/avatar.component.ts
import { Component, signal } from '@angular/core';
import { input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly avatarUrl = input<string | null>(null);
  readonly size = input<number>(32);

  protected readonly loadError = signal(false);

  protected onError(): void {
    this.loadError.set(true);
  }
}