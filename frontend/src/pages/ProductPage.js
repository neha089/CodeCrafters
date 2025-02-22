import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ClothingModel from "../components/ClothingModel";

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`).then((response) => {
            setProduct(response.data);
        });
    }, [id]);

    if (!product) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>{product.name}</h1>
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <ClothingModel modelUrl={product.image} />
            </Canvas>
        </div>
    );
};

export default ProductPage;
