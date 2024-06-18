import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Articulo } from "../types/Articulo";
import { Categoria } from "../types/Categoria";
import { Sucursal } from "../types/Sucursal";
import { ListIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import DropdownItems from "../components/Menu/DropdownItems";
import ArticulosSection from "../components/Menu/ArticulosSection";

const Menu: React.FC = () => {
	const { state, dispatch } = useGlobalContext();
	const { selectedSucursal } = state;

	const [sucursales, setSucursales] = useState<Sucursal[]>([]);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [promociones, setPromociones] = useState<any[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPromociones, setIsPromociones] = useState(false);

	useEffect(() => {
		fetchSucursales();
	}, []);

	useEffect(() => {
		if (selectedSucursal) {
			setIsLoading(true);
			fetchCategorias(selectedSucursal.id);
			fetchPromociones(selectedSucursal.id);
		}
	}, [selectedSucursal]);

	const fetchSucursales = async () => {
		try {
			const response = await fetch(
				"http://localhost:8080/sucursal/listByEmpresa/1"
			);
			const data = await response.json();
			setSucursales(data);
		} catch (error) {
			console.error("Error fetching sucursales:", error);
		}
	};

	const fetchCategorias = async (sucursalId: number) => {
		try {
			const response = await fetch(
				`http://localhost:8080/categoria/listBySucursal/${sucursalId}`
			);
			let data = await response.json();
			data = filterEmptyCategorias(data);
			setCategorias(data);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching categorias:", error);
			setIsLoading(false);
		}
	};

	const fetchPromociones = async (sucursalId: number) => {
		try {
			const response = await fetch(
				`http://localhost:8080/promocion/sucursal/${sucursalId}`
			);
			const data = await response.json();
			setPromociones(data);
		} catch (error) {
			console.error("Error fetching promociones:", error);
		}
	};

	const filterEmptyCategorias = (categorias: Categoria[]) => {
		return categorias.filter((categoria) => {
			const validArticulos = categoria.articulos.filter(
				(articulo) => !articulo.eliminado && articulo.precioVenta > 0
			);
			if (validArticulos.length > 0) {
				return true;
			} else if (
				categoria.subCategorias &&
				categoria.subCategorias.length > 0
			) {
				categoria.subCategorias = filterEmptyCategorias(
					categoria.subCategorias
				);
				return categoria.subCategorias.length > 0;
			}
			return false;
		});
	};

	const handleSucursalChange = (sucursal) => {
		dispatch({ type: "SET_SELECTED_SUCURSAL", payload: sucursal });
		setSelectedCategory(null);
		setIsPromociones(false);
	};

	const handleCategoryClick = (categoryId: number | null) => {
		setSelectedCategory(categoryId);
		setIsPromociones(false);
	};

	const handlePromocionesClick = () => {
		setSelectedCategory(null);
		setIsPromociones(true);
	};

	const flattenCategorias = (categorias: Categoria[]): Categoria[] => {
		return categorias.reduce((acc, categoria) => {
			acc.push(categoria);
			if (categoria.subCategorias && categoria.subCategorias.length > 0) {
				acc = acc.concat(flattenCategorias(categoria.subCategorias));
			}
			return acc;
		}, [] as Categoria[]);
	};

	const getArticulos = (
		categorias: Categoria[],
		categoryId: number | null
	): Articulo[] => {
		const allCategorias = flattenCategorias(categorias);
		let selectedCategorias = [];

		if (categoryId !== null) {
			const getAllSubcategories = (categoriaId: number | null) => {
				const subCategorias = allCategorias.filter(
					(categoria) => categoria.padreId === categoriaId
				);
				subCategorias.forEach((subCategoria) => {
					selectedCategorias.push(subCategoria);
					getAllSubcategories(subCategoria.id);
				});
			};

			const mainCategory = allCategorias.find(
				(categoria) => categoria.id === categoryId
			);
			if (mainCategory) {
				selectedCategorias.push(mainCategory);
				getAllSubcategories(mainCategory.id);
			}
		} else {
			selectedCategorias = allCategorias;
		}
		return selectedCategorias.flatMap((categoria) =>
			categoria.articulos
				.filter((articulo) => !articulo.eliminado && articulo.precioVenta > 0)
				.map((articulo) => ({
					...articulo,
					categoriaDenominacion: categoria.denominacion,
				}))
		);
	};

	const categoriasPrincipales = [
		{ id: null, denominacion: "Todo" },
		...categorias.filter(
			(categoria) =>
				!categoria.padreId &&
				(categoria.articulos.length > 0 ||
					categoria.subCategorias.some((sub) => sub.articulos.length > 0))
		),
	];

	const articulos = isPromociones ? [] : getArticulos(categorias, selectedCategory);

	return (
		<div className="bg-white p-6 md:p-8 lg:p-10">
			<div className="flex flex-col md:flex-row justify-between items-center mb-6">
				<div className="flex w-full flex-col md:flex-row justify-between items-center mb-6">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								className="flex items-center space-x-1 w-full md:w-auto mb-4 md:mb-0 md:mr-4"
							>
								<ListIcon className="w-5 h-5"/>
								<span>Sucursales</span>
								<ChevronDownIcon className="w-4 h-4"/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-full md:w-auto max-h-64 overflow-y-auto">
							{sucursales.map((sucursal) => (
								<DropdownMenuItem key={sucursal.id} onSelect={() => handleSucursalChange(sucursal)}>
									{sucursal.nombre}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>

					</DropdownMenu>

					<div
						className="flex w-full md:w-auto flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="secondary"
									className="flex items-center space-x-1 w-full md:w-auto"
								>
									<ListIcon className="w-5 h-5"/>
									<span>Categorías</span>
									<ChevronDownIcon className="w-4 h-4"/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-full md:w-auto max-h-64 overflow-y-auto">
								<DropdownItems
									categorias={categoriasPrincipales as Categoria[]}
									handleCategoryClick={handleCategoryClick}
									selectedCategory={selectedCategory}
								/>
							</DropdownMenuContent>
						</DropdownMenu>

						{promociones.length > 0 && (
							<Button
								variant="secondary"
								className="w-full md:w-auto"
								onClick={handlePromocionesClick}
							>
								Ver Promociones
							</Button>
						)}
					</div>
				</div>
			</div>

			{!selectedSucursal ? (
				<div className="w-full flex justify-center items-center" style={{height: '50vh'}}>
					Seleccione una Sucursal
				</div>
			) : isLoading ? (
				<div className="w-full flex justify-center items-center" style={{height: '50vh'}}>
					Cargando...
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{isPromociones ? (
						<ArticulosSection
							articulos={promociones.map((promocion) => ({
								...promocion,
								isPromocion: true,
							}))}
							dispatch={dispatch}
						/>
					) : (
						<ArticulosSection articulos={articulos} dispatch={dispatch}/>
					)}
				</div>
			)}
		</div>


	);
};

export default Menu;

