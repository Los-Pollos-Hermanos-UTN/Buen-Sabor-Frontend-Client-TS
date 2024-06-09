export interface Articulo {
	id: number;
	denominacion: string;
	precioVenta: number;
	eliminado: boolean;
	imagenes: { url: string }[];
	categoriaDenominacion: string;
	cantidad: number;
}
