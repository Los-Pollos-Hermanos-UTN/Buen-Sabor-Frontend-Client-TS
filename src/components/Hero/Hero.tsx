import { Link } from "react-router-dom";
import Vector from "../../assets/vector3.png";
import Banner from "../Banner/Banner";
import { Button } from "../ui/Button";
import PromotionsSection from "../Promotions/PromotionsSection";

const Hero = () => {
	return (
		<>
			<div
				className="min-h-[550px] sm:min-h-[600px] bg-gray-100 flex justify-center items-center duration-200 sm:bg-cover sm:bg-right"
				style={{ backgroundImage: `url(${Vector})` }}
			>
				<div className="container pb-8 sm:pb-0">
					<div className="grid grid-cols-1 sm:grid-cols-2">
						{/* text content section */}
						<div
							data-aos="zoom-out"
							data-aos-duration="400"
							data-aos-once="true"
							className="flex flex-col justify-center gap-4 sm:pt-0 text-center sm:text-left order-1 sm:order-1 mt-10 sm:mt-0 font-poppins"
						>
							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-lobster">
								Bienvenido al{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-b from-primary to-secondary">
									Buen Sabor
								</span>
							</h1>
							<p className="text-sm">
								¡En El Buen Sabor, creemos que disfrutar de comida rápida no
								significa sacrificar el sabor ni la calidad! Porque sabemos que
								cada bocado cuenta, nos esforzamos por ofrecerte una experiencia
								que satisfaga tus antojos y te haga sonreír con cada mordisco.
							</p>
							<div>
								<Link to="/menu">
									<Button className="bg-primary hover:bg-secondary duration-200 text-white py-2 px-4">
										Ir al Menu
									</Button>
								</Link>
							</div>
						</div>
						<div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-2 sm:order-2"></div>
					</div>
				</div>
			</div>
			<PromotionsSection />
			<Banner />
		</>
	);
};

export default Hero;
