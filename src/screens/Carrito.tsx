import React from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";	

const Carrito: React.FC = () => {
	const { state, dispatch } = useGlobalContext();

	const handleRemove = (id: number) => {
		dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
	};

	const handleChangeCantidad = (id: number, cantidad: number) => {
		dispatch({ type: "CHANGE_CART_ITEM_QUANTITY", payload: { id, cantidad } });
	};

	const total = state.cart.reduce(
		(acc, item) => acc + item.precioVenta * item.cantidad,
		0
	);

	return (
		<div className="bg-white p-6 md:p-8 lg:p-10">
			<h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
			<div className="grid grid-cols-1 gap-4">
				{state.cart.map((articulo: any) => (
					<Card key={articulo.id}>
						<CardContent className="flex justify-between items-center">
							<div>
								<h2 className="text-lg font-bold">{articulo.denominacion}</h2>
								<p className="text-sm">Precio: ${articulo.precioVenta}</p>
								<div className="flex items-center mt-2">
									<Button
										variant="secondary"
										onClick={() =>
											handleChangeCantidad(articulo.id, articulo.cantidad - 1)
										}
									>
										-
									</Button>
									<span className="mx-2">{articulo.cantidad}</span>
									<Button
										variant="secondary"
										onClick={() =>
											handleChangeCantidad(articulo.id, articulo.cantidad + 1)
										}
									>
										+
									</Button>
								</div>
							</div>
							<Button
								variant="destructive"
								onClick={() => handleRemove(articulo.id)}
							>
								Eliminar
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="mt-4">
				<h2 className="text-xl font-bold">Total: ${total}</h2>
				<Button variant="primary" className="mt-2">
					Proceder al Pago
				</Button>
			</div>
		</div>
	);
};

export default Carrito;
