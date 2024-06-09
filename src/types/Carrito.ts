import { Sucursal } from "./Sucursal";
import { User } from "./User";

export interface CartItem {
	cantidad: any;
	precioVenta: any;
	id: number;
	name: string;
	price: number;
	quantity: number;
}

export interface State {
	cart: CartItem[];
	user: User | null;
	selectedSucursal: Sucursal | null;
}

export interface Action {
	type: string;
	payload?: any;
}
