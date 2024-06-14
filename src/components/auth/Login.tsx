import React, {forwardRef, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {UserIcon} from "lucide-react";
import {Button} from "../ui/Button";
import {Input} from "../ui/Input";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/Popover";
import {Label} from "../ui/Label";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNac: string;
    imagenCliente: "/user-icon.png";
    contrasenia: string;
    domicilios: [];
    usuario: {
        id: null,
        eliminado: false,
        auth0Id: string,
        userName: string
    }
}

const Login = forwardRef<HTMLDivElement>((props, popoverRef) => {
    const {isLoggedIn, username, login, logout} = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        contrasenia: "",
        nombre: '', apellido: '', email: '', telefono: '', fechaNac: '', imagenCliente: "/user-icon.png", domicilios: [],
        usuario: {
            id: null,
            eliminado: false,
            auth0Id: "",
            userName: ""
        }

    });

    const validateFields = () => {
        if (!formData.nombre) {
            toast.error("Falta completar Nombre");
            return false;
        }
        if (!formData.apellido) {
            toast.error("Falta completar Apellido");
            return false;
        }
        if (!formData.telefono) {
            toast.error("Falta completar Teléfono");
            return false;
        }
        if (!formData.fechaNac) {
            toast.error("Falta completar Fecha de nacimiento");
            return false;
        }
        if (!formData.contrasenia) {
            toast.error("Falta completar Contraseña");
            return false;
        }
        return true;
    };

    const handleInputChange = (event) => {
        const {id, value} = event.target;
        setFormData(prevState => {
            const keys = id.split('.');
            let newState = {...prevState};
            let current = newState;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    const handleRegister = async () => {

        if (!validateFields()) {
            return;
        }


        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(formData));

        const response = await fetch(formData.imagenCliente);
        const blob = await response.blob();
        const file = new File([blob], "user-icon.png", {type: blob.type});
        formDataToSend.append("imagenes", file);

        setFormData(prevFormData => ({
            ...prevFormData,
            usuario: {
                ...prevFormData.usuario,
                auth0Id: prevFormData.email,
                userName: prevFormData.email
            }
        }));
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
            login({id: user.id, nombreUsuario: formData.email, rol: "user"});
            console.log("Cliente registrado exitosamente");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleLogin = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("contrasenia", formData.contrasenia);

        try {
            const response = await fetch("http://localhost:8080/cliente/login", {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                toast.error("Email o contraseña incorrectos");
                return;
            }

            const user = await response.json();
            login({id: user.id, nombreUsuario: formData.email, rol: "user"});
            console.log("Inicio de sesión exitoso");
        } catch (error) {
            toast.error("Ha habido un error al iniciar sesión");
            console.error("Error:", error);
        }
    };

    const toggleRegistering = () => {
        setIsRegistering((prevState) => !prevState);
        setFormData({
            contrasenia: "",
            nombre: '', apellido: '', email: '', telefono: '', fechaNac: '', imagenCliente: "/user-icon.png", domicilios: []
        });
    };

    return (
        <Popover ref={popoverRef}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                    <UserIcon className="w-5 h-5"/>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">Nombre<span
                                        className="text-red-500 ml-1">*</span></Label>
                                    <Input id="nombre"
                                           placeholder="Ingresa tu nombre"
                                           value={formData.nombre} onChange={handleInputChange}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Apellido<span
                                        className="text-red-500 ml-1">*</span></Label>
                                    <Input id="apellido"
                                           placeholder="Ingresa tu apellido"
                                           value={formData.apellido} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="telefono">Teléfono<span
                                        className="text-red-500 ml-1">*</span></Label>
                                    <Input id="telefono" type="number" value={formData.telefono}
                                           placeholder="Ingresa tu teléfono"
                                           onChange={handleInputChange}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="fechaNac">Fecha de nacimiento<span
                                        className="text-red-500 ml-1">*</span></Label>
                                    <Input id="fechaNac" type="date" value={formData.fechaNac}
                                           onChange={handleInputChange}/>
                                </div>

                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email<span className="text-red-500 ml-1">*</span></Label>
                                <Input id="email" type="email" value={formData.email}
                                       placeholder="Ingresa tu email"
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña<span className="text-red-500 ml-1">*</span></Label>
                                <Input id="contrasenia" type="password" placeholder="Ingresa tu contraseña"
                                       value={formData.contrasenia}
                                       onChange={handleInputChange}/>
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
                                    id="contrasenia"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full"
                                    autoComplete="off"
                                    value={formData.contrasenia}
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
