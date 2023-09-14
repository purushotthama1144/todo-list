import { CollectionViewer, DataSource, SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject, Observable, Subscription, map, merge } from 'rxjs';
import { CreateTodoComponent } from '../create-todo/create-todo.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoServiceService } from '../todo-service.service';
import { EditTodoComponent } from '../edit-todo/edit-todo.component';

interface taskNode {
  id?: number;
  start_date: string,
  due_date: string,
  description: string,
  priority: string,
  task_note: string,
  task_status: number,
  task_type_name: string,
  parent_id: number,
  created_by: number,
  branch: number,
  branch_name: string,
  parent_has_child: boolean,
  created_by_user: {
    creator_name: string,
  }
}

export class DynamicFlatNode {
  constructor(
    public item: taskNode,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  children:any;
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private todoService: TodoServiceService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const sendValue = {
      parent_id: node.item.id,
      branch: 1,
      organization:1
    };
   
    this.todoService.getChildListAPI(sendValue).subscribe((nodes:any) => {

      const children = nodes['results'];
      const index = this.data.indexOf(node);
      if (!children || index < 0) {
        // If no children, or cannot find the node, no op
        return;
      }
      setTimeout(() => {
        if (expand) {
          const nodes = children.map(
            (name:any) =>
              new DynamicFlatNode(
                name,
                node.level + 1,
                true
          
              )
          );
          this.data.splice(index + 1, 0, ...nodes);
        } else {
          let count = 0;
          for (
            let i = index + 1;
            i < this.data.length && this.data[i].level > node.level;
            i++, count++
          ) {}
          this.data.splice(index + 1, count);
        }

        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      }, 100);
    });
  }
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})

export class TreeComponent  implements OnInit {
  openSectionIds: { [key: string]: boolean } = {};
  nodeSubscription: Subscription;
  topicParentSubscription: Subscription;
  topicDeleteSubscription: Subscription;
  whatMatterDeleteSubscription: Subscription;

  loggedInUser: number;
  nodesdata: Array<any>;
  count: number;
  publish_count: number;
  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  list = [
    {"name": "Highest", id: "1"},
    {"name": "Medium", id: "2"},
    {"name": "Lowest", id: "3"}
  ]

  constructor(public dialog: MatDialog , private database: TodoServiceService) {}

  ngOnInit(): void {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
    this.getTopicParentDetails();
  }

  getTopicParentDetails() {
    const payload = {
      organization: 1,
      branch:1,
    }
    this.topicParentSubscription = this.database.getParentListAPI(payload).subscribe((item:any) => {
        this.dataSource.data = item['results'].map(
          (name: taskNode) => new DynamicFlatNode(name, 0, true)
        );
        console.log(this.dataSource.data)
      });
  }

  addSubTask(node: any) {
    console.log(node)
    this.dialog.open(CreateTodoComponent, {
      disableClose: true,
      width: '70%',
      autoFocus: false, 
      restoreFocus: false,
      data:node
    });
  }

  toggleSubClasses(sectionId: string) {
    console.log(sectionId)
    this.openSectionIds[sectionId] = !this.openSectionIds[sectionId];
  }

  addMainTask() {
    this.dialog.open(CreateTodoComponent, {
      disableClose: true,
      width: '70%',
      autoFocus: false, 
      restoreFocus: false,
    });
  }

  editTask(node:any) {
    this.dialog.open(EditTodoComponent, {
      disableClose: true,
      width: '70%',
      autoFocus: false, 
      restoreFocus: false,
      data:node
    });
  }

  deleteTask(node:any) {
    const payload = {
      task_id: node.id
    }
    this.database.deleteListAPI(payload).subscribe((response) => {
      console.log(response)
      if(response) {
        this.getTopicParentDetails();
      }
    })
  }
}