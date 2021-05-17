import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService, Post } from '../post.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
  formGroup: FormGroup;
  titleAlert = 'This field is required';
  imgBase64 = '';
  post: Post;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      inp_title: [null, Validators.required],
      inp_location: [null, Validators.required],
      uploadFile: [null, Validators.required]
    });
  }

  uploadFileEvt(imgFile: any): void {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: File) => {
        this.fileAttr += file.name + ' - ';
      });

      // HTML5 FileReader API
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.imgBase64 = imgBase64Path.substr(imgBase64Path.indexOf(',') + 1);
          console.log('imgBase64Path', imgBase64Path);
          console.log('imgBase64', this.imgBase64);
        };
        this.formGroup.patchValue({ uploadFile: reader.result });
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  get uploadFile(): FormControl {
    return this.formGroup.get('uploadFile') as FormControl;
  }

  get inp_title(): FormControl {
    return this.formGroup.get('inp_title') as FormControl;
  }

  get inp_location(): FormControl {
    return this.formGroup.get('inp_location') as FormControl;
  }

  async onSubmit(): Promise<void> {
    this.post = {
      id: 0,
      title: this.inp_title.value,
      location: this.inp_location.value,
      image: this.imgBase64
    };
    console.log('post', this.post);
    await this.postService.addPost(JSON.stringify(this.post));
    this.toastr.success('success');
    this.formGroup.reset();
  }
}
