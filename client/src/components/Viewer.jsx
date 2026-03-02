import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, Html } from '@react-three/drei';

function Model({ url, wireframe, matColor, hotspots }) {
    const { scene } = useGLTF(url);

    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.wireframe = wireframe;
            if (matColor) child.material.color.set(matColor);
        }
    });

    return (
        <group>
            <primitive object={scene} />
            {/* Optional: Hotspots/Annotations */}
            {hotspots.map((h, i) => (
                <Html key={i} position={h.pos}>
                    <div style={{ background: 'red', color: 'white', padding: '2px 5px', borderRadius: '50%', fontSize: '10px' }}>
                        {h.text}
                    </div>
                </Html>
            ))}
        </group>
    );
}

export default function Viewer({ modelUrl, bgColor, wireframe, matColor, useHDRI, hotspots }) {
    return (
        <div style={{ width: '100%', height: '500px', background: bgColor, borderRadius: '15px' }}>
            <Canvas shadows camera={{ position: [0, 0, 4] }}>
                <Suspense fallback={<Html>Loading Model...</Html>}>
                    {useHDRI ? <Environment preset="apartment" /> : <ambientLight intensity={0.7} />}
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <Stage environment="city" intensity={0.5}>
                        {modelUrl && <Model url={modelUrl} wireframe={wireframe} matColor={matColor} hotspots={hotspots} />}
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault /> {/* Mandatory: Rotate, Zoom, Pan */}
            </Canvas>
        </div>
    );
}