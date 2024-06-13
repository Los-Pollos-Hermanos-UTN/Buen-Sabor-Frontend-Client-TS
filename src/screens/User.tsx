/**
 * v0 by Vercel.
 * @see https://v0.dev/t/BH32ItCQx6F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "../components/ui/Button.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
    const [showExitModal, setShowExitModal] = useState(false)
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
                <div>
                    <Tabs defaultValue="previous">
                        <TabsList>
                            <TabsTrigger value="previous">Pedidos anteriores</TabsTrigger>
                            <TabsTrigger value="current">Pedidos actuales</TabsTrigger>
                        </TabsList>
                        <TabsContent value="previous">
                            <div className="grid gap-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/placeholder.svg"
                                                    width={48}
                                                    height={48}
                                                    alt="Logo del restaurante"
                                                    className="rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-semibold">Acme Burgers</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">15 de junio de 2023</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="px-2 py-1 text-sm">
                                                Entregado
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <p>1x Cheeseburger</p>
                                                <p>$9.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>2x Papas fritas</p>
                                                <p>$4.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>1x Refresco</p>
                                                <p>$2.99</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total: $17.97</p>
                                            <Button variant="outline" size="sm">
                                                Volver a pedir
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/placeholder.svg"
                                                    width={48}
                                                    height={48}
                                                    alt="Logo del restaurante"
                                                    className="rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-semibold">Sushi Delight</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">30 de mayo de 2023</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="px-2 py-1 text-sm">
                                                Entregado
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <p>1x California Roll</p>
                                                <p>$12.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>2x Sopa de miso</p>
                                                <p>$4.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>1x Té verde</p>
                                                <p>$2.99</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total: $20.97</p>
                                            <Button variant="outline" size="sm">
                                                Volver a pedir
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="current">
                            <div className="grid gap-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/placeholder.svg"
                                                    width={48}
                                                    height={48}
                                                    alt="Logo del restaurante"
                                                    className="rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-semibold">Acme Burgers</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">23 de junio de 2023</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="px-2 py-1 text-sm">
                                                Preparando
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <p>1x Cheeseburger</p>
                                                <p>$9.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>2x Papas fritas</p>
                                                <p>$4.99</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p>1x Refresco</p>
                                                <p>$2.99</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total: $17.97</p>
                                            <Button variant="outline" size="sm">
                                                Cancelar
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="grid gap-4">
                    {isProfileEditOpen && (
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="profileImage">Imagen de perfil</Label>
                                        <Input id="profileImage" type="file" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Textarea id="address" defaultValue="123 Main St, Anytown USA" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Guardar cambios</Button>
                            </CardFooter>
                        </Card>
                    )}
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