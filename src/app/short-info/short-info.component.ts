import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { map, groupBy, mergeMap, toArray, reduce } from 'rxjs/operators';

@Component({
  selector: 'app-short-info',
  templateUrl: './short-info.component.html',
  styleUrls: ['./short-info.component.css'],
})
export class ShortInfoComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().pipe(
      mergeMap((data) => data as any[]),
      groupBy((item: any) => item.issuance_date.split('-')[1]),
      mergeMap((group$) =>
        group$.pipe(
          map((item: any) => ({
            month: item.issuance_date.split('-')[1] + '-' + item.issuance_date.split('-')[0],
            body: +item.body,
            percent: +item.percent,
            actual_return_date: item.actual_return_date,
          }))
        )
      ),
      reduce((acc, metric) => {
        const existingMetric = acc.find((m) => m.month === metric.month);
        if (existingMetric) {
          existingMetric.body += metric.body;
          existingMetric.percent += metric.percent;
          existingMetric.totalIssuances += 1; // Збільшуємо кількість виданих кредитів
          if (metric.actual_return_date) {
            existingMetric.totalReturns += 1; // Збільшуємо кількість повернених кредитів
          }
        } else {
          acc.push({
            ...metric,
            totalIssuances: 1, // Початкова кількість виданих кредитів
            totalReturns: metric.actual_return_date ? 1 : 0, // Початкова кількість повернених кредитів
          });
        }
        return acc;
      }, [] as Metric[])
    )
    .subscribe((metrics) => {
      this.metrics = metrics;
    })
  }
};

interface Metric {
  month: string;
  body: number;
  percent: number;
  totalIssuances: number;
  totalReturns: number;
}
