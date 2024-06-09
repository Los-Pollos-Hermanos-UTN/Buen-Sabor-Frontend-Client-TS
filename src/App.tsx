import React from "react";
import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/shared/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";
import Carrito from "./screens/Carrito";
import Menu from "./screens/Menu";
import Hero from "./screens/Hero";

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
					<ToastContainer />
					<Routes>
						<Route path="/" element={<Hero />} />
						<Route path="/carrito" element={<Carrito />} />
						<Route path="/menu" element={<Menu />} />{" "}
					</Routes>
					<Footer />
				</GlobalProvider>
			</AuthProvider>
		</div>
	);
};

export default App;
