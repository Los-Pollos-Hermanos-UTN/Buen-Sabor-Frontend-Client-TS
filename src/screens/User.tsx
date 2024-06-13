

import {useEffect, useState} from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/Avatar"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card"
import { Label } from "../components/ui/Label"
import { Input } from "../components/ui/Input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/Select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { useAuth } from "../context/AuthContext";




export default function Component() {
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
    const [showExitModal, setShowExitModal] = useState(false)
    const { isLoggedIn, userId } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [currentOrders, setCurrentOrders] = useState([]);
    const [previousOrders, setPreviousOrders] = useState([]);

    useEffect(() => {
        if (isLoggedIn && userId) {
            fetch(`http://localhost:8080/pedido/cliente/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const orders = data;
                    const current = orders.filter(order => ["PENDIENTE", "RETIRAR", "PREPARACION"].includes(order.estado));
                    const previous = orders.filter(order => ["ENTREGADO", "RECHAZADO", "CANCELADO"].includes(order.estado));
                    previous.reverse()
                    current.reverse()
                    setCurrentOrders(current);
                    setPreviousOrders(previous);
                })
                .catch(error => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [isLoggedIn, userId]);


    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setProfileImage(null);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-950">
            <header className="bg-white dark:bg-gray-900 shadow">
                <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-lg font-semibold">John Doe</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">johndoe@example.com</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsProfileEditOpen(true)}>
                        Editar perfil
                    </Button>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4 md:px-6 flex-1 grid md:grid-cols-[1fr_300px] gap-8">
                {isProfileEditOpen && (
                    <div className="order-1 md:order-2 grid gap-4">
                        <Card className="relative">
                            <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="icon" onClick={() => setShowExitModal(true)}>
                                    <XIcon className="w-4 h-4" />
                                    <span className="sr-only">Cerrar</span>
                                </Button>
                            </div>
                            <CardHeader>
                                <CardTitle>Perfil</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input id="email" type="email" defaultValue="johndoe@example.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                                        <Input id="dateOfBirth" type="date" />
                                    </div>
                                    <div className="grid gap-2 ">
                                        <label htmlFor="profileImage">Imagen de perfil</label>
                                        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                                            <div
                                                className="h-20 w-20 overflow-hidden rounded-full cursor-pointer "
                                                onClick={() => document.getElementById("profileImage").click()}
                                            >
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage}
                                                        alt="Profile Image"
                                                        width={80}
                                                        height={80}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex text-sm items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                                                        Seleccionar imagen
                                                    </div>
                                                )}
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
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="street">Calle</Label>
                                            <Input id="street" defaultValue="123 Main St"/>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="number">Número</Label>
                                            <Input id="number" defaultValue="123"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="zipCode">Código postal</Label>
                                            <Input id="zipCode" defaultValue="12345"/>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="floor">Piso</Label>
                                            <Input id="floor" defaultValue="2" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="apartment">Nro depto</Label>
                                            <Input id="apartment" defaultValue="4A" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">Localidad</Label>
                                            <Select>
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar localidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="anytown">Anytown</SelectItem>
                                                    <SelectItem value="othertown">Othertown</SelectItem>
                                                    <SelectItem value="newcity">New City</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="state">Provincia</Label>
                                            <Select>
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar provincia" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ca">California</SelectItem>
                                                    <SelectItem value="ny">New York</SelectItem>
                                                    <SelectItem value="tx">Texas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="country">País</Label>
                                            <Select>
                                                <SelectTrigger className="text-gray-500 dark:text-gray-400">
                                                    <SelectValue placeholder="Seleccionar país" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="usa">Estados Unidos</SelectItem>
                                                    <SelectItem value="can">Canadá</SelectItem>
                                                    <SelectItem value="mex">México</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Guardar cambios</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
                <div className="order-2 md:order-1">
                    <Tabs defaultValue="actuales">
                        <TabsList>
                            <TabsTrigger value="actuales">Pedidos actuales</TabsTrigger>
                            <TabsTrigger value="anteriores">Pedidos anteriores</TabsTrigger>
                        </TabsList>
                        <TabsContent value="actuales">
                            {currentOrders.length === 0 ? (
                                <p className="text-center py-4">No tienes pedidos actuales.</p>
                            ) : (
                                currentOrders.map(order => (
                                    <div className="mb-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <h3 className="font-semibold">{order.sucursal.nombre}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha del pedido: {order.fechaPedido}</p>
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
                                                <div className="flex items-center justify-between" key={detalle.id}>
                                                    <p>{detalle.cantidad}x {detalle.articulo.denominacion}</p>
                                                    <p>${detalle.subTotal.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total: ${order.total}</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                                    </div>
                                ))
                            )}
                        </TabsContent>
                        <TabsContent value="anteriores">
                            {previousOrders.length === 0 ? (
                                <p className="text-center py-4">No tienes pedidos actuales.</p>
                            ) : (
                                previousOrders.map(order => (
                                    <div className="mb-4">
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <h3 className="font-semibold">{order.sucursal.nombre}</h3>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha del pedido: {order.fechaPedido}</p>
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
                                                        <div className="flex items-center justify-between" key={detalle.id}>
                                                            <p>{detalle.cantidad}x {detalle.articulo.denominacion}</p>
                                                            <p>${detalle.subTotal.toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total: ${order.total}</p>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                ))
                            )}
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
                                <XIcon className="w-4 h-4" />
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
                                    setIsProfileEditOpen(false)
                                    setShowExitModal(false)
                                }}
                            >
                                Salir sin guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function XIcon(props) {
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
    )
}