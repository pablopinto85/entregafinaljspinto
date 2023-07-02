export class Joyeria {
    constructor(joya, cantidad) {
      this.id = joya.id;
      this.titulo = joya.titulo;
      this.precio = joya.precio;
      this.cantidad = joya.cantidad;
      this.precioTotal = joya.precio;
    }
  
    sumarUnidad() {
      this.cantidad++;
      this.actualizarPrecioTotal();
    }
  
    restarUnidad() {
      if (this.cantidad > 1) {
        this.cantidad--;
        this.actualizarPrecioTotal();
      }
    }
  
    actualizarPrecioTotal() {
      this.precioTotal = this.precio * this.cantidad;
    }
  }