import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { Countries } from 'src/app/core/constants/country-list';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss']
})
export class VendorInfoComponent implements OnInit {

  vendorForm!: FormGroup;
  apiLoading = false;

  imgFile: File | null = null;
  imgPic: string | SafeUrl | null = null;
  imgUploadError = '';

  readonly countryOptions = Countries.map((c: any) => c.label);

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    const d = this.data.isExisting ? this.data.modalInfo : {};

    this.vendorForm = this.fb.group({
      vendorName:        [d.vendorName        ?? '', Validators.required],
      contactPersonName: [d.contactPersonName ?? '', Validators.required],
      email:             [d.email             ?? '', [Validators.required, Validators.email]],
      phone:             [d.phone             ?? ''],
      street:            [d.address?.street   ?? ''],
      city:              [d.address?.city     ?? ''],
      state:             [d.address?.state    ?? ''],
      country:           [d.address?.country  ?? ''],
      zipCode:           [d.address?.zipCode  ?? ''],
    });

    if (d.imageUrl) this.imgPic = d.imageUrl;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 1000000) {
      this.imgUploadError = 'Image must be under 1 MB';
      return;
    }
    this.imgFile = file;
    this.imgUploadError = '';
    this.imgPic = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  removeLogo(): void {
    this.imgFile = null;
    this.imgPic = null;
  }

  onSubmit(): void {
    if (!this.vendorForm.valid) {
      this.notifyService.showError('Please fill in all required fields');
      return;
    }
    this.apiLoading = true;

    const v = this.vendorForm.value;
    const formData = new FormData();
    if (this.imgFile) formData.append('logo', this.imgFile);
    formData.append('vendorName',        v.vendorName);
    formData.append('contactPersonName', v.contactPersonName);
    formData.append('email',             v.email);
    formData.append('phone',             v.phone ?? '');
    formData.append('address', JSON.stringify({
      street: v.street, city: v.city, state: v.state,
      country: v.country, zipCode: v.zipCode,
    }));

    const request$ = this.data.isExisting
      ? this.ordersService.updateSupplier(this.data.id, formData)
      : this.ordersService.createSupplier(formData);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          this.notifyService.showSuccess(
            this.data.isExisting ? 'Vendor updated successfully' : 'Vendor created successfully'
          );
          this.apiLoading = false;
          this.modalRef.dismiss();
        }
      },
      error: err => {
        this.apiLoading = false;
        this.notifyService.showError(err.error?.error ?? 'Something went wrong');
      }
    });
  }

  dismiss(): void {
    this.modalRef.dismiss();
  }
}
