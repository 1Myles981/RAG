import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { graph3DNodes, graph3DLinks, graphGroupColors } from '../mockData.js';

function createLabelSprite(label, type) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 116;

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '700 22px "Microsoft YaHei", sans-serif';
  context.fillStyle = '#17313a';
  context.textAlign = 'center';
  context.fillText(label, 128, 48);
  context.font = '700 16px "Microsoft YaHei", sans-serif';
  context.fillStyle = '#0f9689';
  context.fillText(type, 128, 78);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.12, 0.52, 1);
  sprite.renderOrder = 10;

  return sprite;
}

export default function SourceGraph3D({ onOpenNode, language }) {
  const mountRef = useRef(null);
  const onOpenNodeRef = useRef(onOpenNode);

  useEffect(() => {
    onOpenNodeRef.current = onOpenNode;
  }, [onOpenNode]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.5, 11.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 16;
    controls.rotateSpeed = 0.8;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-3, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x7dd3fc, 2.4, 16);
    fillLight.position.set(0, -2, 6);
    scene.add(fillLight);

    const group = new THREE.Group();
    group.rotation.x = 0.08;
    group.rotation.y = -0.32;
    group.scale.setScalar(1.45);
    scene.add(group);

    const nodeById = new Map();
    const sphereGeometry = new THREE.SphereGeometry(0.22, 32, 32);

    graph3DNodes.forEach((node) => {
      const color = graphGroupColors[node.group];
      const material = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.34,
        metalness: 0.06,
        clearcoat: 0.55,
        emissive: color,
        emissiveIntensity: node.group === 'evidence' ? 0.12 : 0.08
      });

      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(...node.position);
      sphere.userData.sourceId = node.id;
      group.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 32, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.12,
          depthWrite: false
        })
      );
      halo.position.copy(sphere.position);
      halo.userData.sourceId = node.id;
      group.add(halo);

      const label = createLabelSprite(node.label[language] || node.label.zh, node.type[language] || node.type.zh);
      label.position.set(node.position[0], node.position[1] - 0.45, node.position[2]);
      label.userData.sourceId = node.id;
      group.add(label);

      nodeById.set(node.id, { sphere, halo, label, position: sphere.position });
    });

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x98f7d2,
      transparent: true,
      opacity: 0.64
    });
    const linkGlowMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28
    });

    graph3DLinks.forEach(([from, to]) => {
      const start = nodeById.get(from)?.position;
      const end = nodeById.get(to)?.position;

      if (!start || !end) {
        return;
      }

      const points = [start.clone(), end.clone()];

      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), linkMaterial);
      group.add(line);

      const glow = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), linkGlowMaterial);
      glow.scale.setScalar(1.002);
      group.add(glow);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clickableNodes = [...nodeById.values()].flatMap(({ sphere, halo, label }) => [sphere, halo, label]);
    let pointerDown = null;

    const updatePointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pickNode = () => {
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickableNodes, false)[0]?.object;
    };

    const handlePointerDown = (event) => {
      pointerDown = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event) => {
      updatePointer(event);
      renderer.domElement.style.cursor = pickNode() ? 'pointer' : 'grab';
    };

    const handlePointerUp = (event) => {
      updatePointer(event);
      const movement = pointerDown
        ? Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y)
        : 0;
      pointerDown = null;

      if (movement > 5) {
        return;
      }

      const pickedNode = pickNode();
      const sourceId = pickedNode?.userData.sourceId;

      if (sourceId) {
        onOpenNodeRef.current(sourceId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) {
              material.map.dispose();
            }
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [language]);

  return <div className="rag-graph-3d" ref={mountRef} role="img" aria-label="可拖拽旋转的来源文件三维图谱" />;
}
