import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { PaymentForm } from "../components/Cart/PaymentForm.tsx";

export default function Carrito() {
	const { state, dispatch } = useGlobalContext();
	const { isLoggedIn, userId } = useAuth();
	const navigate = useNavigate();
	const { cart, selectedSucursal } = state;

	const [tipoEnvio, setTipoEnvio] = useState("DELIVERY");
	const [formaPago, setFormaPago] = useState("EFECTIVO");

	const totalProductos = cart.reduce((acc, item) => {
		if (item.promocionDetalles && item.promocionDetalles.length > 0) {
			return acc + item.precioPromocional * item.quantity;
		} else {
			return acc + (item.precioPromocional || item.precioVenta) * item.quantity;
		}
	}, 0);
	const total = totalProductos;

	const handleCheckout = async () => {
		if (!isLoggedIn) {
			toast.error("Por favor, inicie sesión para proceder al pago.");
			return;
		}
		if (cart.length <= 0) {
			toast.error("Tu carrito está vacío.");
			return;
		}
		if (!selectedSucursal) {
			toast.error("Debe seleccionar una sucursal en el Menú.");
			return;
		}

		try {
			const response = await fetch(`http://localhost:8080/cliente/${userId}`);
			if (!response.ok) {
				throw new Error("Error fetching client data");
			}
			const clientData = await response.json();

			let domicilio = null;

			if (tipoEnvio === "DELIVERY") {
				if (!clientData.domicilios || clientData.domicilios.length === 0) {
					toast.error("Debe cargar un domicilio en su perfil.");
					return;
				}
				domicilio = clientData.domicilios[0];

				if (!domicilio.localidad || !domicilio.localidad.nombre) {
					toast.error("El domicilio debe tener una localidad válida.");
					return;
				}
			} else {
				console.log(selectedSucursal)
				domicilio = selectedSucursal.domicilio;
			}

			const pedido = {
				id: null,
				eliminado: false,
				total: total,
				estado: "PREPARACION",
				tipoEnvio: tipoEnvio,
				formaPago: formaPago,
				fechaPedido: new Date().toISOString().split("T")[0],
				domicilio: {
					id: null,
					calle: domicilio.calle,
					numero: domicilio.numero,
					cp: domicilio.cp,
					piso: domicilio.piso,
					nroDepto: domicilio.nroDepto,
					localidad: {
						id: domicilio.localidad.id,
						eliminado: domicilio.localidad.eliminado,
						nombre: domicilio.localidad.nombre,
						provincia: {
							id: domicilio.localidad.provincia.id,
							eliminado: domicilio.localidad.provincia.eliminado,
							nombre: domicilio.localidad.provincia.nombre,
							pais: {
								id: domicilio.localidad.provincia.pais.id,
								eliminado: domicilio.localidad.provincia.pais.eliminado,
								nombre: domicilio.localidad.provincia.pais.nombre,
							},
						},
					},
				},
				sucursal: {
					id: selectedSucursal.id,
				},
				factura: null,
				cliente: {
					id: clientData.id,
					eliminado: clientData.eliminado,
					nombre: clientData.nombre,
					apellido: clientData.apellido,
					telefono: clientData.telefono,
					email: clientData.email,
					fechaNac: clientData.fechaNac,
				},
				detallePedidos: cart.flatMap((item) => {
					if (item.promocionDetalles && item.promocionDetalles.length > 0) {
						return item.promocionDetalles.map((detalle) => ({
							id: null,
							eliminado: false,
							cantidad: detalle.cantidad * item.quantity,
							subTotal: 0,
							articulo: {
								id: detalle.articulo.id,
								eliminado: detalle.articulo.eliminado,
								denominacion: detalle.articulo.denominacion,
								precioVenta: detalle.articulo.precioVenta,
								imagenes: detalle.articulo.imagenes,
								unidadMedida: detalle.articulo.unidadMedida,
								categoriaId: detalle.articulo.categoriaId,
							},
						}));
					} else {
						return [{
							id: null,
							eliminado: false,
							cantidad: item.quantity,
							subTotal: (item.precioPromocional || item.precioVenta) * item.quantity,
							articulo: {
								id: item.id,
								eliminado: false,
								denominacion: item.denominacion,
								precioVenta: item.precioPromocional || item.precioVenta,
								imagenes: item.imagenes,
								unidadMedida: {
									id: 1,
									eliminado: false,
									denominacion: "Gramos",
								},
								categoriaId: 2,
							},
						}];
					}
				}),
				empleado: null,
			};

			const saveResponse = await fetch("http://localhost:8080/pedido/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(pedido),
			});

			const saveData = await saveResponse.json();

			if (saveData.estado === "PENDIENTE") {
				toast.success("Pedido enviado con éxito");
				dispatch({ type: "CLEAR_CART" });
			} else if (saveData.estado === "RECHAZADO") {
				toast.error("El pedido fue rechazado por falta de stock");
			} else {
				toast.error("Error al realizar el pedido");
			}
		} catch (error) {
			toast.error("Error al enviar el pedido");
			console.error("Error:", error);
		}
	};


	return (
		<div className="flex justify-center items-center h-auto p-6">
			<div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
				<div className="flex items-center justify-between pb-4 border-b">
					<h2 className="text-2xl font-bold">Carrito ({cart.length})</h2>
					<EllipsisVerticalIcon className="text-gray-400" />
				</div>
				<div className="space-y-4 py-4">
					{cart.length === 0 ? (
						<div className="flex justify-center items-center h-64">
							<h2 className="text-2xl font-bold">Tu carrito está vacío.</h2>
						</div>
					) : (<div/>)}
					{cart.map((item) => (
						<div className="flex items-center justify-between" key={item.id}>
							<div className="flex items-center space-x-2">
								{item.imagenes[0]?.url && (
									<img
										src={item.imagenes[0].url}
										alt={item.denominacion}
										className="w-12 h-12 rounded-full"
									/>
								)}
								<div>
									<p className="font-bold">{item.denominacion}</p>
									<div className="flex items-center space-x-2">
										<Button
											variant="ghost"
											className="px-1"
											onClick={() =>
												dispatch({
													type: "UPDATE_CART_QUANTITY",
													payload: {id: item.id, quantity: item.quantity - 1},
												})
											}
											disabled={item.quantity <= 1}
										>
											-
										</Button>
										<span>{item.quantity}</span>
										<Button
											variant="ghost"
											className="px-1"
											onClick={() =>
												dispatch({
													type: "UPDATE_CART_QUANTITY",
													payload: {id: item.id, quantity: item.quantity + 1},
												})
											}
										>
											+
										</Button>
									</div>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<p className="text-lg font-bold">
									${((item.precioPromocional || item.precioVenta) * item.quantity).toFixed(2)}
								</p>
								<XIcon
									className="text-gray-400"
									onClick={() =>
										dispatch({type: "REMOVE_FROM_CART", payload: item})
									}
								/>
							</div>
						</div>
					))}
				</div>
				<div className="grid grid-cols-2 gap-4 border-t border-b">
				<div className="space-y-2 py-4">
					<div className="flex items-center space-x-2">
						<input
							type="radio"
							id="delivery"
							name="tipoEnvio"
							value="DELIVERY"
							checked={tipoEnvio === "DELIVERY"}
							onChange={(e) => setTipoEnvio(e.target.value)}
						/>
						<label htmlFor="delivery">Delivery</label>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="radio"
							id="takeaway"
							name="tipoEnvio"
							value="TAKE_AWAY"
							checked={tipoEnvio === "TAKE_AWAY"}
							onChange={(e) => setTipoEnvio(e.target.value)}
						/>
						<label htmlFor="takeaway">Retirar</label>
					</div>
				</div>
				<div className="space-y-2 py-4">
					<div className="flex items-center space-x-2">
						<input
							type="radio"
							id="efectivo"
							name="formaPago"
							value="EFECTIVO"
							checked={formaPago === "EFECTIVO"}
							onChange={(e) => setFormaPago(e.target.value)}
						/>
						<label htmlFor="efectivo">Efectivo</label>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="radio"
							id="transferencia"
							name="formaPago"
							value="MERCADO_PAGO"
							checked={formaPago === "MERCADO_PAGO"}
							onChange={(e) => setFormaPago(e.target.value)}
						/>
						<label htmlFor="transferencia">Transferencia</label>
					</div>
				</div>
					</div>
				<div className="flex justify-between items-center py-4">
					<p className="text-xl font-bold">Total</p>
					<p className="text-xl font-bold">${total.toFixed(2)}</p>
				</div>

				{formaPago === "MERCADO_PAGO" ? (
					<PaymentForm handleCheckout={handleCheckout} />
				) : (
					<Button
						className="w-full bg-primary hover:bg-secondary"
						onClick={handleCheckout}
					>
						Ir a Pagar <ArrowRightIcon className="ml-2" />
					</Button>
				)}
			</div>
		</div>
	);
}

function ArrowRightIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	);
}

function EllipsisVerticalIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="1" />
			<circle cx="12" cy="5" r="1" />
			<circle cx="12" cy="19" r="1" />
		</svg>
	);
}

function XIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
