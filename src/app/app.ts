// src/app/app.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioComponent } from './components/calendario/calendario';
import { ListaCompraComponent } from './components/lista-compra/lista-compra';
import { PlanService } from './services/plan.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalendarioComponent, ListaCompraComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {

  private planService = inject(PlanService);


  menuAbierto: boolean = false;
  seccionActiva: string = 'planificador';
  fechaActual: Date = new Date();


  plan: any = {};
  listaCompra: any[] = [];

  ngOnInit() {

    this.planService.plan$.subscribe({
      next: (data) => {
        if (data) {
          this.plan = { ...data };
          this.actualizarListaCompra(data);
          console.log(' Widgets sincronizados con éxito');
        }
      },
      error: (err) => console.error('Error en el flujo de datos:', err)
    });
  }

  irASeccion(seccion: string) {
    this.seccionActiva = seccion;
    this.menuAbierto = false;
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }


  actualizarPlan(eventoCambio: any) {
    const { dia, comidas } = eventoCambio;


    this.plan[dia] = comidas;


    this.planService.guardarPlan(this.plan).subscribe({
      next: () => {
        console.log(' Sincronizado con MongoDB');
        this.actualizarListaCompra(this.plan);
      },
      error: (err) => console.error(' Error al guardar:', err)
    });
  }


  private actualizarListaCompra(data: any) {
    const ingredientes: string[] = [];
    Object.values(data).forEach((dia: any) => {
      if (dia.almuerzo) ingredientes.push(dia.almuerzo);
      if (dia.cena) ingredientes.push(dia.cena);
    });

    this.listaCompra = [...new Set(ingredientes)];
  }
}