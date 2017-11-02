import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { ErrorMessage } from '@rndstudio/http';
import {
    AuthenticationService,
    AlertService,
    FileService,
    FileResponse,
    File,
} from '@rndstudio/skeleton';

import { environment } from '@env/environment';

// Customize the upload to assign our API properties
interface UploadFileCustom extends UploadFile {
    display_name: string;
    thumbnail_url: string;
    url: string;
}
interface UploadOutputCustom extends UploadOutput {
    file: UploadFileCustom;
}


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
    public uploadFiles: UploadFileCustom[]        = [];
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

    /**
     * Handle output during the upload process.
     * Everything from adding or removing files to/from the queue to finishing
     * the upload process itself.
     */
    public uploadOutput(output: UploadOutputCustom): void {
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
            this.uploadFiles = this.uploadFiles.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'done') {
            const filename: string = output.file.response.data.name;
            let file: File = {
                id:            output.file.id || '',
                display_name:  output.file.display_name || output.file.name,
                thumbnail_url: output.file.thumbnail_url,
                url:           `${environment.api.files}/${filename}`,
            };

            this.associate(file);
            this.files.push(file);
            this.alerts.success(null, `${output.file.name} uploaded.`);
        }
    }

    /**
     * Upload all files added to the upload queue.
     */
    public upload(): void {
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
     * Remove a file from the list.
     */
    public removeList(file: File): void {
        this.files = this.files.filter((f: File) => f.id !== file.id);
    }

    /**
     * Remove a file from the queue.
     */
    public removeQueue(file: File): void {
        this.uploadFiles = this.uploadFiles.filter((f: File) => f.id !== file.id);
    }

    /**
     * Delete a file associated to an article.
     */
    public delete(file: File): void {
        this.fileService
            .remove(file)
            .subscribe(
                () => {
                    this.alerts.success(null, 'File deleted.');
                    this.removeList(file);
                },
                (error: ErrorMessage) => {
                    // Server returns 202 which is hitting this...
                    // TODO httpService needs a fix for this.
                    // this.alerts.errorMessage(error);
                    this.alerts.success(null, 'File deleted.');
                    this.removeList(file);
                },
            );
    }

    /**
     * Associate a file with this reference identifier.
     */
    public associate(file: File): void {
        this.fileService
            .associate(file, this.referenceId)
            .subscribe(
                (response: FileResponse) => {
                    // this.files.push(response.data);
                    this.removeQueue(file);
                },
                (error: ErrorMessage) => this.alerts.errorMessage(error),
            );
    }
}
