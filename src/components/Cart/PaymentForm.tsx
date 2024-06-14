import {useContext, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Button} from "../ui/Button.tsx";
import {ArrowRightIcon} from "lucide-react";

export const PaymentForm = ({handleCheckout}: { handleCheckout: () => void }) => {
    const {state} = useGlobalContext();
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    const handlePayment = async () => {
        const {cart} = state;

        const items = cart.map((item) => ({
            title: item.denominacion,
            quantity: item.quantity,
            currency_id: "ARS",
            unit_price: item.precioPromocional || item.precioVenta,
        }));

        const response = await fetch(
            "http://localhost:8080/mercadopago/create-preference",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items,
                }),
            }
        );

        const data = await response.json();
        if (data.preferenceId) {
            setPreferenceId(data.preferenceId);
            // Abrir la URL de pago de Mercado Pago en una nueva ventana
            window.open(`https://sandbox.mercadopago.com.ar/checkout/v1/redirect?preference-id=${data.preferenceId}`, '_blank');
        } else {
            console.error("Failed to get preferenceId:", data);
        }
    };

    return (
    <Button
        className="w-full bg-primary hover:bg-secondary"
        onClick={() => {
            handleCheckout();
            handlePayment();
        }}>
        Ir a Pagar <ArrowRightIcon className="ml-2"/>
    </Button>
)
    ;
};
