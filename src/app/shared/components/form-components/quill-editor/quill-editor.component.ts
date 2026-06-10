import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import hljs from 'highlight.js';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true
    }
  ]
})
export class QuillEditorComponent implements OnInit, ControlValueAccessor {

  @Input() minHeight: string = 'auto';
  @Input() placeholder: string = 'Insert text here...';
  @Input() quillToolbar: any = [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    ['link', 'image', 'video']
  ];

  content: string = '';
  disabled = false;
  modules: any = {};

  private onChange = (_: string) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.modules = {
      syntax: { highlight: (text: string) => hljs.highlightAuto(text).value },
      toolbar: this.quillToolbar
    };
  }

  writeValue(value: string): void {
    this.content = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onContentChanged(event: any): void {
    this.onChange(event.html ?? '');
    this.onTouched();
  }
}
