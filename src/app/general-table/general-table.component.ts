import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';// Імпортувати необхідні класи для роботи з формами

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.css'],
})
export class GeneralTableComponent implements OnInit {
  form: FormGroup;
  items: CreditItemModel[] = [];
  filteredItems: any[] = []; // Відфільтровані дані для відображення
  issuanceDateFilter: string = '';
  actualReturnDateFilter: string = '';
  isExpiredFilter: boolean = false;
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.form = this.fb.group({
      issuanceDateFilter: [''],
      actualReturnDateFilter: [''],
      isExpiredFilter: [false],
    });
  }
  ngOnInit(): void {
    this.apiService.getData().subscribe(data => {
      this.items = data as CreditItemModel[]; // Оновлення значення змінної
      this.applyFilters(); // Виклик функції applyFilters для фільтрації даних
    });
  }
  applyFilters() {
    console.log(1);
    this.filteredItems = this.items.filter(item => {
      return (
        (this.issuanceDateFilter === '' || item.issuance_date.includes(this.issuanceDateFilter))
        && (this.actualReturnDateFilter === '' || item.actual_return_date && item.actual_return_date.includes(this.actualReturnDateFilter))
        && (!this.isExpiredFilter || !item.actual_return_date && new Date(item.return_date) < new Date() || item.actual_return_date && new Date(item.actual_return_date) > new Date(item.return_date))
      );
    })
    this.form.valueChanges
      .pipe(
        filter((filterValue) => this.items.includes(filterValue))
      )
      .subscribe((filteredData) => {
        this.items = filteredData as any;
      });
  }
};
interface CreditItemModel {
  id: number;
  user: string;
  issuance_date: string;
  return_date: string;
  actual_return_date: string;
  body: number;
  percent: number;
}
