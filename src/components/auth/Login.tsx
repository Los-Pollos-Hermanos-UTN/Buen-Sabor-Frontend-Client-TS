import React, { useState, ChangeEvent, forwardRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Label } from "../ui/Label";
import { toast } from "react-toastify";
import {Link} from "react-router-dom";

interface FormData {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
	image: string;
}

const Login = forwardRef<HTMLDivElement>((props, popoverRef) => {
	const { isLoggedIn, username, login, logout } = useAuth();
	const [isRegistering, setIsRegistering] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
		image: "/user-icon.png", // Ruta de la imagen en la carpeta public
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const handleRegister = async () => {
		if (formData.password !== formData.confirmPassword) {
			toast.error("Las contraseñas no coinciden");
			return;
		}

		const clientPayload = {
			id: null,
			eliminado: false,
			nombre: formData.name,
			apellido: formData.lastname,
			telefono: "",
			email: formData.email,
			contrasenia: formData.password,
			fechaNac: new Date().toISOString().split("T")[0],
			usuario: {
				id: null,
				eliminado: false,
				auth0Id: formData.password,
				userName: formData.email
			},
			imagenCliente: null, // Se establecerá más adelante
			domicilios: [
				{
					id: null,
					eliminado: false,
					calle: "Siempreviva",
					numero: 123,
					cp: 5501,
					piso: 1,
					nroDepto: 3,
					localidad: {
						id: 1,
						eliminado: false,
						nombre: "Saavedra",
						provincia: {
							id: 1,
							eliminado: false,
							nombre: "Ciudad Autónoma de Buenos Aires",
							pais: {
								id: 1,
								eliminado: false,
								nombre: "Argentina"
							}
						}
					}
				}
			],
			pedidos: null,
		};

		const formDataToSend = new FormData();
		formDataToSend.append("data", JSON.stringify(clientPayload));

		// Cargar la imagen desde la carpeta public y añadirla al FormData
		const response = await fetch(formData.image);
		const blob = await response.blob();
		const file = new File([blob], "user-icon.png", { type: blob.type });
		formDataToSend.append("imagenes", file);

		try {
			const clientResponse = await fetch("http://localhost:8080/cliente/register", {
				method: "POST",
				body: formDataToSend,
			});

			if (!clientResponse.ok) {
				toast.error("Hubo un error registrando el cliente");
				return;
			}

			const user = await clientResponse.json();
			login({ id: user.id, nombreUsuario: formData.email, rol: "user" });
			console.log("Cliente registrado exitosamente");
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleLogin = async () => {
		const formDataToSend = new FormData();
		formDataToSend.append("email", formData.email);
		formDataToSend.append("contrasenia", formData.password);

		try {
			const response = await fetch("http://localhost:8080/cliente/login", {
				method: "POST",
				body: formDataToSend,
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				toast.error(errorMessage || "Email o contraseña incorrectos");
				return;
			}

			const user = await response.json();
			login({ id: user.id, nombreUsuario: formData.email, rol: "user" });
			console.log("Inicio de sesión exitoso");
		} catch (error) {
			toast.error("Ha habido un error al iniciar sesión");
			console.error("Error:", error);
		}
	};

	const toggleRegistering = () => {
		setIsRegistering((prevState) => !prevState);
		setFormData({
			name: "",
			lastname: "",
			email: "",
			password: "",
			confirmPassword: "",
			image: "/user-icon.png", // Ruta de la imagen en la carpeta public
		});
	};

	return (
		<Popover ref={popoverRef}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="relative">
					<UserIcon className="w-5 h-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] rounded-lg p-4 bg-white shadow-xl">
				<div className="space-y-4">
					{isLoggedIn ? (
						<>
							<h2 className="text-2xl font-bold">Bienvenido, {username}</h2>

							<div className="flex space-x-2 mt-4">

								<Link to="/profile" className="w-1/2">
									<Button
										variant="outline"
										className="w-full border-primary text-primary hover:text-secondary hover:border-secondary"
									>
										Mi Perfil
									</Button>
								</Link>
								<Button
									className="bg-primary hover:bg-secondary duration-200 text-white w-1/2"
									onClick={logout}
								>
									Cerrar sesión
								</Button>
							</div>

						</>
					) : isRegistering ? (
						<>
							<h2 className="text-2xl font-bold">Registrarse</h2>
							<div className="space-y-2">
								<Label htmlFor="name">Nombre</Label>
								<Input
									id="name"
									type="text"
									placeholder="Ingresa tu nombre"
									className="w-full"
									autoComplete="off"
									value={formData.name}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastname">Apellido</Label>
								<Input
									id="lastname"
									type="text"
									placeholder="Ingresa tu apellido"
									className="w-full"
									autoComplete="off"
									value={formData.lastname}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Ingresa tu email"
									className="w-full"
									autoComplete="off"
									value={formData.email}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="Ingresa tu contraseña"
									className="w-full"
									autoComplete="off"
									value={formData.password}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Repetir Contraseña</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Repite tu contraseña"
									className="w-full"
									autoComplete="off"
									value={formData.confirmPassword}
									onChange={handleInputChange}
								/>
							</div>
							<Button
								className="bg-primary hover:bg-secondary duration-200 text-white w-full"
								onClick={handleRegister}
							>
								Registrarse
							</Button>
							<p className="text-center text-sm text-gray-500">
								¿Ya tienes una cuenta?{" "}
								<button
									type="button"
									className="font-medium underline"
									onClick={toggleRegistering}
								>
									Iniciar sesión
								</button>
							</p>
						</>
					) : (
						<>
							<h2 className="text-2xl font-bold">Iniciar sesión</h2>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Ingresa tu email"
									className="w-full"
									autoComplete="off"
									value={formData.email}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="Ingresa tu contraseña"
									className="w-full"
									autoComplete="off"
									value={formData.password}
									onChange={handleInputChange}
								/>
							</div>
							<Button
								className="bg-primary hover:bg-secondary duration-200 text-white w-full"
								onClick={handleLogin}
							>
								Iniciar sesión
							</Button>
							<p className="text-center text-sm text-gray-500">
								¿No tienes una cuenta?{" "}
								<button
									type="button"
									className="font-medium underline"
									onClick={toggleRegistering}
								>
									Registrarse
								</button>
							</p>
						</>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
});

export default Login;
