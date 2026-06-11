(() => {
  const hasThree = () => Boolean(globalThis.THREE);

  function rendererFor(canvas) {
    if (!canvas || !hasThree()) return null;
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      return renderer;
    } catch (error) {
      canvas.closest(".hero-3d, .match-3d")?.classList.add("scene-unavailable");
      return null;
    }
  }

  function bindDrag(target, state) {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    target.addEventListener("pointerdown", (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      target.setPointerCapture?.(event.pointerId);
    });
    target.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      state.rotationY += (event.clientX - lastX) * 0.006;
      state.rotationX += (event.clientY - lastY) * 0.004;
      state.rotationX = Math.max(-0.8, Math.min(0.8, state.rotationX));
      lastX = event.clientX;
      lastY = event.clientY;
    });
    target.addEventListener("pointerup", () => { dragging = false; });
    target.addEventListener("pointercancel", () => { dragging = false; });
  }

  function resize(renderer, camera, canvas) {
    const box = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(box.width));
    const height = Math.max(1, Math.floor(box.height));
    const needsResize = canvas.width !== Math.floor(width * renderer.getPixelRatio()) || canvas.height !== Math.floor(height * renderer.getPixelRatio());
    if (needsResize) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function latLonToVector(lat, lon, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function sampleRing(points, target = 46) {
    if (points.length <= target) return points;
    const step = Math.ceil(points.length / target);
    return points.filter((_, index) => index % step === 0 || index === points.length - 1);
  }

  function ringCenter(points) {
    const total = points.reduce((acc, [lat, lon]) => {
      acc.lat += lat;
      acc.lon += lon;
      return acc;
    }, { lat: 0, lon: 0 });
    return [total.lat / points.length, total.lon / points.length];
  }

  function lonSpread(points) {
    const lons = points.map(([, lon]) => lon);
    return Math.max(...lons) - Math.min(...lons);
  }

  function arcVectors(fromLat, fromLon, toLat, toLon, radius = 1.72) {
    const start = latLonToVector(fromLat, fromLon, radius);
    const end = latLonToVector(toLat, toLon, radius);
    const points = [];
    for (let i = 0; i <= 34; i += 1) {
      const t = i / 34;
      const point = start.clone().lerp(end, t).normalize();
      const lift = Math.sin(Math.PI * t) * 0.42;
      point.multiplyScalar(radius + lift);
      points.push(point);
    }
    return points;
  }

  function cityPoints() {
    return [
      ["Mexico City", 19.4326, -99.1332, 10],
      ["Guadalajara", 20.6597, -103.3496, 4],
      ["Monterrey", 25.6866, -100.3161, 4],
      ["Toronto", 43.6532, -79.3832, 6],
      ["Vancouver", 49.2827, -123.1207, 6],
      ["New York/New Jersey", 40.7128, -74.006, 8],
      ["Los Angeles", 34.0522, -118.2437, 8],
      ["San Francisco Bay Area", 37.7749, -122.4194, 6],
      ["Dallas", 32.7767, -96.797, 6],
      ["Houston", 29.7604, -95.3698, 6],
      ["Atlanta", 33.749, -84.388, 6],
      ["Boston", 42.3601, -71.0589, 6],
      ["Kansas City", 39.0997, -94.5786, 6],
      ["Miami", 25.7617, -80.1918, 6],
      ["Philadelphia", 39.9526, -75.1652, 6],
      ["Seattle", 47.6062, -122.3321, 6]
    ];
  }

  function continentOutlines() {
    return [
      {
        name: "North America",
        points: [[71, -156], [64, -130], [55, -123], [49, -125], [42, -124], [32, -117], [24, -110], [15, -96], [8, -83], [17, -76], [27, -82], [31, -90], [45, -75], [50, -60], [58, -64], [65, -83], [72, -102], [71, -156]]
      },
      {
        name: "South America",
        points: [[12, -79], [6, -61], [-5, -50], [-16, -38], [-30, -50], [-44, -64], [-55, -70], [-40, -74], [-18, -70], [2, -79], [12, -79]]
      },
      {
        name: "Europe",
        points: [[71, -10], [62, 20], [55, 35], [45, 30], [36, 20], [37, 0], [44, -10], [55, -6], [62, -4], [71, -10]]
      },
      {
        name: "Africa",
        points: [[35, -17], [31, 10], [23, 32], [8, 43], [-10, 40], [-25, 28], [-35, 18], [-31, 3], [-18, -14], [5, -18], [20, -17], [35, -17]]
      },
      {
        name: "Asia",
        points: [[72, 40], [64, 90], [58, 135], [42, 150], [25, 120], [12, 105], [8, 78], [20, 55], [35, 45], [50, 35], [72, 40]]
      },
      {
        name: "Australia",
        points: [[-10, 113], [-17, 145], [-32, 153], [-43, 145], [-36, 116], [-22, 112], [-10, 113]]
      },
      {
        name: "Greenland",
        points: [[83, -62], [76, -20], [66, -28], [60, -48], [68, -72], [78, -74], [83, -62]]
      }
    ];
  }

  function addGlobePolyline(root, points, radius, color, opacity, lift = 0) {
    const vectors = points.map(([lat, lon]) => latLonToVector(lat, lon, radius + lift));
    const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    root.add(line);
    return line;
  }

  function addContinentMap(root) {
    const landMaterial = new THREE.MeshBasicMaterial({
      color: 0x123f3d,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const coastMaterial = new THREE.LineBasicMaterial({ color: 0x8deee3, transparent: true, opacity: 0.72 });

    continentOutlines().forEach((continent) => {
      const center = continent.points.reduce((acc, [lat, lon]) => {
        acc.lat += lat;
        acc.lon += lon;
        return acc;
      }, { lat: 0, lon: 0 });
      center.lat /= continent.points.length;
      center.lon /= continent.points.length;
      const centerVector = latLonToVector(center.lat, center.lon, 1.575);

      const triangles = [];
      for (let i = 0; i < continent.points.length - 1; i += 1) {
        const a = latLonToVector(continent.points[i][0], continent.points[i][1], 1.578);
        const b = latLonToVector(continent.points[i + 1][0], continent.points[i + 1][1], 1.578);
        triangles.push(centerVector.x, centerVector.y, centerVector.z, a.x, a.y, a.z, b.x, b.y, b.z);
      }
      const landGeometry = new THREE.BufferGeometry();
      landGeometry.setAttribute("position", new THREE.Float32BufferAttribute(triangles, 3));
      landGeometry.computeVertexNormals();
      root.add(new THREE.Mesh(landGeometry, landMaterial));

      const coastVectors = continent.points.map(([lat, lon]) => latLonToVector(lat, lon, 1.61));
      const coastGeometry = new THREE.BufferGeometry().setFromPoints(coastVectors);
      root.add(new THREE.Line(coastGeometry, coastMaterial));
      addGlobePolyline(root, continent.points.filter((_, index) => index % 2 === 0), 1.67, 0xf2c14e, 0.18, 0.02);
    });
  }

  function normalizeRing(ring) {
    if (!Array.isArray(ring)) return [];
    return ring
      .filter((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))
      .map(([lon, lat]) => [lat, lon]);
  }

  function addGeoJsonMap(root, geojson) {
    if (!geojson?.features?.length) {
      addContinentMap(root);
      return;
    }
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x95fff3, transparent: true, opacity: 0.44 });
    const hostBorderMaterial = new THREE.LineBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.82 });
    const coastMaterial = new THREE.LineBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.13 });
    const landMaterial = new THREE.MeshBasicMaterial({
      color: 0x0c3c3d,
      transparent: true,
      opacity: 0.31,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const hostLandMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a746c,
      transparent: true,
      opacity: 0.48,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const landDots = [];
    const landTriangles = [];
    const hostTriangles = [];
    const hostCodes = new Set(["MEX", "USA", "CAN"]);

    geojson.features.forEach((feature) => {
      const geometry = feature.geometry;
      const isHost = hostCodes.has(feature.properties?.ADM0_A3);
      const polygons = geometry?.type === "Polygon" ? [geometry.coordinates] : geometry?.type === "MultiPolygon" ? geometry.coordinates : [];
      polygons.forEach((polygon) => {
        const exterior = normalizeRing(polygon[0]);
        if (exterior.length < 3) return;
        const borderVectors = exterior.map(([lat, lon]) => latLonToVector(lat, lon, 1.615));
        const borderGeometry = new THREE.BufferGeometry().setFromPoints(borderVectors);
        root.add(new THREE.Line(borderGeometry, isHost ? hostBorderMaterial : borderMaterial));

        if (lonSpread(exterior) < 220) {
          const sampled = sampleRing(exterior, isHost ? 88 : 46);
          const [centerLat, centerLon] = ringCenter(sampled);
          const center = latLonToVector(centerLat, centerLon, 1.585);
          const target = isHost ? hostTriangles : landTriangles;
          for (let i = 0; i < sampled.length - 1; i += 1) {
            const a = latLonToVector(sampled[i][0], sampled[i][1], 1.588);
            const b = latLonToVector(sampled[i + 1][0], sampled[i + 1][1], 1.588);
            target.push(center.x, center.y, center.z, a.x, a.y, a.z, b.x, b.y, b.z);
          }
        }

        const coastVectors = exterior.filter((_, index) => index % 5 === 0).map(([lat, lon]) => latLonToVector(lat, lon, 1.64));
        if (coastVectors.length > 2) root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(coastVectors), coastMaterial));

        exterior.forEach(([lat, lon], index) => {
          if (index % 9 !== 0) return;
          const point = latLonToVector(lat, lon, 1.59);
          landDots.push(point.x, point.y, point.z);
        });
      });
    });

    if (landTriangles.length) {
      const landGeometry = new THREE.BufferGeometry();
      landGeometry.setAttribute("position", new THREE.Float32BufferAttribute(landTriangles, 3));
      landGeometry.computeVertexNormals();
      root.add(new THREE.Mesh(landGeometry, landMaterial));
    }

    if (hostTriangles.length) {
      const hostGeometry = new THREE.BufferGeometry();
      hostGeometry.setAttribute("position", new THREE.Float32BufferAttribute(hostTriangles, 3));
      hostGeometry.computeVertexNormals();
      root.add(new THREE.Mesh(hostGeometry, hostLandMaterial));
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute("position", new THREE.Float32BufferAttribute(landDots, 3));
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x28dcc8,
      size: 0.012,
      transparent: true,
      opacity: 0.34,
      depthWrite: false
    });
    root.add(new THREE.Points(dotGeometry, dotMaterial));
  }

  function addHostNetwork(root) {
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.34 });
    const hub = ["Mexico City", 19.4326, -99.1332];
    cityPoints().slice(1).forEach((city, index) => {
      if (index % 2 !== 0) return;
      const geometry = new THREE.BufferGeometry().setFromPoints(arcVectors(hub[1], hub[2], city[1], city[2]));
      root.add(new THREE.Line(geometry, arcMaterial));
    });
  }

  async function loadGeoJsonMap(root) {
    try {
      const response = await fetch("assets/world-countries-110m.geojson", { cache: "force-cache" });
      if (!response.ok) throw new Error("geojson unavailable");
      const geojson = await response.json();
      addGeoJsonMap(root, geojson);
    } catch (error) {
      addContinentMap(root);
    }
  }

  function initGlobe() {
    const canvas = document.querySelector("#hero3d");
    const renderer = rendererFor(canvas);
    if (!renderer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.3, 5.8);

    const root = new THREE.Group();
    root.rotation.x = -0.24;
    root.rotation.y = -0.8;
    scene.add(root);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 96, 48),
      new THREE.MeshStandardMaterial({
        color: 0x071b1f,
        roughness: 0.62,
        metalness: 0.28,
        transparent: true,
        opacity: 0.86
      })
    );
    root.add(globe);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.565, 48, 24),
      new THREE.MeshBasicMaterial({ color: 0x28dcc8, wireframe: true, transparent: true, opacity: 0.075 })
    );
    root.add(wire);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 72, 36),
      new THREE.MeshBasicMaterial({
        color: 0x52a8ff,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false
      })
    );
    root.add(atmosphere);
    loadGeoJsonMap(root);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.36 });
    [1.85, 2.08, 2.31].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 8, 160), ringMaterial);
      ring.rotation.x = Math.PI / 2 + index * 0.22;
      ring.rotation.y = index * 0.34;
      root.add(ring);
    });

    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xf2c14e });
    cityPoints().forEach(([, lat, lon, volume]) => {
      const point = new THREE.Mesh(new THREE.SphereGeometry(0.025 + volume * 0.002, 16, 16), pointMaterial);
      point.position.copy(latLonToVector(lat, lon, 1.61));
      root.add(point);
    });
    addHostNetwork(root);

    const light = new THREE.DirectionalLight(0xffffff, 2.3);
    light.position.set(2, 3, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x52a8ff, 1.4));

    const state = { rotationX: root.rotation.x, rotationY: root.rotation.y };
    bindDrag(canvas, state);

    function animate() {
      resize(renderer, camera, canvas);
      state.rotationY += 0.0014;
      atmosphere.material.opacity = 0.07 + Math.sin(performance.now() * 0.0018) * 0.018;
      root.rotation.x += (state.rotationX - root.rotation.x) * 0.08;
      root.rotation.y += (state.rotationY - root.rotation.y) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  function lineMaterial(color, opacity = 0.85) {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  }

  function addLine(scene, points, color = 0x8deee3, opacity = 0.65) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([x, z]) => new THREE.Vector3(x, 0.021, z)));
    const line = new THREE.Line(geometry, lineMaterial(color, opacity));
    scene.add(line);
    return line;
  }

  function initPitch() {
    const canvas = document.querySelector("#match3d");
    const renderer = rendererFor(canvas);
    if (!renderer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 5.6, 5.9);
    camera.lookAt(0, 0, 0);

    const root = new THREE.Group();
    root.rotation.x = -0.26;
    scene.add(root);

    const pitch = new THREE.Mesh(
      new THREE.BoxGeometry(5.9, 0.035, 3.85),
      new THREE.MeshStandardMaterial({ color: 0x061c1d, roughness: 0.58, metalness: 0.22, emissive: 0x082f2b })
    );
    root.add(pitch);

    const scan = new THREE.Mesh(
      new THREE.PlaneGeometry(5.72, 0.035),
      new THREE.MeshBasicMaterial({ color: 0x52a8ff, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    scan.rotation.x = -Math.PI / 2;
    scan.position.y = 0.045;
    root.add(scan);

    addLine(root, [[-2.9, -1.85], [2.9, -1.85], [2.9, 1.85], [-2.9, 1.85], [-2.9, -1.85]]);
    addLine(root, [[0, -1.85], [0, 1.85]], 0xf2c14e, 0.7);
    addLine(root, [[-2.9, -0.85], [-2.18, -0.85], [-2.18, 0.85], [-2.9, 0.85]], 0x8deee3, 0.58);
    addLine(root, [[2.9, -0.85], [2.18, -0.85], [2.18, 0.85], [2.9, 0.85]], 0x8deee3, 0.58);

    const homeMaterial = new THREE.MeshStandardMaterial({ color: 0x28dcc8, emissive: 0x0b4c49, roughness: 0.25, metalness: 0.2 });
    const awayMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b57, emissive: 0x4f100b, roughness: 0.26, metalness: 0.18 });
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xf2c14e, emissive: 0x5c4100, roughness: 0.18, metalness: 0.4 });
    const haloHome = new THREE.MeshBasicMaterial({ color: 0x28dcc8, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
    const haloAway = new THREE.MeshBasicMaterial({ color: 0xff6b57, transparent: true, opacity: 0.14, side: THREE.DoubleSide });

    const homePositions = [[-2.35, 0], [-1.45, -1.15], [-1.45, -0.38], [-1.45, 0.38], [-1.45, 1.15], [-0.45, -0.78], [-0.55, 0], [-0.45, 0.78], [0.65, -1.04], [0.85, 0], [0.65, 1.04]];
    const awayPositions = homePositions.map(([x, z]) => [-x, -z]);

    const players = [];
    const baseX = [];
    function addPlayers(positions, material) {
      positions.forEach(([x, z], index) => {
        const player = new THREE.Mesh(new THREE.CylinderGeometry(index === 0 ? 0.095 : 0.075, index === 0 ? 0.095 : 0.075, 0.2, 24), material);
        player.position.set(x, 0.15, z);
        root.add(player);
        const halo = new THREE.Mesh(new THREE.RingGeometry(index === 0 ? 0.16 : 0.13, index === 0 ? 0.19 : 0.16, 30), material === homeMaterial ? haloHome : haloAway);
        halo.rotation.x = -Math.PI / 2;
        halo.position.set(x, 0.032, z);
        root.add(halo);
        player.userData.halo = halo;
        players.push(player);
        baseX.push(x);
      });
    }
    addPlayers(homePositions, homeMaterial);
    addPlayers(awayPositions, awayMaterial);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), ballMaterial);
    ball.position.set(0.2, 0.2, 0.1);
    root.add(ball);

    const pressureLine = addLine(root, [[-0.05, -1.65], [0.28, -0.85], [0.4, 0], [0.28, 0.85], [-0.05, 1.65]], 0xf2c14e, 0.9);
    const pulseLine = addLine(root, [[-2.4, -1.48], [-1.2, -0.54], [0.2, 0], [1.2, 0.54], [2.4, 1.48]], 0x52a8ff, 0.54);
    let phase = 0;
    let pressureTarget = -0.45;
    function setPhase(nextPhase) {
      phase = ((nextPhase % 3) + 3) % 3;
      const offsets = [-0.45, 0.1, 0.62];
      pressureTarget = offsets[phase];
      players.forEach((player, index) => {
        const side = index < 11 ? 1 : -1;
        const tacticalOffset = side * [-0.08, 0.04, 0.12][phase];
        player.userData.targetX = baseX[index] + tacticalOffset;
      });
      document.querySelectorAll("[data-tactic-phase]").forEach((button) => {
        button.classList.toggle("active", Number(button.dataset.tacticPhase) === phase);
      });
    }
    setPhase(0);
    document.querySelectorAll("[data-tactic-phase]").forEach((button) => {
      button.addEventListener("click", () => setPhase(Number(button.dataset.tacticPhase)));
    });

    const light = new THREE.DirectionalLight(0xffffff, 2.1);
    light.position.set(2.5, 5, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x52a8ff, 1.1));

    const state = { rotationX: root.rotation.x, rotationY: 0 };
    bindDrag(canvas, state);

    function animate(time) {
      resize(renderer, camera, canvas);
      ball.position.y = 0.22 + Math.sin(time * 0.004) * 0.045;
      pulseLine.material.opacity = 0.34 + Math.sin(time * 0.004) * 0.2;
      pulseLine.position.x = Math.sin(time * 0.0012) * 0.22;
      scan.position.z = -1.74 + ((time * 0.00042) % 3.48);
      scan.material.opacity = 0.13 + Math.sin(time * 0.006) * 0.08;
      pressureLine.position.x += (pressureTarget - pressureLine.position.x) * 0.08;
      pressureLine.material.opacity = 0.62 + Math.sin(time * 0.006) * 0.25;
      players.forEach((player, index) => {
        const drift = Math.sin(time * 0.002 + index) * 0.012;
        player.position.x += ((player.userData.targetX ?? baseX[index]) - player.position.x) * 0.08;
        player.position.z += drift * 0.03;
        if (player.userData.halo) {
          player.userData.halo.position.x = player.position.x;
          player.userData.halo.position.z = player.position.z;
          player.userData.halo.scale.setScalar(1 + Math.sin(time * 0.004 + index) * 0.08);
        }
      });
      root.rotation.x += (state.rotationX - root.rotation.x) * 0.08;
      root.rotation.y += (state.rotationY - root.rotation.y) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate(0);
  }

  function init() {
    initGlobe();
    initPitch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
