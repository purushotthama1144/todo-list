import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { TodoServiceService } from '../todo-service.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss']
})
export class CreateTodoComponent implements OnInit{
  id:any;

  taskTypes: any;

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

  constructor(private todoService: TodoServiceService,
    @Inject(MAT_DIALOG_DATA) public data?: any) {
    console.log(data)
    this.id = data?.id
    console.log("ID" , this.id)
  }

  ngOnInit(): void {
    this.getTaskType()
  }
 
  getTaskType() {

    // Pass tenant and branch dynamically
    const payload = {
      tenant: 1,
      branch: 1
    }

    this.todoService.getTaskTypeAPI(payload).subscribe((data:any) => {
      this.taskTypes = data.results
    })
  }

  createData() {
    let formattedStartDate = moment(this.createTaskForm.value.startDate).format('YYYY-MM-DD');
    let formattedEndDate = moment(this.createTaskForm.value.endDate).format('YYYY-MM-DD');
    let startDateTime = `${formattedStartDate} ${this.createTaskForm.value.startTime}`
    let endDateTime = `${formattedEndDate} ${this.createTaskForm.value.endTime}`

    if(this.id == undefined) {
      this.id = 0;
    } else {
      this.id = this.id;
    }

    const payload = {
      'parent_id': this.id,
      'task_type': this.createTaskForm.value.taskType,
      'task_note':this.createTaskForm.value.taskName,
      'priority':this.createTaskForm.value.taskPriority,
      'description':this.createTaskForm.value.describeTask,
      'start_date': startDateTime,
      'due_date': endDateTime,
      'task_status': 0,
      'created_by': 1,
      'organization': 1,
      'branch': 1,
      'todo_image':"",
    }

    this.todoService.createListAPI(payload).subscribe((data:any) => {
      console.log(data)
    })
  }
}
