import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmptyMessageCardComponent } from '../empty-message-card/empty-message-card.component';
import { CardComponent } from '../task/task.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [EmptyMessageCardComponent, CardComponent, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class ListComponent {
  form: FormGroup;
  editTaskId = null;

  toDoListItems = [
    {
      id: 1,
      title: 'Learn Angular',
      description: 'Learn the basics of Angular',
      priority: 'High',
      dueDate: '2024-07-15',
      status: 'To-Do',
    },
    {
      id: 2,
      title: 'DSA',
      description: 'Learn Graph',
      priority: 'Medium',
      dueDate: '2024-07-16',
      status: 'In-Progress',
    },
    {
      id: 3,
      title: 'Learn Python',
      description: 'Learn OOPS concept',
      priority: 'Low',
      dueDate: '2024-07-13',
      status: 'Completed',
    },
  ];
  ngOnInit() {
    this.loadTasksFromLocalStorage();
  }

  constructor() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    if (this.form.status !== 'VALID') {
      return;
    }
    let task = this.form.getRawValue();
    if (this.editTaskId) {
      task['id'] = this.editTaskId;
      this.toDoListItems = this.toDoListItems.map((item: any) =>
        item.id !== this.editTaskId ? item : task
      );
    } else {
      let lastIndex = this.toDoListItems.reduce(
        (max, obj) => (obj.id > max ? obj.id : max),
        0
      );
      task['id'] = lastIndex && !this.editTaskId ? lastIndex + 1 : 1;
      this.toDoListItems.unshift(task);
    }
    this.form.reset();
    this.editTaskId = null;
    this.saveTasksToLocalStorage();
  }

  deleteItem(toBeDeletedItem: any) {
    this.toDoListItems = this.toDoListItems.filter(
      (item) => item.id !== toBeDeletedItem.id
    );
    this.saveTasksToLocalStorage();
  }

  markItemCompleted(task: any) {
    this.toDoListItems = this.toDoListItems.map((item: any) => {
      if (item.id === task.id) {
        return { ...item, status: 'Completed' };
      }
      return item;
    });
    this.saveTasksToLocalStorage();
  }

  editItem(task: any) {
    this.editTaskId = task.id;
    let formCtrl = this.form.controls;
    formCtrl['status'].setValue(task.status);
    formCtrl['priority'].setValue(task.priority);
    formCtrl['dueDate'].setValue(task.dueDate);
    formCtrl['title'].setValue(task.title);
    formCtrl['description'].setValue(task.description);
  }

  onSortChange(event: Event) {
    const sortKey = (event.target as HTMLSelectElement).value;
    switch (sortKey) {
      case 'priority':
        this.toDoListItems.sort((a, b) =>
          a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0
        );
        break;
      case 'dueDate':
        this.toDoListItems.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        break;
      case 'status':
        this.toDoListItems.sort((a, b) =>
          a.status > b.status ? 1 : a.status < b.status ? -1 : 0
        );
        break;
      default:
        // Default sorting by added time (assumed by id)
        this.toDoListItems.sort((a, b) => a.id - b.id);
        break;
    }
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.toDoListItems));
  }

  loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.toDoListItems = JSON.parse(tasks);
    }
  }
}
