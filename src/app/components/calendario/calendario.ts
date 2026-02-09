import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss']
})
export class CalendarioComponent {
  @Input() set plan(value: any) {
    if (value) {
      this.diasSemana.forEach(dia => {
        if (value[dia]) {
          this.tempPlan[dia] = { ...value[dia] };
        }
      });
    }
  }

  @Output() cambio = new EventEmitter<any>();

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  editandoDia: string | null = null;
  tempPlan: any = {}; 

  constructor() {
    this.diasSemana.forEach(dia => {
      this.tempPlan[dia] = { desayuno: '', almuerzo: '', merienda: '', cena: '' };
    });
  }

  activarEdicion(dia: string) {
    this.editandoDia = dia;
  }

  guardarCambios(dia: string) {
    this.editandoDia = null;
    this.cambio.emit({ dia, comidas: this.tempPlan[dia] });
  }

  limpiarDia(dia: string) {
    if (confirm(`¿Borrar comidas del ${dia}?`)) {
      this.tempPlan[dia] = { desayuno: '', almuerzo: '', merienda: '', cena: '' };
      this.guardarCambios(dia);
    }
  }
}