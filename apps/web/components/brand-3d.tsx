"use client";

import { type JSX, useMemo } from "react";
import * as THREE from "three";

export function useBrandMetalMaterial(color: number, emissive: number): THREE.MeshStandardMaterial {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.38,
        roughness: 0.24,
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.2,
      }),
    [color, emissive],
  );
}

export function useBrandGlassMaterial(color: number, emissive: number): THREE.MeshPhysicalMaterial {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.08,
        roughness: 0.12,
        transmission: 0.2,
        thickness: 0.45,
        ior: 1.16,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.14,
      }),
    [color, emissive],
  );
}

export function useBrandSurfaceMaterial(
  color: number,
  emissive: number,
  emissiveIntensity = 0.18,
): THREE.MeshStandardMaterial {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.16,
        roughness: 0.54,
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
      }),
    [color, emissive, emissiveIntensity],
  );
}

export function useBrandParticleSystem(count = 54): [THREE.BufferGeometry, THREE.PointsMaterial] {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.1 + Math.random() * 1.7;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const palette = i % 3;
      if (palette === 0) {
        colors[i3] = 0.39;
        colors[i3 + 1] = 0.4;
        colors[i3 + 2] = 0.95;
      } else if (palette === 1) {
        colors[i3] = 0.55;
        colors[i3 + 1] = 0.36;
        colors[i3 + 2] = 0.9;
      } else {
        colors[i3] = 0.87;
        colors[i3 + 1] = 0.89;
        colors[i3 + 2] = 0.98;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    return [geometry, material];
  }, [count]);
}

export function BrandStudioLights(): JSX.Element {
  return (
    <>
      <spotLight
        position={[-4, 7, 7]}
        angle={0.5}
        penumbra={0.4}
        intensity={1.5}
        color="#f8fafc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[5, 5, 7]}
        angle={0.58}
        penumbra={0.45}
        intensity={0.78}
        color="#c4b5fd"
      />
      <spotLight
        position={[0, 4, -5]}
        angle={0.42}
        penumbra={0.35}
        intensity={0.58}
        color="#38bdf8"
      />
      <ambientLight intensity={0.62} color="#6366f1" />
      <pointLight position={[-2.5, -2, 3]} intensity={0.48} color="#8b5cf6" />
      <pointLight position={[2.8, 1.5, 4]} intensity={0.4} color="#38bdf8" />
    </>
  );
}
