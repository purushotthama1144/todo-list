import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss']
})
export class CreateTodoComponent {

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

  createData() {
    console.log(this.createTaskForm.value)
  }
}
