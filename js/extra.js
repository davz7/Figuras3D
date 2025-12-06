// --------------------------
// FORMULARIOS POR FIGURA
// --------------------------
const formularios = {
    prisma: `
        <label>Largo:</label><input type="number" id="l" class="input-vol" value="4">
        <label>Ancho:</label><input type="number" id="w" class="input-vol" value="3">
        <label>Altura:</label><input type="number" id="h" class="input-vol" value="5">
    `,
    cilindro: `
        <label>a (radio X):</label><input type="number" id="a" class="input-vol" value="2">
        <label>b (radio Y):</label><input type="number" id="b" class="input-vol" value="1">
        <label>h (altura):</label><input type="number" id="h" class="input-vol" value="4">
    `,
    cono: `
        <label>a (radio X base):</label><input type="number" id="a" class="input-vol" value="2">
        <label>b (radio Y base):</label><input type="number" id="b" class="input-vol" value="1">
        <label>h (altura):</label><input type="number" id="h" class="input-vol" value="4">
    `,
    elipsoide: `
        <label>a (radio X):</label><input type="number" id="a" class="input-vol" value="2">
        <label>b (radio Y):</label><input type="number" id="b" class="input-vol" value="1.5">
        <label>c (radio Z):</label><input type="number" id="c" class="input-vol" value="1">
    `,
    toro: `
        <label>R (radio mayor):</label><input type="number" id="R" class="input-vol" value="3">
        <label>r (radio menor):</label><input type="number" id="r" class="input-vol" value="1">
    `
};

const figuraSelect = document.getElementById("figuraSelect");
const parametrosDiv = document.getElementById("parametros");
const resultadoSim = document.getElementById("resultadoSim");

figuraSelect.addEventListener("change", () => {
    parametrosDiv.innerHTML = formularios[figuraSelect.value];
});

// primer formulario
parametrosDiv.innerHTML = formularios["prisma"];

// --------------------------
// VARIABLES 3D GLOBALES
// --------------------------
let escena, camara, render;
let figuraMesh, aguaMesh;
let animId = null;
let fill = 0;             // 0 → vacío, 1 → lleno
let alturaFigura = 2;     // altura efectiva del sólido (normalizada)
let escalaBase = { x: 1, y: 1, z: 1 };

// --------------------------
// UTILIDADES
// --------------------------
function parseOrDefault(id, def) {
    const el = document.getElementById(id);
    if (!el) return def;
    const v = parseFloat(el.value);
    return isNaN(v) || v <= 0 ? def : v;
}

function crearEscena() {
    const cont = document.getElementById("simCanvas");
    cont.innerHTML = "";

    const w = cont.clientWidth;
    const h = cont.clientHeight || 350;

    escena = new THREE.Scene();

    camara = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camara.position.set(3, 3, 5);
    camara.lookAt(0, 0, 0);

    render = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    render.setSize(w, h);
    cont.appendChild(render.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    escena.add(luzAmbiente);

    const luzDirecc = new THREE.DirectionalLight(0xffffff, 0.8);
    luzDirecc.position.set(5, 10, 7);
    escena.add(luzDirecc);
}

// Normaliza dimensiones para que el sólido no sea gigante pero conserve proporciones
function normalizarEscala(dimX, dimY, dimZ) {
    const maxDim = Math.max(dimX, dimY, dimZ, 1);
    const factor = 2.0 / maxDim; // el mayor ≈ 2 unidades

    return {
        x: (dimX / maxDim) * 2.0,
        y: (dimY / maxDim) * 2.0,
        z: (dimZ / maxDim) * 2.0
    };
}

// Calcula altura efectiva de cualquier malla ya escalada
function calcularAltura(mesh) {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    return box.max.y - box.min.y;
}

// --------------------------
// CREACIÓN DE FIGURAS + AGUA
// --------------------------
function crearPrisma() {
    const L = parseOrDefault("l", 4);
    const W = parseOrDefault("w", 3);
    const H = parseOrDefault("h", 5);

    const geom = new THREE.BoxGeometry(1, 1, 1); // base unidad
    const mat = new THREE.MeshBasicMaterial({ color: 0x006341, wireframe: true });
    figuraMesh = new THREE.Mesh(geom, mat);

    // Escala según L, W, H (realista)
    escalaBase = normalizarEscala(L, H, W);
    figuraMesh.scale.set(escalaBase.x, escalaBase.y, escalaBase.z);
    escena.add(figuraMesh);

    // Agua misma forma
    const aguaGeom = new THREE.BoxGeometry(1, 1, 1);
    const aguaMat = new THREE.MeshPhongMaterial({
        color: 0x0099cc,
        transparent: true,
        opacity: 0.6
    });
    aguaMesh = new THREE.Mesh(aguaGeom, aguaMat);
    aguaMesh.scale.set(escalaBase.x, 0.0001, escalaBase.z); // inicia casi sin altura
    escena.add(aguaMesh);

    alturaFigura = calcularAltura(figuraMesh);
}

function crearCilindro() {
    const a = parseOrDefault("a", 2);
    const b = parseOrDefault("b", 1);
    const h = parseOrDefault("h", 4);

    const geom = new THREE.CylinderGeometry(1, 1, 1, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0x006341, wireframe: true });
    figuraMesh = new THREE.Mesh(geom, mat);

    escalaBase = normalizarEscala(a, h, b);
    figuraMesh.scale.set(escalaBase.x, escalaBase.y, escalaBase.z);
    escena.add(figuraMesh);

    const aguaGeom = new THREE.CylinderGeometry(1, 1, 1, 48);
    const aguaMat = new THREE.MeshPhongMaterial({
        color: 0x0099cc,
        transparent: true,
        opacity: 0.6
    });
    aguaMesh = new THREE.Mesh(aguaGeom, aguaMat);
    aguaMesh.scale.set(escalaBase.x, 0.0001, escalaBase.z);
    escena.add(aguaMesh);

    alturaFigura = calcularAltura(figuraMesh);
}

