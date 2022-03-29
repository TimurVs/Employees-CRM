import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./services/employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees : Employee[];
  public editEmployee: Employee | undefined
  public deleteEmployee: Employee | undefined
  public results: Employee[] = [];


  constructor(private employeeService: EmployeeService) {
    this.employees = [];
    // this.editEmployee = undefined;
    this.results = []


  }

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees():void {
    this.employeeService.getEmployees()
      .subscribe({next:(response: Employee[])=> this.employees=response,
        error:(err: HttpErrorResponse) => console.error('Observer got an error: ' + err.message),
        complete: () => console.log(this.employees),
      });
  }

  public onAddEmployee(addForm:NgForm):void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value)
      .subscribe({
        next:(response: Employee) => {
          this.getEmployees()},
        error: (err: HttpErrorResponse) => {
          alert(err.message)},
        complete:() =>{
          addForm.reset();
        }
      })
  }

  public onUpdateEmployee(employee: Employee):void{
     this.employeeService.updateEmployee(employee)
      .subscribe({
        next:(response: Employee)=>{
          this.getEmployees()
        },
        error:(err:HttpErrorResponse)=> {
          alert(err.message)
        },
        complete:()=>{
          console.log('Updated Successfully')
        }
      })
  }

  public onDeleteEmployee(employeeId: number):void{
    this.employeeService.deleteEmployee(employeeId)
      .subscribe({
        next:(response: void)=>{
          this.getEmployees()
        },
        error:(err:HttpErrorResponse)=> {
          alert(err.message)
        },
        complete:()=>{
          console.log('Deleted Successfully')
        }
      })
  }

  public onOpenModal(mode: string, employee?: Employee): void{
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button)
    button.click();
  }

  public searchEmployee(key: string): void{
    console.log('----->>>', key)
    this.results = [];
    for (let employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        this.results.push(employee)
      }
    }
    this.employees = this.results;
    if(this.results.length === 0 || !key){
      this.getEmployees()
    }
  }

}





// ((response:Employee[])=>this.employees=response),
//   (error: HttpErrorResponse) => {alert(error.message)}
