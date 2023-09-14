import { Component, Inject, OnInit } from '@angular/core';
import { TodoServiceService } from '../todo-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss']
})
export class EditTodoComponent implements OnInit {

  taskTypes: any;
  startTimeConversion: any;
  endTimeConversion: any;
  
  list = [
    {"name": "Highest", id: "3" , checked: false},
    {"name": "Medium", id: "2" , checked: false},
    {"name": "Lowest", id: "1" , checked: false}
  ]
  
  updateTaskForm = new FormGroup({
    taskName: new FormControl('', Validators.required),
    taskType: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endDate: new FormControl('' , Validators.required),
    endTime: new FormControl('' , Validators.required),
    taskPriority: new FormControl('' , Validators.required),
    describeTask: new FormControl('' , Validators.required),
  });

  constructor(private todoService: TodoServiceService,  @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit(): void {
    this.getTaskType();
    
    console.log(this.data)
    this.startTimeConversion = moment(new Date(this.data.start_date)).format("hh:mm a");
    this.endTimeConversion = moment(new Date(this.data.due_date)).format("hh:mm a");
    
    if(this.data.priority == "Lowest") {
      this.list[2].checked = true;
    }
    if(this.data.priority == "Medium") {
      this.list[1].checked = true;
    }
    if(this.data.priority == "Highest") {
      this.list[0].checked = true;
    }

    this.updateTaskForm.patchValue({
      taskName: this.data.task_note,
      taskType: this.data.task_type,
      startDate: this.data.start_date,
      startTime: this.startTimeConversion,
      endDate: this.data.start_date,
      endTime: this.endTimeConversion,
      taskPriority:this.data.priority,
      describeTask:this.data.description
    })
  }

  getTaskType() {
    const payload = {
      tenant: 1,
      branch: 1
    }

    this.todoService.getTaskTypeAPI(payload).subscribe((data:any) => {
      this.taskTypes = data.results
    })
  }

  updateTsak() {
    let formattedStartDate = moment(this.updateTaskForm.value.startDate).format('YYYY-MM-DD');
    let formattedEndDate = moment(this.updateTaskForm.value.endDate).format('YYYY-MM-DD');
    let startDateTime = `${formattedStartDate} ${this.updateTaskForm.value.startTime}`
    let endDateTime = `${formattedEndDate} ${this.updateTaskForm.value.endTime}`
    let updatePriority:number = 0;

    if(this.updateTaskForm.value.taskPriority == "Lowest") {
      updatePriority = 1
    }
    if(this.updateTaskForm.value.taskPriority == "Medium") {
      updatePriority = 2
    }
    if(this.updateTaskForm.value.taskPriority == "highest") {
      updatePriority = 3
    }

    // put , delete post
    const payload = {
      'task_id': this.data.id,
      'task_type': this.updateTaskForm.value.taskType,
      'task_note': this.updateTaskForm.value.taskName,
      'priority': updatePriority,
      'description': this.updateTaskForm.value.describeTask,
      'start_date': startDateTime,
      'due_date': endDateTime,
      'task_status': 0,
      'created_by': 1,
      'organization': 1,
      'branch': 1,
      'todo_image':"",
    }

    this.todoService.updateListAPI(payload).subscribe((data:any) => {
      console.log(data)
    })
  }
}
