import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, Html, ContactShadows } from '@react-three/drei';
import axios from 'axios';

// --- 3D Model Component with 6-Axis Hotspots ---
function Model({ url, wireframe, matColor, hotspots }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = wireframe;
        if (matColor) child.material.color.set(matColor);
        child.material.needsUpdate = true;
      }
    });
  }, [scene, wireframe, matColor]);

  return (
    <group>
      <primitive object={scene} />

      {/* Dynamic Hotspots for All Angles */}
      {hotspots.map((spot, index) => (
        <Html key={index} position={spot.pos} distanceFactor={10}>
          <div className="hotspot-tag">{spot.text}</div>
        </Html>
      ))}
    </group>
  );
}

// --- Main Premium App ---
export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [bgColor, setBgColor] = useState('#0f172a'); // Deep Dark Blue
  const [wireframe, setWireframe] = useState(false);
  const [matColor, setMatColor] = useState('#ffffff');
  const [hdri, setHdri] = useState('studio');

  // All Professional Viewpoints
  const [hotspots] = useState([
    { pos: [0, 1.5, 0], text: "Top View" },
    { pos: [0, -1.2, 0], text: "Bottom Base" },
    { pos: [1.5, 0, 0], text: "Right Side" },
    { pos: [-1.5, 0, 0], text: "Left Side" },
    { pos: [0, 0, 1.5], text: "Front Face" },
    { pos: [0, 0, -1.5], text: "Back View" }
  ]);

  const hdriPresets = ['studio', 'city', 'apartment', 'night', 'sunset', 'warehouse', 'forest'];

  useEffect(() => {
    axios.get('https://mern-3d-viewer.onrender.com/api/settings').then(res => {
      if (res.data.modelUrl) {
        setModelUrl(res.data.modelUrl);
        setBgColor(res.data.bgColor || '#0f172a');
        setWireframe(res.data.wireframe);
        setMatColor(res.data.matColor);
        setHdri(res.data.hdri || 'studio');
      }
    });
  }, []);

  const handleUpload = async (e) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0]);
    const res = await axios.post('https://mern-3d-viewer.onrender.com/api/upload', fd);
    setModelUrl(res.data.url);
  };

  const saveConfig = () => {
    axios.post('https://mern-3d-viewer.onrender.com/api/settings', { modelUrl, bgColor, wireframe, matColor, hdri });
    alert("Model Saved .");
  };

  return (
    <div className="main-layout" style={{ background: bgColor }}>

      {/* Premium Glass Sidebar */}
      <div className="glass-sidebar">
        <div className="brand">
          <div className="logo-dot"></div>
          <h2>QULEEP 3D PRO</h2>
        </div>

        <div className="control-box">
          <label>Upload GLB Model</label>
          <input type="file" onChange={handleUpload} className="custom-file-input" />
        </div>

        <div className="control-box">
          <label>Background Color</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="color-btn" />
        </div>

        <div className="control-box">
          <label> Material Color</label>
          <input type="color" value={matColor} onChange={e => setMatColor(e.target.value)} className="color-btn" />
        </div>

        <div className="control-box">
          <label>HDRI Mode</label>
          <select value={hdri} onChange={e => setHdri(e.target.value)} className="modern-select">
            {hdriPresets.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="control-box toggle">
          <label> Wireframe</label>
          <input type="checkbox" checked={wireframe} onChange={() => setWireframe(!wireframe)} className="switch" />
        </div>

        <button onClick={saveConfig} className="premium-save">Save</button>
      </div>

      {/* Main 3D Stage */}
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [3, 3, 3], fov: 45 }}>
          <Suspense fallback={<Html center><div className="loading">Waking up Engine...</div></Html>}>
            <Environment preset={hdri} />
            <Stage intensity={0.7} environment={hdri} contactShadow={true}>
              {modelUrl && <Model url={modelUrl} wireframe={wireframe} matColor={matColor} hotspots={hotspots} />}
            </Stage>
            <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={2.5} />
          </Suspense>
          <OrbitControls makeDefault minDistance={2} maxDistance={10} />
        </Canvas>
      </div>

      {/* Custom Global Styles */}
      <style>{`
        .main-layout { display: flex; height: 100vh; font-family: 'Inter', sans-serif; overflow: hidden; transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-sidebar { 
          width: 340px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(25px); 
          padding: 40px 30px; border-right: 1px solid rgba(255,255,255,0.1); 
          display: flex; flex-direction: column; gap: 30px; z-index: 50; box-shadow: 20px 0 50px rgba(0,0,0,0.3);
        }
        .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .logo-dot { width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 15px #3b82f6; }
        .brand h2 { font-size: 20px; font-weight: 800; color: white; letter-spacing: 1px; margin: 0; }
        .control-box { display: flex; flex-direction: column; gap: 10px; }
        .control-box.toggle { flex-direction: row; justify-content: space-between; align-items: center; }
        label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 700; }
        .color-btn { width: 100%; height: 40px; border: none; border-radius: 10px; cursor: pointer; background: rgba(255,255,255,0.05); transition: 0.3s; }
        .color-btn:hover { background: rgba(255,255,255,0.1); }
        .modern-select { background: #1e293b; color: white; border: 1px solid #334155; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .premium-save { 
          margin-top: auto; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
          color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 800; 
          cursor: pointer; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4); transition: 0.4s;
        }
        .premium-save:hover { transform: scale(1.02); filter: brightness(1.1); }
        .canvas-container { flex-grow: 1; position: relative; }
        .hotspot-tag { 
          background: white; color: black; padding: 4px 12px; border-radius: 30px; 
          font-size: 10px; font-weight: 900; text-transform: uppercase; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.4); border: 2px solid #3b82f6;
          pointer-events: none; white-space: nowrap;
        }
        .loading { font-size: 20px; font-weight: 800; color: #3b82f6; letter-spacing: 2px; }
        .switch { width: 40px; height: 20px; cursor: pointer; }
      `}</style>
    </div>
  );
}