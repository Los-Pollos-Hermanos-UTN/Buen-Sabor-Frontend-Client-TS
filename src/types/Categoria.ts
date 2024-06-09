import { Articulo } from "./Articulo";

export interface Categoria {
	id: number;
	denominacion: string;
	padreId: number | null;
	subCategorias: Categoria[];
	articulos: Articulo[];
}