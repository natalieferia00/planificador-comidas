import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface ItemCompra {
  id: string;
  nombre: string;
  precio?: number; 
  completado: boolean;
}

export interface PlanDia {
  desayuno: string;
  almuerzo: string;
  merienda: string;
  cena: string;
}

export interface PlanSemanal {
  [dia: string]: PlanDia;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  

  private _plan = new BehaviorSubject<PlanSemanal>(this.getPlanInicial());
  plan$ = this._plan.asObservable();

 
  private _listaCompra = new BehaviorSubject<ItemCompra[]>(this.getListaInicial());
  listaCompra$ = this._listaCompra.asObservable();

  constructor() {}


  private getPlanInicial(): PlanSemanal {
    const guardado = localStorage.getItem('planificador_comidas');
    if (guardado) return JSON.parse(guardado);

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const planVacio: PlanSemanal = {};
    dias.forEach(dia => {
      planVacio[dia] = { desayuno: '', almuerzo: '', merienda: '', cena: '' };
    });
    return planVacio;
  }

  actualizarComida(dia: string, comida: keyof PlanDia, valor: string) {
    const planActual = { ...this._plan.value };
   
    planActual[dia] = { ...planActual[dia], [comida]: valor };
    
    this._plan.next(planActual);
    localStorage.setItem('planificador_comidas', JSON.stringify(planActual));
  }



  private getListaInicial(): ItemCompra[] {
    const guardado = localStorage.getItem('lista_compra_precios');
    return guardado ? JSON.parse(guardado) : [];
  }

  agregarProducto(nombre: string, precio?: number) {
    const listaActual = [...this._listaCompra.value];
    const nuevoItem: ItemCompra = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      precio: precio || undefined,
      completado: false
    };

    listaActual.push(nuevoItem);
    this.actualizarYGuardarLista(listaActual);
  }

  eliminarProducto(id: string) {
    const nuevaLista = this._listaCompra.value.filter(item => item.id !== id);
    this.actualizarYGuardarLista(nuevaLista);
  }

  toggleCompletado(id: string) {
    const nuevaLista = this._listaCompra.value.map(item => 
      item.id === id ? { ...item, completado: !item.completado } : item
    );
    this.actualizarYGuardarLista(nuevaLista);
  }

  private actualizarYGuardarLista(nuevaLista: ItemCompra[]) {
    this._listaCompra.next(nuevaLista);
    localStorage.setItem('lista_compra_precios', JSON.stringify(nuevaLista));
  }

  obtenerTotal(): number {
    return this._listaCompra.value.reduce((total, item) => total + (item.precio || 0), 0);
  }
}