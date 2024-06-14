import React from "react";
import {Link, Route, Routes, Navigate} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/shared/Navbar";
import {AuthProvider, useAuth} from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";
import Carrito from "./screens/Carrito";
import Menu from "./screens/Menu";
import Hero from "./screens/Hero";
import User from "./screens/User.tsx";


const PrivateRoute: React.FC = () => {
	const { isLoggedIn } = useAuth();
	return isLoggedIn ? <User /> : <Navigate to="/" /> ;
};

const App: React.FC = () => {
	React.useEffect(() => {
		AOS.init({
			offset: 100,
			duration: 500,
			easing: "ease-in-sine",
			delay: 100,
		});
		AOS.refresh();
	}, []);

	return (
		<div className="bg-white duration-200">
			<AuthProvider>
				<GlobalProvider>
					<Navbar />
					<ToastContainer position={"top-left"}/>
					<Routes>
						<Route path="/" element={<Hero />} />
						<Route path="/carrito" element={<Carrito />} />
						<Route path="/menu" element={<Menu />} />{" "}
						<Route path="/profile" element={<PrivateRoute />}>
							<Route path="" element={<User />} />
						</Route>
					</Routes>
					<Footer />
				</GlobalProvider>
			</AuthProvider>
		</div>
	);
};

export default App;
