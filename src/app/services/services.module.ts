import { NgModule } from '@angular/core';
import { UserService, TodoService } from './index';
@NgModule({
  providers:[ UserService, TodoService ]
})
export class ServicesModule { }
