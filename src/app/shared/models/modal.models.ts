import { InjectionToken } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');

export interface ModalConfig<T = any> {
  title?: string;
  icon?: string;
  data?: T;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disableClose?: boolean;
}

export class ModalRef<R = any> {
  constructor(private dialogRef: MatDialogRef<any>) {}

  close(result?: R): void {
    this.dialogRef.close(result);
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  afterClosed(): Observable<R | undefined> {
    return this.dialogRef.afterClosed();
  }
}
