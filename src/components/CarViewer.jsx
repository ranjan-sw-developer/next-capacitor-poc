"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function CarModel({ url }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  const initializedRef = useRef(false);

  // Clone and prepare the model immediately using useMemo
  const model = useMemo(() => {
    if (!scene) return null;

    const clonedModel = scene.clone();

    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(clonedModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    clonedModel.position.x = -center.x;
    clonedModel.position.y = -center.y;
    clonedModel.position.z = -center.z;

    // Scale to fit in view
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 15;
    const scale = targetSize / maxDim;
    clonedModel.scale.setScalar(scale);

    return clonedModel;
  }, [scene]);

  useEffect(() => {
    if (!initializedRef.current && model) {
      // Calculate bounding box for camera positioning
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Position camera to view the model properly
      const distance = maxDim * 1.5;
      camera.position.set(distance, distance * 0.5, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      initializedRef.current = true;
    }
  }, [model, camera]);

  // Reset initialization flag when URL changes
  useEffect(() => {
    initializedRef.current = false;
  }, [url]);

  return model ? <primitive object={model} /> : null;
}

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
}

function ClickHandler({ onPartClick }) {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const partNameMap = {
      wolf_gray: "Body",
      windows: "Window",
      plastic_matte_primary: "Plastic Trim",
      silverskidrear: "Skid Plate",
      brakelightsglass: "Brake Light",
      headlights: "Headlight",
      taillights: "Tail Light",
      bumper: "Bumper",
      hood: "Bonnet",
      door: "Door",
      mirror: "Mirror",
      wheel: "Wheel",
      tire: "Tire",
      grille: "Grille",
      roof: "Roof",
      trunk: "Trunk",
      fender: "Fender",
    };

    function onClick(event) {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const part = intersects[0].object;
        const fullName = part.name.toLowerCase();

        // Get the world position of the clicked part
        const worldPos = new THREE.Vector3();
        part.getWorldPosition(worldPos);

        let friendlyName = "Car Part";
        let basePartName = null;

        // First, identify the base part type
        for (const [key, value] of Object.entries(partNameMap)) {
          if (fullName.includes(key)) {
            basePartName = value;
            break;
          }
        }

        // Enhance with positional info for certain parts
        if (basePartName) {
          friendlyName = enhancePartName(basePartName, worldPos, fullName);
        }

        onPartClick(friendlyName);
      }
    }

    function enhancePartName(baseName, position, fullName) {
      const x = position.x;
      const z = position.z;

      // Determine left/right (x-axis: negative = left, positive = right)
      const side = x < -0.5 ? "Left" : x > 0.5 ? "Right" : "";

      // Determine front/rear (z-axis: positive = front, negative = rear)
      const frontRear = z > 0.5 ? "Front" : z < -0.5 ? "Rear" : "";

      // Apply positional naming to specific parts
      switch (baseName) {
        case "Door":
          return side ? `${frontRear} ${side} Door`.trim() : "Door";
        case "Window":
          if (frontRear && side) return `${frontRear} ${side} Window`;
          if (frontRear) return `${frontRear} Windshield`;
          return side ? `${side} Window` : "Window";
        case "Mirror":
          return side ? `${side} Mirror` : "Mirror";
        case "Wheel":
        case "Tire":
          return side && frontRear
            ? `${frontRear} ${side} ${baseName}`
            : baseName;
        case "Fender":
          return side && frontRear ? `${frontRear} ${side} Fender` : baseName;
        case "Headlight":
          return side ? `${side} Headlight` : "Headlight";
        case "Tail Light":
        case "Brake Light":
          return side ? `${side} ${baseName}` : baseName;
        case "Bumper":
          return frontRear ? `${frontRear} Bumper` : "Bumper";
        default:
          return baseName;
      }
    }

    gl.domElement.addEventListener("click", onClick);
    return () => gl.domElement.removeEventListener("click", onClick);
  }, [camera, scene, gl, onPartClick]);

  return null;
}

export default function CarViewer({ carType, onPartClick }) {
  const modelUrl = `/models/${carType}.glb`;

  return (
    <Canvas
      key={carType}
      camera={{ position: [5, 2, 5], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <OrbitControls enableZoom={true} minDistance={2} maxDistance={20} />
      <Suspense fallback={<LoadingSpinner />}>
        <CarModel url={modelUrl} />
      </Suspense>
      <ClickHandler onPartClick={onPartClick} />
    </Canvas>
  );
}
