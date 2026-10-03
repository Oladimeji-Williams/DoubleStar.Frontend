// libs/staff/src/lib/staff-list-page/staff-list-page.component.ts — full replacement
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiException, ConfirmService, CurrentUserStore, ToastService } from '@doublestar/shared';
import { StaffApiService } from '../staff-api.service';
import { StaffMember } from '../models/staff.model';

type StaffRole = 'Admin' | 'Manager' | 'Cashier' | 'Technician';

@Component({
  selector: 'app-staff-list-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './staff-list-page.component.html',
  styleUrl: './staff-list-page.component.scss',
})
export class StaffListPageComponent implements OnInit {
  private readonly staffApi = inject(StaffApiService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  protected readonly currentUserId = computed(() => this.currentUserStore.currentUser()?.userId ?? null);

  protected readonly staff = signal<StaffMember[]>([]);
  protected readonly isLoading = signal(true);

  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly role = signal<StaffRole>('Cashier');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isCreating = signal(false);

  protected readonly expandedStaffId = signal<string | null>(null);
  protected readonly editFirstName = signal('');
  protected readonly editLastName = signal('');
  protected readonly editRole = signal<StaffRole>('Cashier');
  protected readonly isSaving = signal(false);
  protected readonly editError = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.staffApi.getAll().subscribe({
      next: (staff) => { this.staff.set(staff); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  protected readonly canCreate = () =>
    this.firstName().trim() && this.lastName().trim() && this.email().trim() && this.password().length >= 12;

  protected createStaff(): void {
    if (!this.canCreate()) return;
    this.isCreating.set(true);
    this.errorMessage.set(null);

    this.staffApi
      .create({ firstName: this.firstName(), lastName: this.lastName(), email: this.email(), password: this.password(), role: this.role() })
      .subscribe({
        next: () => {
          this.isCreating.set(false);
          this.toastService.success(`${this.firstName()} ${this.lastName()} added as ${this.role()}.`);
          this.firstName.set(''); this.lastName.set(''); this.email.set(''); this.password.set('');
          this.load();
        },
        error: (error: unknown) => { this.isCreating.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }

  protected toggleExpand(member: StaffMember): void {
    if (member.id === this.currentUserId()) return; // no self-editing here — see /profile instead

    if (this.expandedStaffId() === member.id) {
      this.expandedStaffId.set(null);
      return;
    }

    this.expandedStaffId.set(member.id);
    this.editFirstName.set(member.firstName);
    this.editLastName.set(member.lastName);
    this.editRole.set((member.roles.find((r) => r !== 'Customer') as StaffRole) ?? 'Cashier');
    this.editError.set(null);
  }

  protected saveEdit(member: StaffMember): void {
    if (!this.editFirstName().trim() || !this.editLastName().trim()) return;

    this.isSaving.set(true);
    this.editError.set(null);

    this.staffApi
      .update(member.id, { firstName: this.editFirstName(), lastName: this.editLastName(), role: this.editRole() })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Staff member updated.');
          this.expandedStaffId.set(null);
          this.load();
        },
        error: (error: unknown) => { this.isSaving.set(false); this.editError.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }

  protected async deactivate(member: StaffMember): Promise<void> {
    const confirmed = await this.confirmService.confirm(`Deactivate ${member.firstName} ${member.lastName}? They'll immediately lose access.`, 'Deactivate');
    if (!confirmed) return;

    this.staffApi.deactivate(member.id).subscribe(() => {
      this.toastService.success(`${member.firstName} deactivated.`);
      this.load();
    });
  }

  protected reactivate(member: StaffMember): void {
    this.staffApi.reactivate(member.id).subscribe(() => {
      this.toastService.success(`${member.firstName} reactivated.`);
      this.load();
    });
  }
}