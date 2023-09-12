import { Component, OnInit } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { CreateTodoComponent } from './create-todo/create-todo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(public dialog: MatDialog,) {}

  ngOnInit(): void {
    // this.openModal()
  }
  
  openModal() {
  
    this.dialog.open(CreateTodoComponent, {
      disableClose: true,
      width: '70%',
      autoFocus: false, 
      restoreFocus: false,

    
    });
  }
}
