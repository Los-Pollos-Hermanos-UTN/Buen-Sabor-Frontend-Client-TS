import { FaShoppingCart } from "react-icons/fa";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";


export default function ArticulosSection({ articulos, dispatch }) {
	return articulos.map((articulo) => {
		const precio = articulo.precioPromocional || articulo.precioVenta;
		return (
			<Card className="w-full" key={articulo.id}>
				<div className="relative">
					<Badge
						variant="secondary"
						className="absolute top left rounded-md rounded-bl-none rounded-tr-none hover:bg-slate-100"
					>
						{articulo.categoriaDenominacion?.toUpperCase()}
					</Badge>
					{articulo.imagenes[0]?.url && (
						<img
							src={articulo.imagenes[0].url}
							alt={articulo.denominacion}
							className="w-full h-48 object-cover rounded-t-lg"
						/>
					)}
				</div>
				<CardContent className="space-y-2 p-4 text-center relative">
					<div className="flex">
						<h3 className="text-lg font-bold">{articulo.denominacion}</h3>
					</div>
					<div className="flex space-x-2">
						<p className="text-lg font-bold">${precio.toFixed(2)}</p>
					</div>
					<div className="absolute bottom-4 right-4">
						<button
							className="text-primary hover:text-secondary"
							onClick={() => dispatch({ type: "ADD_TO_CART", payload: articulo })}
						>
							<FaShoppingCart className="w-5 h-5" />
						</button>
					</div>
				</CardContent>
			</Card>
		);
	});
}
