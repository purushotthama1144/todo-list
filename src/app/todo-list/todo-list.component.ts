import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  displayedColumns: string[] = ['name', 'typeAssigned', 'team', 'start', 'end', 'progress'];
  displayedSubColumns: string[] = ['name', 'typeAssigned', 'team', 'start', 'end', 'progress'];
  dataSource = [
    {
      name: 'Task 1',
      typeAssigned: 'Type A',
      team: 'Team 1',
      start: '2023-09-10',
      end: '2023-09-20',
      progress: 30,
      subtasks: [
        { name: 'Subtask 1', typeAssigned: 'Sub Type A', team: 'Sub Team 1', start: '2023-09-10', end: '2023-09-20', progress: 30 },
        { name: 'Subtask 2', typeAssigned: 'Sub Type B', team: 'Sub Team 2', start: '2023-09-10', end: '2023-09-20', progress: 30 },
      ]
    },
    {
      name: 'Task 1',
      typeAssigned: 'Type A',
      team: 'Team 1',
      start: '2023-09-10',
      end: '2023-09-20',
      progress: 30,
      subtasks: [
        {
          name: 'Subtask 1', typeAssigned: 'Sub Type A', team: 'Sub Team 1', start: '2023-09-10', end: '2023-09-20', progress: 30,
          subtasksSub: [
            { name: 'Subtask Sub 1', typeAssigned: 'Sub Type A', team: 'Sub Team 1', start: '2023-09-10', end: '2023-09-20', progress: 30 },
            { name: 'Subtask Sub 2', typeAssigned: 'Sub Type B', team: 'Sub Team 2', start: '2023-09-10', end: '2023-09-20', progress: 30 },
          ]
        },
        { name: 'Subtask 2', typeAssigned: 'Sub Type B', team: 'Sub Team 2', start: '2023-09-10', end: '2023-09-20', progress: 30 },
      ]
    },
  ];

  subtasks = this.dataSource.map(task => task.subtasks).flat();

  addNewRow() {
    console.log(this.subtasks)
    const newRow = {
      name: 'New Task',
      typeAssigned: 'Type X',
      team: 'Team Y',
      start: '2023-09-30',
      end: '2023-10-10',
      progress: 0,
      subtasks: [],
    };

    this.dataSource.push(newRow);
  }

  addSubTask(task: any) {
    const newSubTask = {
      name: 'New Subtask',
      typeAssigned: 'Type X',
      team: 'Team Y',
      start: '2023-09-30',
      end: '2023-10-10',
      progress: 0,
    };

    task.subtasks.push(newSubTask);
  }

  addSecondSubTask(subtask: any) {
    const newSubTask = {
      name: 'New Subtask',
      typeAssigned: 'Type X',
      team: 'Team Y',
      start: '2023-09-30',
      end: '2023-10-10',
      progress: 0,
    };

    subtask.subtasksSub.push(newSubTask);
  }
}
