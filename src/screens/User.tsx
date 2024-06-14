import {useEffect, useState} from "react"
import {Avatar, AvatarFallback, AvatarImage} from "../components/ui/Avatar"
import {Button} from "../components/ui/Button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../components/ui/Card"
import {Label} from "../components/ui/Label"
import {Input} from "../components/ui/Input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/Select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/Tabs"
import {Badge} from "../components/ui/Badge"
import {useAuth} from "../context/AuthContext";
import {toast} from "react-toastify";


export default function User() {
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const {isLoggedIn, userId} = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [currentOrders, setCurrentOrders] = useState([]);
    const [previousOrders, setPreviousOrders] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState(null);
    const [filteredLocalidades, setFilteredLocalidades] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [originalCliente, setOriginalCliente] = useState(null);

    const [cliente, setCliente] = useState({
        nombre: '', apellido: '', email: '', telefono: '', fechaNac: '', imagenCliente: {url: ''}, domicilios: [{
            calle: '',
            numero: '',
            cp: '',
            piso: '',
            nroDepto: '',
            localidad: {id: '', nombre: '', provincia: {id: '', nombre: '', pais: {id: '', nombre: ''}}}
        }]
    });

    useEffect(() => {
        fetch('http://localhost:8080/provincia')
            .then(response => response.json())
            .then(data => setProvincias(data.slice(0, 24)))
            .catch(error => console.error('Error fetching provincias:', error));

        fetch('http://localhost:8080/pais')
            .then(response => response.json())
            .then(data => setPaises(data))
            .catch(error => console.error('Error fetching paises:', error));

        fetch('http://localhost:8080/localidad')
            .then(response => response.json())
            .then(data => setLocalidades(data.slice(0, 2029)))
            .catch(error => console.error('Error fetching localidades:', error));
    }, []);

    useEffect(() => {
        if (isLoggedIn && userId) {
            fetch(`http://localhost:8080/cliente/${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.domicilios.length === 0) {
                        data.domicilios = [{
                            calle: '',
                            numero: '',
                            cp: '',
                            piso: '',
                            nroDepto: '',
                            localidad: {id: '', nombre: '', provincia: {id: '', nombre: '', pais: {id: '', nombre: ''}}}
                        }];
                    }
                    setCliente(data);
                    setOriginalCliente(data);  // Almacenar los datos originales
                    setSelectedProvincia(data.domicilios[0]?.localidad?.provincia?.id || null);
                })
                .catch(error => console.error('Error fetching cliente:', error));

            fetch(`http://localhost:8080/pedido/cliente/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const orders = data;
                    const current = orders.filter(order => ["PENDIENTE", "RETIRAR", "PREPARACION"].includes(order.estado));
                    const previous = orders.filter(order => ["ENTREGADO", "RECHAZADO", "CANCELADO"].includes(order.estado));
                    previous.reverse();
                    current.reverse();
                    setCurrentOrders(current);
                    setPreviousOrders(previous);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }
    }, [isLoggedIn, userId]);



    useEffect(() => {
        if (selectedProvincia) {
            const filtered = localidades.filter(localidad => localidad.provincia.id === selectedProvincia);
            setFilteredLocalidades(filtered);
        } else {
            setFilteredLocalidades([]);
        }
    }, [selectedProvincia, localidades]);



    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setCliente(prevState => ({
                    ...prevState, imagenCliente: {url: reader.result}
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setProfileImage(null);
            setCliente(prevState => ({
                ...prevState, imagenCliente: {url: ''}
            }));
        }
    };


    const handleInputChange = (event) => {
        const {id, value} = event.target;
        setCliente(prevState => {
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

    const handleProvinciaChange = (provinciaId, index) => {
        setSelectedProvincia(provinciaId); // Mover esta línea arriba para actualizar el estado primero
        handleInputChange({target: {id: `domicilios.${index}.localidad.provincia.id`, value: provinciaId}});
        handleInputChange({target: {id: `domicilios.${index}.localidad.id`, value: ''}});
    };


    const handleLocalidadChange = (localidadId, index) => {
        handleInputChange({target: {id: `domicilios.${index}.localidad.id`, value: localidadId}});
    };


    const handleDomicilioChange = (event, index) => {
        const {id, value} = event.target;
        const updatedDomicilios = [...cliente.domicilios];
        const field = id.split('-')[0];
        updatedDomicilios[index] = {
            ...updatedDomicilios[index], [field]: value
        };
        setCliente(prevState => ({
            ...prevState, domicilios: updatedDomicilios
        }));
    };


    const validateFields = () => {
        if (!cliente.nombre) {
            toast.error("Falta completar Nombre");
            return false;
        }
        if (!cliente.apellido) {
            toast.error("Falta completar Apellido");
            return false;
        }
        if (!cliente.telefono) {
            toast.error("Falta completar Teléfono");
            return false;
        }
        if (!cliente.fechaNac) {
            toast.error("Falta completar Fecha de nacimiento");
            return false;
        }
        for (const [index, domicilio] of cliente.domicilios.entries()) {
            if (!domicilio.calle) {
                toast.error(`Falta completar Calle en dirección`);
                return false;
            }
            if (!domicilio.numero) {
                toast.error(`Falta completar Número en dirección`);
                return false;
            }
            if (!domicilio.cp) {
                toast.error(`Falta completar Código postal en dirección`);
                return false;
            }
            if (!domicilio.localidad.provincia.pais.id) {
                toast.error(`Falta completar País en dirección`);
                return false;
            }
            if (!domicilio.localidad.provincia.id) {
                toast.error(`Falta completar Provincia en dirección`);
                return false;
            }
            if (!domicilio.localidad.id) {
                toast.error(`Falta completar Localidad en dirección`);
                return false;
            }
        }
        return true;
    };

    const handleSaveChanges = async () => {
        if (!validateFields()) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(cliente));

        if (cliente.imagenCliente && cliente.imagenCliente.url) {
            const response = await fetch(cliente.imagenCliente.url);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.png", {type: blob.type});
            formDataToSend.append("imagenes", file);
        }

        try {
            const response = await fetch(`http://localhost:8080/cliente/edit/${userId}`, {
                method: 'PUT', body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Error updating cliente');
            }

            const data = await response.json();
            setCliente(data);
            setIsProfileEditOpen(false);
        } catch (error) {
            console.error('Error updating cliente:', error);
        }
    };


    return (<div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 shadow">
            <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder-user.jpg"/>
                        <AvatarFallback>{cliente.nombre.slice(0, 1)}{cliente.apellido.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-lg font-semibold">{cliente.nombre} {cliente.apellido}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{cliente.email}</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => setIsProfileEditOpen(true)}>
                    Editar perfil
                </Button>
            </div>
        </header>
        <main className="container mx-auto py-8 px-4 md:px-6 flex-1 grid md:grid-cols-[1fr_300px] gap-8">
            {isProfileEditOpen && (<div className="order-1 md:order-2 grid gap-4">
                <Card className="relative">
                    <div className="absolute top-4 right-4">
                        <Button variant="ghost" size="icon" onClick={() => setShowExitModal(true)}>
                            <XIcon className="w-4 h-4"/>
                            <span className="sr-only">Cerrar</span>
                        </Button>
                    </div>
                    <CardHeader>
                        <CardTitle>Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Nombre<span
                                    className="text-red-500 ml-1">*</span></Label>
                                <Input id="nombre" value={cliente.nombre} onChange={handleInputChange}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Apellido<span className="text-red-500 ml-1">*</span></Label>
                                <Input id="apellido" value={cliente.apellido} onChange={handleInputChange}/>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="telefono">Teléfono<span className="text-red-500 ml-1">*</span></Label>
                            <Input id="telefono" type="number" value={cliente.telefono}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fechaNac">Fecha de nacimiento<span
                                    className="text-red-500 ml-1">*</span></Label>
                                <Input id="fechaNac" type="date" value={cliente.fechaNac}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="grid gap-2 ">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="profileImage">Imagen de perfil<span
                                    className="text-red-500 ml-1">*</span></label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                                    <div
                                        className="flex items-center justify-center h-20 w-20 overflow-hidden rounded-full cursor-pointer"
                                        onClick={() => document.getElementById("profileImage").click()}
                                    >
                                        <img
                                            src={cliente.imagenCliente.url || profileImage}
                                            alt="Profile Image"
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                    <input
                                        id="profileImage"
                                        type="file"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <Label htmlFor="address" className="text-1xl">Dirección</Label>
                            {cliente.domicilios.map((domicilio, index) => (
                                <div key={index} className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`calle-${index}`}>Calle<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Input id={`calle-${index}`} value={domicilio.calle}
                                                   onChange={(event) => handleDomicilioChange(event, index)}/>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`numero-${index}`}>Número<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Input id={`numero-${index}`} value={domicilio.numero}
                                                   onChange={(event) => handleDomicilioChange(event, index)}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`cp-${index}`}>Código postal<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Input id={`cp-${index}`} value={domicilio.cp}
                                                   onChange={(event) => handleDomicilioChange(event, index)}/>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`piso-${index}`}>Piso</Label>
                                            <Input id={`piso-${index}`} value={domicilio.piso}
                                                   onChange={(event) => handleDomicilioChange(event, index)}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`nroDepto-${index}`}>Nro depto</Label>
                                            <Input id={`nroDepto-${index}`} value={domicilio.nroDepto}
                                                   onChange={(event) => handleDomicilioChange(event, index)}/>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`pais-${index}`}>País<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Select value={domicilio.localidad.provincia.pais.id}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: {
                                                            id: `domicilios.${index}.localidad.provincia.pais.id`, value
                                                        }
                                                    })}>
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar país"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paises.map(pais => (<SelectItem key={pais.id}
                                                                                     value={pais.id}>{pais.nombre}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`provincia-${index}`}>Provincia<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Select
                                                value={domicilio.localidad.provincia.id}
                                                onValueChange={(value) => handleProvinciaChange(value, index)}
                                            >
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar provincia"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provincias.map(provincia => (
                                                        <SelectItem key={provincia.id} value={provincia.id}>
                                                            {provincia.nombre}
                                                        </SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`localidad-${index}`}>Localidad<span
                                                className="text-red-500 ml-1">*</span></Label>
                                            <Select
                                                value={domicilio.localidad.id}
                                                onValueChange={(value) => handleLocalidadChange(value, index)}
                                            >
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar localidad"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredLocalidades.map(localidad => (
                                                        <SelectItem key={localidad.id} value={localidad.id}>
                                                            {localidad.nombre}
                                                        </SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSaveChanges()}
                                className="bg-primary hover:bg-secondary duration-200 text-white">Guardar
                            cambios</Button>
                    </CardFooter>
                </Card>
            </div>)}
            <div className="order-2 md:order-1">
                <Tabs defaultValue="actuales">
                    <TabsList>
                        <TabsTrigger value="actuales">Pedidos actuales</TabsTrigger>
                        <TabsTrigger value="anteriores">Pedidos anteriores</TabsTrigger>
                    </TabsList>
                    <TabsContent value="actuales">
                        {currentOrders.length === 0 ? (<p className="text-center py-4">No tienes pedidos
                            actuales.</p>) : (currentOrders.map(order => (<div className="mb-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <h3 className="font-semibold">{order.sucursal.nombre}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha
                                                    del pedido: {order.fechaPedido}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="px-2 py-1 text-sm">
                                            {order.estado}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2">
                                        {order.detallePedidos.map(detalle => (
                                            <div className="flex items-center justify-between"
                                                 key={detalle.id}>
                                                <p>{detalle.cantidad}x {detalle.articulo.denominacion}</p>
                                                <p>${detalle.subTotal.toFixed(2)}</p>
                                            </div>))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total:
                                            ${order.total}</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>)))}
                    </TabsContent>
                    <TabsContent value="anteriores">
                        {previousOrders.length === 0 ? (<p className="text-center py-4">No tienes pedidos
                            anteriores.</p>) : (previousOrders.map(order => (<div className="mb-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <h3 className="font-semibold">{order.sucursal.nombre}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha
                                                    del pedido: {order.fechaPedido}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="px-2 py-1 text-sm">
                                            {order.estado}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2">
                                        {order.detallePedidos.map(detalle => (
                                            <div className="flex items-center justify-between"
                                                 key={detalle.id}>
                                                <p>{detalle.cantidad}x {detalle.articulo.denominacion}</p>
                                                <p>${detalle.subTotal.toFixed(2)}</p>
                                            </div>))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total:
                                            ${order.total}</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>)))}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
        {showExitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">¿Salir sin guardar?</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowExitModal(false)}>
                            <XIcon className="w-4 h-4"/>
                            <span className="sr-only">Cerrar</span>
                        </Button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        ¿Estás seguro de que quieres salir sin guardar los cambios?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowExitModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                setCliente(originalCliente);
                                setIsProfileEditOpen(false)
                                setShowExitModal(false)
                            }}
                            className="bg-primary hover:bg-secondary duration-200 text-white"
                        >
                            Salir sin guardar
                        </Button>
                    </div>
                </div>
            </div>)}
    </div>)
}

function XIcon(props) {
    return (<svg
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
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
    </svg>)
}