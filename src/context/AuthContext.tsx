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
	const [username, setUsername] = useState(null);
	const [role, setRole] = useState(null);
	const [userId, setUserId] = useState(null);

	const fetchUserDetails = async (id: any) => {
		try {
			const response = await fetch(
				`http://localhost:8080/cliente/${id}`
			);
			if (!response.ok) {
				throw new Error("Error fetching user details");
			}
			const data = await response.json();
			return data.nombre;
		} catch (error) {
			console.error("Error:", error);
			return null;
		}
	};

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const user = JSON.parse(storedUser);
			setRole(user.rol);
			setUserId(user.id);
			fetchUserDetails(user.id).then((nombre) => {
				setUsername(nombre);
				setIsLoggedIn(true);
			});
		}
	}, []);

	// TODO: fix type
	const login = async (user: User) => {
		localStorage.setItem("user", JSON.stringify(user));
		const nombre = await fetchUserDetails(user.id);
		setUsername(nombre);
		setRole(user.rol as any);
		setUserId(user.id as any);
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
