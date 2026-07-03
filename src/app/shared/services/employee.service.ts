import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Employee {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable();

  // Add a new employee
  addEmployee(emp: Employee) {
    const current = this.employeesSubject.value;
    this.employeesSubject.next([...current, emp]);
  }

  // Optional: initialize with default data
  initializeData(data: Employee[]) {
    this.employeesSubject.next(data);
  }
}
