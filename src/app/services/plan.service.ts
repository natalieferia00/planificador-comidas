import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/plans';

  private _plan = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('foodly_plan') || '{}'));
  plan$ = this._plan.asObservable();

  constructor() {
    this.cargarPlan();
  }

  cargarPlan() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {

        const rawData = Array.isArray(data) ? data[data.length - 1] : data;

        if (rawData) {

          const { _id, __v, createdAt, updatedAt, ...soloDias } = rawData;
          this._plan.next(soloDias);
          localStorage.setItem('foodly_plan', JSON.stringify(soloDias));
          console.log(' Persistencia cargada:', soloDias);
        }
      },
      error: (err) => console.error('Error recuperando datos:', err)
    });
  }

  guardarPlan(datos: any): Observable<any> {

    localStorage.setItem('foodly_plan', JSON.stringify(datos));
    this._plan.next(datos);

    return this.http.post(this.apiUrl, datos).pipe(
      tap(() => console.log('☁️ Sincronizado con MongoDB Atlas'))
    );
  }
}