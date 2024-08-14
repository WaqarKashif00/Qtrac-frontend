import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends AbstractComponent {
  Images = [
    {
      Url: 'https://www.w3schools.com/tags/movie.mp4',
      type: 'Video',
    },
    {
      Url: 'https://i.ytimg.com/vi/eLgxBaiwuA8/maxresdefault.jpg',
      type: 'Image',
    },
    {
      Url: 'https://www.tutorialrepublic.com/examples/video/shuttle.mp4',
      type: 'Video',
    },
    {
      Url:
        'https://i.pinimg.com/originals/6f/a1/81/6fa1815c4e818e0e4f773891f026444f.jpg',
      type: 'Image',
    },
    {
      Url:
        'https://i.pinimg.com/originals/ce/5f/53/ce5f53437e291c48705428721406985c.jpg',
      type: 'Image',
    },
    {
      Url:
        'https://d23.com/app/uploads/2019/06/1600w-1000h_060719_wyng-quiz-donald-duck-1.jpg',
      type: 'Image',
    },
  ];


  ItemHeight = 350;
  ItemWidth = 650;
  TestFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  Init() {
    this.TestFormGroup = this.fb.group({
      height: [''],
      width: ['']
    });
  }

  Destroy() { }

  OnSubmit(){
    this.ItemHeight = this.TestFormGroup.get('height').value;
    this.ItemWidth =  this.TestFormGroup.get('width').value;
  }
}
