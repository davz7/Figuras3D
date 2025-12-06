// ----------------------------
// CONFIGURACIÓN GENERAL
// ----------------------------
function crearEscena(canvasId) {
    const contenedor = document.getElementById(canvasId);

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(
        45,
        contenedor.clientWidth / contenedor.clientHeight,
        0.1,
        1000
    );

    camara.position.z = 5.5;
    camara.position.y = 0.5;

    const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    render.setSize(contenedor.clientWidth, contenedor.clientHeight);
    contenedor.appendChild(render.domElement);

    const material = new THREE.MeshBasicMaterial({
        color: 0x006341, // Verde UTEZ institucional
        wireframe: true
    });

    return { escena, camara, render, material };
}

// Centrar modelo y normalizar tamaño
function centrarYNormalizar(mesh) {
    // Calcular bounding box
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;

    // Centro de la figura
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Mover figura al centro
    mesh.position.sub(center);

    // Normalizar tamaño para que todas entren en el mismo cuadro
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 2 / maxDimension;

    mesh.scale.multiplyScalar(scaleFactor);
}

function animar(mesh, renderFn) {
    function loop() {
        requestAnimationFrame(loop);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderFn();
    }
    loop();
}

// ----------------------------
// 1) ELIPSOIDE
// ----------------------------
(function () {
    const { escena, camara, render, material } = crearEscena("elipsoideCanvas");

    const esfera = new THREE.SphereGeometry(1, 32, 32);
    const elipsoide = new THREE.Mesh(esfera, material);

    elipsoide.scale.set(1.2, 0.8, 1.0);

    centrarYNormalizar(elipsoide);
    escena.add(elipsoide);

    animar(elipsoide, () => render.render(escena, camara));
})();

// ----------------------------
// 2) CONO ELÍPTICO
// ----------------------------
(function () {
    const { escena, camara, render, material } = crearEscena("conoElipticoCanvas");

    const geom = new THREE.ConeGeometry(1, 1.5, 32, 32);
    const cono = new THREE.Mesh(geom, material);

    cono.scale.set(1, 1, 0.6); // deforma base a elipse

    centrarYNormalizar(cono);
    escena.add(cono);

    animar(cono, () => render.render(escena, camara));
})();

// ----------------------------
// 3) CILINDRO ELÍPTICO
// ----------------------------
(function () {
    const { escena, camara, render, material } = crearEscena("cilindroElipticoCanvas");

    const geom = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cilindro = new THREE.Mesh(geom, material);

    cilindro.scale.set(1.2, 1, 0.8);

    centrarYNormalizar(cilindro);
    escena.add(cilindro);

    animar(cilindro, () => render.render(escena, camara));
})();

// ----------------------------
// 4) PRISMA RECTANGULAR
// ----------------------------
(function () {
    const { escena, camara, render, material } = crearEscena("prismaCanvas");

    const geom = new THREE.BoxGeometry(1.5, 1, 0.8);
    const prisma = new THREE.Mesh(geom, material);

    centrarYNormalizar(prisma);
    escena.add(prisma);

    animar(prisma, () => render.render(escena, camara));
})();

// ----------------------------
// 5) TORO
// ----------------------------
(function () {
    const { escena, camara, render, material } = crearEscena("toroCanvas");

    const geom = new THREE.TorusGeometry(1, 0.4, 16, 50);
    const toro = new THREE.Mesh(geom, material);

    centrarYNormalizar(toro);
    escena.add(toro);

    animar(toro, () => render.render(escena, camara));
})();
