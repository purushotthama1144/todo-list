import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss']
})
export class CreateTodoComponent {
  id:any;

  createTaskForm = new FormGroup({
    taskName: new FormControl('', Validators.required),
    taskType: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endDate: new FormControl('' , Validators.required),
    endTime: new FormControl('' , Validators.required),
    taskPriority: new FormControl('' , Validators.required),
    describeTask: new FormControl('' , Validators.required),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any) {
    console.log(data)
    this.id = data?.id
    console.log(this.id)
  }

  createData() {
    console.log(this.createTaskForm.value)
  }
}
