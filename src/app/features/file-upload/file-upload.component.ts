import { Component, ElementRef, HostListener, ChangeDetectorRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { image } from '@progress/kendo-svg-icons';
import { FormService } from 'src/app/core/services/form.service';
import { SupportedImageFileSize } from 'src/app/models/constants/valid-file-types-and-sizes.constant';

@Component({
    selector: 'lavi-file-upload',
    templateUrl: './file-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileUploadComponent,
            multi: true
        }
    ],
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {

    @Input() ImageSrc: string | ArrayBuffer;
    @Input() Index = 0;
    @Input() ImageTitle: string;
    @Input() IfRoundedImage = false;
    @Input() ImageWidth = 200;
    @Input() ImageHeight = 200;
    @Input() IsDisabled = false;
    @Input() FileUploadId = 'file-input';
    @Output() FileUrl = new EventEmitter<string | ArrayBuffer>();

    public file: File | null = null;
    onChange: any;
    ImageUrl: string | ArrayBuffer;

    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        this.file = event && event.item(0);
        this.onChange(this.file);
        this.ImageSrc = this.ImageSrc ?  this.ImageSrc : '../../../assets/defaultImage.png' ;
        if (event.item(0) && this.formService.IsValidImageFile(event.item(0))){
            const reader = new FileReader();
            reader.readAsDataURL(event.item(0));
            reader.onload = () => {
                this.ImageSrc = reader.result;
                this.FileUrl.emit(this.ImageSrc);
                this.ref.detectChanges();
              
            };
        }
    }
    

    constructor(private host: ElementRef<HTMLInputElement>, private ref: ChangeDetectorRef, private formService: FormService) {
    }

    ngOnInit() {
        this.ImageUrl = this.ImageSrc;
    }

    writeValue(value: null) {
        // clear file input
        this.host.nativeElement.value = '';
        this.file = null;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
    }
}
