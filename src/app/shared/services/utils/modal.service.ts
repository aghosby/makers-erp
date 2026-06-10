import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalContainerComponent } from '../../components/modal/modal-container.component';
import { ModalConfig, ModalRef } from '../../models/modal.models';

const SIZE_MAP: Record<string, string> = {
  sm: '420px',
  md: '560px',
  lg: '760px',
  xl: '960px',
};

@Injectable({ providedIn: 'root' })
export class ModalService {

  constructor(private matDialog: MatDialog) {}

  open<T, R = any>(component: Type<T>, config: ModalConfig = {}): ModalRef<R> {
    const dialogRef = this.matDialog.open(ModalContainerComponent, {
      width: config.size ? SIZE_MAP[config.size] : SIZE_MAP['md'],
      maxWidth: '95vw',
      disableClose: config.disableClose ?? false,
      data: {
        component,
        title: config.title ?? '',
        icon: config.icon ?? '',
        data: config.data,
      },
    });

    return new ModalRef<R>(dialogRef);
  }
}
