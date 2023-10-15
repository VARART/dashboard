import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms'; // Імпортувати необхідні класи для роботи з формами

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.css'],
})
export class GeneralTableComponent implements OnInit {
  financialData: any;
  form: FormGroup;
  items: any[] = [];
  filteredItems: any[] = []; // Відфільтровані дані для відображення
  issuanceDateFilter: string = '';
  constructor(private dataService: DataService, private fb: FormBuilder, private apiService: ApiService) {
    this.form = this.fb.group({
      issuanceDateFilter: [''],
    });    
  }
  ngOnInit(): void {
    this.dataService.getFinancialData().subscribe((data) => {
      this.financialData = data;
      this.applyFilters();
    });
    this.apiService.getData().subscribe(data => {
      this.items = data;
      this.applyFilters();
    });
  }
  applyFilters() {
    this.filteredItems = this.items.filter(item => {
      return (
        !this.issuanceDateFilter || item.issuance_date.includes(this.issuanceDateFilter)
        // Додайте інші фільтри за необхідністю
      );
    });
    this.form.valueChanges
      .pipe(
        filter((filterValue) => !filterValue.issuanceDateFilter || this.item.some(item => item.issuance_date.includes(filterValue.issuanceDateFilter)))
      )
      .subscribe((filteredData) => {
        this.financialData = filteredData;
      });
  }
}