import { CollectionViewer, DataSource, SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject, Observable, map, merge } from 'rxjs';
import { CreateTodoComponent } from '../create-todo/create-todo.component';
import { MatDialog } from '@angular/material/dialog';

interface ItemNode {
  id: number;
  tag: string;
  parent_id: number;
  tenant_id: number;
  context_id: number;
  tag_type: number;
  assigned_by:any;
  tag_status: number;
  description: string;
  image_path: string;
  parent_has_child: boolean;
  user_generated_indicator: number;
  added_to_topics_indicator: number;
  have_parent: boolean;
  parent_node_details: any;
  tag_mapped_type_based_count: any;
  tag_mapped_with_map_table_count: number;
}

interface taskNode {
  progress: any,
  start: any,
  end: any,
  team: any;
  tag: any,
  priority:any,
  parent_id: any,
  tenant_id: any,
  context_id: any,
  tag_type: any,
  assigned_by:any,
  tag_status: any,
  description: any,
  parent_has_child: boolean,
  added_to_topics_indicator: any,
  have_parent: boolean,
  parent_node_details: any,
  selected?: boolean;
  id?: number;
  parent?: taskNode
  children?: taskNode[];
}

const TREE_DATA: taskNode[] = [
  {
    "id": 1,
    "tag": "Task 1",
    "progress": 30,
    "assigned_by": "Task BETA",
    "priority": "Highest",
    "team": "ALpha",
    "start": "10 AM",
    "end": "10 PM",
    "parent_id": 1,
    "tenant_id": 1,
    "context_id": 1,
    "tag_type": 1,
    "tag_status": 1,
    "description": "PARENT DESCRIPTION 1",
    "parent_has_child": true,
    "added_to_topics_indicator": 1,
    "have_parent": true,
    "parent_node_details": "",
    "children": [
      {
        "id": 2,
        "tag": "Sub Task 1",
        "progress": 50,
        "priority": "Lowest",
        "assigned_by": "Sub Task BETA",
        "team": "ALpha",
        "start": "10 AM",
        "end": "10 PM",
        "parent_id": 1,
        "tenant_id": 1,
        "context_id": 1,
        "tag_type": 1,
        "tag_status": 1,
        "description": "Sub DESCRIPTION 2",
        "parent_has_child": true,
        "added_to_topics_indicator": 1,
        "have_parent": true,
        "parent_node_details": "",
        "children": [
          {
            "id": 3,
            "tag": "Inner Sub Task 1",
            "progress": 60,
            "priority": "Medium",
            "assigned_by": "Inner Sub Task BETA",
            "team": "ALpha",
            "start": "10 AM",
            "end": "10 PM",
            "parent_id": 2,
            "tenant_id": 1,
            "context_id": 1,
            "tag_type": 1,
            "tag_status": 1,
            "description": "SUB DESCRIPTION 1",
            "parent_has_child": true,
            "added_to_topics_indicator": 1,
            "have_parent": true,
            "parent_node_details": "",
            "children": [
              {
                "id": 5,
                "tag": "Sub Inner Sub Task 1",
                "progress": 20,
                "priority": "Highest",
                "assigned_by": "Inner Sub Task BETA",
                "team": "ALpha",
                "start": "10 AM",
                "end": "10 PM",
                "parent_id": 2,
                "tenant_id": 1,
                "context_id": 1,
                "tag_type": 1,
                "tag_status": 1,
                "description": "SUB DESCRIPTION 1",
                "parent_has_child": false,
                "added_to_topics_indicator": 1,
                "have_parent": true,
                "parent_node_details": ""
              },
              {
                "id": 7,
                "tag": "Sub Inner Sub Task 2",
                "progress": 80,
                "priority": "Medium",
                "assigned_by": "Inner Sub Task BETA",
                "team": "ALpha",
                "start": "10 AM",
                "end": "10 PM",
                "parent_id": 2,
                "tenant_id": 1,
                "context_id": 1,
                "tag_type": 1,
                "tag_status": 1,
                "description": "SUB DESCRIPTION 2",
                "parent_has_child": false,
                "added_to_topics_indicator": 1,
                "have_parent": true,
                "parent_node_details": ""
              },
              {
                "id": 8,
                "tag": "Sub Inner Sub Task 3",
                "progress": 80,
                "priority": "Medium",
                "assigned_by": "Inner Sub Task BETA",
                "team": "ALpha",
                "start": "10 AM",
                "end": "10 PM",
                "parent_id": 2,
                "tenant_id": 1,
                "context_id": 1,
                "tag_type": 1,
                "tag_status": 1,
                "description": "SUB DESCRIPTION 3",
                "parent_has_child": false,
                "added_to_topics_indicator": 1,
                "have_parent": true,
                "parent_node_details": ""
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "tag": "Task 2",
    "progress": 90,
    "assigned_by": "Task BETA",
    "priority": "Highest",
    "team": "ALpha",
    "start": "10 AM",
    "end": "10 PM",
    "parent_id": 3,
    "tenant_id": 3,
    "context_id": 3,
    "tag_type": 3,
    "tag_status": 3,
    "description": "PARENT DESCRIPTION 2",
    "parent_has_child": false,
    "added_to_topics_indicator": 3,
    "have_parent": true,
    "parent_node_details": ""
  }
];

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
  openSectionIds: { [key: string]: boolean } = {};

  setParent(data: any, parent: any) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach((x: any) => {
        this.setParent(x, data);
      });
    }
  }

  treeControl = new NestedTreeControl<taskNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<taskNode>();

  constructor(public dialog: MatDialog) {
    this.dataSource.data = TREE_DATA;
    Object.keys(this.dataSource.data).forEach((x: any) => {
      this.setParent(this.dataSource.data[x], null);
    });
  }

  hasChild = (_: number, node: taskNode) => !!node.children && node.children.length > 0;

  checkAllParents(node: any) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }

  todoItemSelectionToggle(checked: any, node: any) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach((x: any) => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
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

}
