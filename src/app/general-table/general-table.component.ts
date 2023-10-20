import {Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { filter } from 'rxjs/operators';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {CreditItemModel} from "../models/credit-item.model";
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

// Імпортувати необхідні класи для роботи з формами

let routes = [];

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.css'],
})
export class GeneralTableComponent implements OnInit {
  form: FormGroup;
  items: CreditItemModel[] = [];
  filteredItems: CreditItemModel[] = []; // Відфільтровані дані для відображення
  issuanceDateFilter: string = '';
  actualReturnDateFilter: string = '';
  isExpiredFilter: boolean = false;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  constructor(private fb: FormBuilder, private apiService: ApiService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.form = this.fb.group({
      issuanceDateFilter: [''],
      actualReturnDateFilter: [''],
      isExpiredFilter: [false],
    });
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
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
        // Додайте інші фільтри за необхідністю
      );
    });
    this.form.valueChanges
      .pipe(
        filter((filterValue) => this.items.includes(filterValue))
      )
      .subscribe((filteredData) => {
        this.items = filteredData as CreditItemModel[];
      });
  }


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
