import React, {
	createContext,
	useReducer,
	useContext,
	ReactNode,
	Dispatch,
} from "react";
import { Action, State } from "../types/Carrito";

const initialState: State = {
	cart: [],
	user: null,
	selectedSucursal: null,
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_SELECTED_SUCURSAL":
			return {
				...state,
				selectedSucursal: action.payload,
				cart: [],
			};
		case "CLEAR_CART":
			return {
				...state,
				cart: [],
			};
		case "ADD_TO_CART":
			const item = state.cart.find(
				(cartItem) => cartItem.id === action.payload.id
			);
			if (item) {
				return {
					...state,
					cart: state.cart.map((cartItem) =>
						cartItem.id === action.payload.id
							? { ...cartItem, quantity: cartItem.quantity + 1 }
							: cartItem
					),
				};
			}
			return {
				...state,
				cart: [...state.cart, { ...action.payload, quantity: 1 }],
			};
		case "REMOVE_FROM_CART":
			return {
				...state,
				cart: state.cart.filter(
					(cartItem) => cartItem.id !== action.payload.id
				),
			};
		case "UPDATE_CART_QUANTITY":
			return {
				...state,
				cart: state.cart.map((cartItem) =>
					cartItem.id === action.payload.id
						? { ...cartItem, quantity: action.payload.quantity }
						: cartItem
				),
			};
		case "SET_USER":
			return { ...state, user: action.payload };
		default:
			return state;
	}
};

interface GlobalContextProps {
	state: State;
	dispatch: Dispatch<Action>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<GlobalContext.Provider value={{ state, dispatch }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = (): GlobalContextProps => {
	const context = useContext(GlobalContext);
	if (context === undefined) {
		throw new Error("useGlobalContext must be used within a GlobalProvider");
	}
	return context;
};
