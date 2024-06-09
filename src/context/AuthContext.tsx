import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { User } from "../types/User";

interface AuthContextProps {
	isLoggedIn: boolean;
	username: string | null;
	role: string | null;
	userId: number | null;
	login: (user: User) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
		!!localStorage.getItem("user")
	);
	const [username, setUsername] = useState<string | null>(
		localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user")!).nombreUsuario
			: null
	);
	const [role, setRole] = useState<string | null>(
		localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user")!).rol
			: null
	);
	const [userId, setUserId] = useState<number | null>(
		localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user")!).id
			: null
	);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const user = JSON.parse(storedUser);
			setUsername(user.nombreUsuario);
			setRole(user.rol);
			setUserId(user.id);
			setIsLoggedIn(true);
		}
	}, []);

	const login = (user: User) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUsername(user.nombreUsuario);
		setRole(user.rol);
		setUserId(user.id);
		setIsLoggedIn(true);
	};

	const logout = () => {
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUsername(null);
		setRole(null);
		setUserId(null);
	};

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, username, role, userId, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
