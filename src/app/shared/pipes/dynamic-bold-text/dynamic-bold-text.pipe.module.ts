import { NgModule } from "@angular/core";
import { DynamicBoldTextPipe } from "./dynamic-bold-text.pipe";

@NgModule({
  declarations: [
    DynamicBoldTextPipe
  ],
  exports: [
    DynamicBoldTextPipe
  ]
})
export class DynamicBoldTextPipeModule { }
