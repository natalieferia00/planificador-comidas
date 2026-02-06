import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss']
})
export class CalendarioComponent {

  @Input() plan: any = {};
  
 
  @Output() cambio = new EventEmitter<any>();

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  notificarCambio(dia: string, comida: string, evento: any) {
    this.cambio.emit({ dia, comida, evento });
  }
}