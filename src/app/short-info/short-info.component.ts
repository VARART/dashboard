import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // Імпортуємо сервіс для роботи з даними
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-short-info',
  templateUrl: './short-info.component.html',
  styleUrls: ['./short-info.component.css']
})
export class ShortInfoComponent implements OnInit {
  data: any[] = []; // Масив для зберігання отриманих даних
  metrics: any = {}; // Об'єкт для зберігання метрик

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Отримайте дані з API через сервіс
    this.dataService.getData().pipe(
      map((response: any) => {
        // Групуємо дані за місяцями та обчислюємо метрики
        return this.calculateMetrics(response);
      })
    ).subscribe((metrics: any) => {
      this.metrics = metrics; // Збережіть обчислені метрики
    });
  }

  // Функція для обчислення метрик
  calculateMetrics(data: any[]): any {
  }
}
