import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class CardComponent {
  @Input() item: any;
  @Output() toBeDeletedItem = new EventEmitter<any>();
  @Output() markCompleted = new EventEmitter<any>();
  @Output() toBeEdited = new EventEmitter<any>();
  deleteItem(item: any) {
    this.toBeDeletedItem.emit(item);
  }
  markItemCompleted(item: any) {
    this.markCompleted.emit(item);
  }
  editItem(item: any) {
    this.toBeEdited.emit(item);
  }
}
