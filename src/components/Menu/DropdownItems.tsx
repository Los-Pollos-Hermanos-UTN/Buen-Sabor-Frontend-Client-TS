import React from "react";
import { DropdownMenuItem } from "../ui/DropdownMenu";
import { Categoria } from "../../types/Categoria";
import ListIcon from "../Icons/ListIcon";

interface DropdownMenuItemsProps {
	categorias: Categoria[];
	handleCategoryClick: (id: number | null) => void;
	selectedCategory: number | null;
	indent?: number;
}

const DropdownItems: React.FC<DropdownMenuItemsProps> = ({
															 categorias,
															 handleCategoryClick,
															 selectedCategory,
															 indent = 0,
														 }) => {
	return (
		<>
			{categorias.map((categoria) => (
				<React.Fragment key={categoria.id}>
					<DropdownMenuItem
						className={`flex items-center space-x-1 w-full md:w-auto ${
							selectedCategory === categoria.id ? "bg-gray-200" : ""
						}`}
						style={{ paddingLeft: `${indent * 16}px` }}
						onClick={() => handleCategoryClick(categoria.id)}
					>
						<ListIcon className="w-5 h-5" />
						<span>{categoria.denominacion}</span>
					</DropdownMenuItem>
					{categoria.subCategorias && categoria.subCategorias.length > 0 && (
						<DropdownItems
							categorias={categoria.subCategorias}
							handleCategoryClick={handleCategoryClick}
							selectedCategory={selectedCategory}
							indent={indent + 1}
						/>
					)}
				</React.Fragment>
			))}
		</>
	);
};

export default DropdownItems;
