import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { map, groupBy, mergeMap, toArray, reduce } from 'rxjs/operators';

@Component({
  selector: 'app-short-info',
  templateUrl: './short-info.component.html',
  styleUrls: ['./short-info.component.css'],
})
export class ShortInfoComponent implements OnInit {
  metrics: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().pipe(
      mergeMap((data) => data),
      groupBy((item) => item.issuance_date.split('-')[1]), // Групуємо за місяцем
      mergeMap((group$) =>
        group$.pipe(
          map((item) => ({
            month: item.issuance_date.split('-')[1],
            body: +item.body,
            percent: +item.percent,
            actual_return_date: item.actual_return_date,
          }))
        )
      ),
      toArray(),
      map((metrics) => {
        return metrics.reduce((acc, metric) => {
          const existingMetric = acc.find((m) => m.month === metric.month);
          if (existingMetric) {
            existingMetric.body += metric.body;
            existingMetric.percent += metric.percent;
            existingMetric.totalIssuances++;
            if (metric.actual_return_date) {
              existingMetric.totalReturns++;
            }
          } else {
            metric.totalIssuances = 1;
            metric.totalReturns = metric.actual_return_date ? 1 : 0;
            acc.push(metric);
          }
          return acc;
        }, []);
      })
    )
    .subscribe((metrics) => {
      this.metrics = metrics;
    });
  }
}
