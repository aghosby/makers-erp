import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MODAL_DATA, ModalRef } from '../../models/modal.models';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements AfterViewInit {

  @ViewChild('outlet', { read: ViewContainerRef }) outlet: ViewContainerRef;

  title: string;
  icon: string;
  private contentComponent: Type<any>;
  private contentData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: { component: Type<any>; title: string; icon: string; data: any },
    private dialogRef: MatDialogRef<ModalContainerComponent>,
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
  ) {
    this.title = dialogData.title;
    this.icon = dialogData.icon;
    this.contentComponent = dialogData.component;
    this.contentData = dialogData.data;
  }

  ngAfterViewInit(): void {
    const childInjector = Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: this.contentData },
        { provide: ModalRef, useValue: new ModalRef(this.dialogRef) },
      ],
      parent: this.injector,
    });

    this.outlet.createComponent(this.contentComponent, { injector: childInjector });
    this.cdRef.detectChanges();
  }

  close(): void {
    this.dialogRef.close();
  }
}
