import React from "react";
import { useGLTF } from "@react-three/drei";

const ClothingModel = ({ modelUrl }) => {
    const { scene } = useGLTF(modelUrl);
    return <primitive object={scene} scale={2} />;
};

export default ClothingModel;
