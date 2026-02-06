import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-compra.html',
  styleUrls: ['./lista-compra.scss']
})
export class ListaCompraComponent implements OnInit {
  @Input() items: any[] = []; 

  productos: any[] = [];
  nuevoNombre: string = '';
  nuevoPrecio: number | null = null;

  ngOnInit() {
    this.cargarDeStorage();
  }

  agregarProducto() {
    if (this.nuevoNombre.trim()) {
      const nuevo = {
        id: Date.now().toString(),
        nombre: this.nuevoNombre.trim(),
        precio: this.nuevoPrecio,
        completado: false
      };
      this.productos.unshift(nuevo);
      this.guardarEnStorage();
      this.nuevoNombre = '';
      this.nuevoPrecio = null;
    }
  }

  guardarEnStorage() {
    localStorage.setItem('lista_compra_precios', JSON.stringify(this.productos));
  }

  cargarDeStorage() {
    const datos = localStorage.getItem('lista_compra_precios');
    if (datos) this.productos = JSON.parse(datos);
  }

  eliminarProducto(id: string) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardarEnStorage();
  }

  toggleCompletado(p: any) {
    p.completado = !p.completado;
    this.guardarEnStorage();
  }

  obtenerTotal(): number {
    return this.productos.reduce((acc, p) => acc + (p.precio || 0), 0);
  }
}