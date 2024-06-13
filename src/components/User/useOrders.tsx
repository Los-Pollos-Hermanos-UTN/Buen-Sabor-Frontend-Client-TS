import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const useOrders = () => {
    const { userId } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/pedido/cliente/${userId}`);
                if (!response.ok) {
                    throw new Error("Error fetching orders");
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    return { orders, loading, error };
};

export default useOrders;