function crearCono() {
    const a = parseOrDefault("a", 2);
    const b = parseOrDefault("b", 1);
    const h = parseOrDefault("h", 4);

    const geom = new THREE.ConeGeometry(1, 1, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0x006341, wireframe: true });
    figuraMesh = new THREE.Mesh(geom, mat);

    escalaBase = normalizarEscala(a, h, b);
    figuraMesh.scale.set(escalaBase.x, escalaBase.y, escalaBase.z);
    escena.add(figuraMesh);

    const aguaGeom = new THREE.ConeGeometry(1, 1, 48);
    const aguaMat = new THREE.MeshPhongMaterial({
        color: 0x0099cc,
        transparent: true,
        opacity: 0.6
    });
    aguaMesh = new THREE.Mesh(aguaGeom, aguaMat);
    aguaMesh.scale.set(escalaBase.x, 0.0001, escalaBase.z);
    escena.add(aguaMesh);

    alturaFigura = calcularAltura(figuraMesh);
}

function crearElipsoide() {
    const a = parseOrDefault("a", 2);
    const b = parseOrDefault("b", 1.5);
    const c = parseOrDefault("c", 1);

    const geom = new THREE.SphereGeometry(1, 40, 40);
    const mat = new THREE.MeshBasicMaterial({ color: 0x006341, wireframe: true });
    figuraMesh = new THREE.Mesh(geom, mat);

    escalaBase = normalizarEscala(a, b, c);
    figuraMesh.scale.set(escalaBase.x, escalaBase.y, escalaBase.z);
    escena.add(figuraMesh);

    const aguaGeom = new THREE.SphereGeometry(1, 40, 40);
    const aguaMat = new THREE.MeshPhongMaterial({
        color: 0x0099cc,
        transparent: true,
        opacity: 0.6
    });
    aguaMesh = new THREE.Mesh(aguaGeom, aguaMat);
    aguaMesh.scale.set(escalaBase.x, 0.0001, escalaBase.z);
    escena.add(aguaMesh);

    alturaFigura = calcularAltura(figuraMesh);
}

