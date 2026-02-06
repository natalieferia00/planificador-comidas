import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaCompraComponent } from './components/lista-compra/lista-compra';
import { CalendarioComponent } from './components/calendario/calendario';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [CommonModule, ListaCompraComponent, CalendarioComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
 
  menuAbierto: boolean = false;
  seccionActiva: string = 'planificador';
  fechaActual: Date = new Date();


  plan: any = {}; 
  listaCompra: any[] = [];

  constructor() {
    this.cargarPlan();
  }


  irASeccion(seccion: string) {
    this.seccionActiva = seccion;
    this.menuAbierto = false; 
    
  
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }

  actualizarPlan(dia: string, comida: string, evento: any) {
    if (!this.plan[dia]) this.plan[dia] = {};
    this.plan[dia][comida] = evento.target.value;
    localStorage.setItem('planificador_comidas', JSON.stringify(this.plan));
  }

  private cargarPlan() {
    const guardado = localStorage.getItem('planificador_comidas');
    if (guardado) this.plan = JSON.parse(guardado);
  }
}