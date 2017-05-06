import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { ErrorMessage } from '@freescan/http';
import {
    AuthenticationService,
    AlertService,
    FileService,
    FileResponse,
    File,
} from '@freescan/skeleton';

import { environment } from '@env/environment';


@Component({
    selector:      'pstudio-files',
    templateUrl:   './files.component.html',
    styleUrls:     ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FilesComponent implements OnInit {
    @Input() public referenceId: string;
    public files: File[]    = [];
    public loading: boolean = true;
    public saving: boolean  = false;

    // Uploader
    public uploadFiles: UploadFile[]              = [];
    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
    public humanizeBytes: Function                = humanizeBytes;

    constructor(private authentication: AuthenticationService,
                private alerts: AlertService,
                private fileService: FileService) {
    }

    public ngOnInit(): void {
        this.loadFiles();
    }

    /**
     * Request the files for this article.
     */
    public loadFiles(): void {
        if (!this.referenceId) {
            return;
        }

        this.fileService
            .for(this.referenceId)
            .subscribe(
                (files: File[]) => this.files = files,
                (error: string) => {
                },
            );
    }

    public onUploadOutput(output: UploadOutput): void {
        console.log(output);

        if (output.type === 'allAddedToQueue') {
            // All added to queue
        } else if (output.type === 'addedToQueue') {
            this.uploadFiles.push(output.file);
        } else if (output.type === 'uploading') {
            // update current data in files array for uploading file
            const index: number = this.uploadFiles.findIndex((file: UploadFile) => {
                return file.id === output.file.id;
            });

            this.uploadFiles[index] = output.file;
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.uploadFiles = this.uploadFiles.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'done') {
            const filename: string = output.file.response.data.name;
            let file: File = {
                display_name: 'test',
                url: `${environment.api.files}/${filename}`,
            };

            this.associate(file);
            this.alerts.success(null, `${output.file.name} uploaded.`);
        }
    }

    public startUpload(): void {
        const event: UploadInput = {
            type:        'uploadAll',
            url:         environment.api.files,
            method:      'POST',
            headers:     { 'Authorization': `Bearer ${this.authentication.token()}` },
            concurrency: 1,
        };

        this.uploadInput.emit(event);
    }

    /**
     * Associate a file with this reference identifier.
     */
    public associate(file: File): void {
        this.fileService
            .associate(file, this.referenceId)
            .subscribe(
                (response: FileResponse) => this.files.push(file),
                (error: ErrorMessage) => this.alerts.errorMessage(error),
            );
    }
}