function crearToro() {
    const R = parseOrDefault("R", 3);
    const r = parseOrDefault("r", 1);

    const geom = new THREE.TorusGeometry(1, 0.35, 24, 80);
    const mat = new THREE.MeshBasicMaterial({ color: 0x006341, wireframe: true });
    figuraMesh = new THREE.Mesh(geom, mat);

    // Para el toro tomamos R como grande y r como grosor: usamos escala uniforme
    const maxDim = Math.max(R + r, 1);
    const factor = 2.0 / maxDim;
    escalaBase = { x: factor * (R + r), y: factor * (R + r), z: factor * (R + r) };
    figuraMesh.scale.set(escalaBase.x, escalaBase.y, escalaBase.z);
    escena.add(figuraMesh);

    const aguaGeom = new THREE.TorusGeometry(1, 0.35, 24, 80);
    const aguaMat = new THREE.MeshPhongMaterial({
        color: 0x0099cc,
        transparent: true,
        opacity: 0.6
    });
    aguaMesh = new THREE.Mesh(aguaGeom, aguaMat);
    aguaMesh.scale.set(escalaBase.x, 0.0001, escalaBase.z); // "aparece" desde abajo
    escena.add(aguaMesh);

    alturaFigura = calcularAltura(figuraMesh);
}

// --------------------------
// ANIMACIÓN
// --------------------------
function animar() {
    animId = requestAnimationFrame(animar);

    if (figuraMesh) {
        figuraMesh.rotation.y += 0.01;
        figuraMesh.rotation.x = 0.7;
    }
    if (aguaMesh) {
        aguaMesh.rotation.copy(figuraMesh.rotation);

        if (fill < 1) {
            fill += 0.01;
        }

        // altura progresiva
        const alturaActual = alturaFigura * fill;

        // Escala Y proporcional, manteniendo las escalas originales
        aguaMesh.scale.y = escalaBase.y * fill;

        // Colocamos el centro del agua a mitad de la columna actual
        aguaMesh.position.y = -alturaFigura / 2 + alturaActual / 2;
    }

    render.render(escena, camara);
}

// --------------------------
// CÁLCULO DE VOLUMEN
// --------------------------
function calcularVolumen(tipo) {
    let texto = "";
    let V = 0;

    if (tipo === "prisma") {
        const l = parseOrDefault("l", 4);
        const w = parseOrDefault("w", 3);
        const h = parseOrDefault("h", 5);
        V = l * w * h;
        texto = `V = L · W · H = ${l} · ${w} · ${h} = <strong>${V.toFixed(2)}</strong>`;
    } else if (tipo === "cilindro") {
        const a = parseOrDefault("a", 2);
        const b = parseOrDefault("b", 1);
        const h = parseOrDefault("h", 4);
        V = Math.PI * a * b * h;
        texto = `V = π · a · b · h = π · ${a} · ${b} · ${h} = <strong>${V.toFixed(2)}</strong>`;
    } else if (tipo === "cono") {
        const a = parseOrDefault("a", 2);
        const b = parseOrDefault("b", 1);
        const h = parseOrDefault("h", 4);
        V = (Math.PI * a * b * h) / 3;
        texto = `V = (π · a · b · h) / 3 = <strong>${V.toFixed(2)}</strong>`;
    } else if (tipo === "elipsoide") {
        const a = parseOrDefault("a", 2);
        const b = parseOrDefault("b", 1.5);
        const c = parseOrDefault("c", 1);
        V = (4 / 3) * Math.PI * a * b * c;
        texto = `V = (4/3) · π · a · b · c = <strong>${V.toFixed(2)}</strong>`;
    } else if (tipo === "toro") {
        const R = parseOrDefault("R", 3);
        const r = parseOrDefault("r", 1);
        V = 2 * Math.PI * Math.PI * R * r * r;
        texto = `V = 2 · π² · R · r² = <strong>${V.toFixed(2)}</strong>`;
    }

    resultadoSim.innerHTML = `
        <p><strong>Volumen aproximado:</strong> ${V.toFixed(2)} unidades cúbicas</p>
        <p>${texto}</p>
    `;
}

// --------------------------
// INICIAR SIMULACIÓN (BOTÓN)
// --------------------------
function iniciarSimulacion() {
    // Cancelar animación anterior
    if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
    }

    crearEscena();
    fill = 0;
    figuraMesh = null;
    aguaMesh = null;
    escalaBase = { x: 1, y: 1, z: 1 };

    const tipo = figuraSelect.value;

    if (tipo === "prisma") crearPrisma();
    if (tipo === "cilindro") crearCilindro();
    if (tipo === "cono") crearCono();
    if (tipo === "elipsoide") crearElipsoide();
    if (tipo === "toro") crearToro();

    calcularVolumen(tipo);
    animar();
}

// Exponer al botón
window.iniciarSimulacion = iniciarSimulacion;
