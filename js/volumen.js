// FORMULARIOS SEGÚN FIGURA
const formularios = {
    elipsoide: `
    <label>a (radio X):</label>
    <input type="number" id="a" class="input-vol" />

    <label>b (radio Y):</label>
    <input type="number" id="b" class="input-vol" />

    <label>c (radio Z):</label>
    <input type="number" id="c" class="input-vol" />

    <button class="btn-utez" style="width:100%;" onclick="calcularVolumen('elipsoide')">Calcular Volumen</button>
    `,
    conoEliptico: `
    <label>a (semieje X):</label>
    <input type="number" id="a" class="input-vol" />

    <label>b (semieje Y):</label>
    <input type="number" id="b" class="input-vol" />

    <label>h (altura):</label>
    <input type="number" id="h" class="input-vol" />

    <button class="btn-utez" style="width:100%;" onclick="calcularVolumen('conoEliptico')">Calcular Volumen</button>
    `,
    cilindroEliptico: `
    <label>a (semieje X):</label>
    <input type="number" id="a" class="input-vol" />

    <label>b (semieje Y):</label>
    <input type="number" id="b" class="input-vol" />

    <label>h (altura):</label>
    <input type="number" id="h" class="input-vol" />

    <button class="btn-utez" style="width:100%;" onclick="calcularVolumen('cilindroEliptico')">Calcular Volumen</button>
    `,
    prisma: `
    <label>Largo:</label>
    <input type="number" id="largo" class="input-vol" />

    <label>Ancho:</label>
    <input type="number" id="ancho" class="input-vol" />

    <label>Altura:</label>
    <input type="number" id="alto" class="input-vol" />

    <button class="btn-utez" style="width:100%;" onclick="calcularVolumen('prisma')">Calcular Volumen</button>
    `,
    toro: `
    <label>R (radio mayor):</label>
    <input type="number" id="R" class="input-vol" />

    <label>r (radio menor):</label>
    <input type="number" id="r" class="input-vol" />

    <button class="btn-utez" style="width:100%;" onclick="calcularVolumen('toro')">Calcular Volumen</button>
    `,
};

// Cambiar formulario dinámico
document.getElementById("figuraSelect").addEventListener("change", function () {
    document.getElementById("formContainer").innerHTML = formularios[this.value];
});

// Cargar primer formulario por defecto
document.getElementById("formContainer").innerHTML = formularios["elipsoide"];

// ----------------------
// CÁLCULO DEL VOLUMEN
// ----------------------
function calcularVolumen(tipo) {
    let V = 0;

    switch (tipo) {

        case "elipsoide":
            let a = parseFloat(document.getElementById("a").value);
            let b = parseFloat(document.getElementById("b").value);
            let c = parseFloat(document.getElementById("c").value);
            V = (4/3) * Math.PI * a * b * c;
            break;

        case "conoEliptico":
            a = parseFloat(document.getElementById("a").value);
            b = parseFloat(document.getElementById("b").value);
            let h1 = parseFloat(document.getElementById("h").value);
            V = (1/3) * Math.PI * a * b * h1;
            break;

        case "cilindroEliptico":
            a = parseFloat(document.getElementById("a").value);
            b = parseFloat(document.getElementById("b").value);
            let h2 = parseFloat(document.getElementById("h").value);
            V = Math.PI * a * b * h2;
            break;

        case "prisma":
            let largo = parseFloat(document.getElementById("largo").value);
            let ancho = parseFloat(document.getElementById("ancho").value);
            let alto = parseFloat(document.getElementById("alto").value);
            V = largo * ancho * alto;
            break;

        case "toro":
            let R = parseFloat(document.getElementById("R").value);
            let r = parseFloat(document.getElementById("r").value);
            V = 2 * Math.PI * Math.PI * R * r * r;
            break;
    }

    document.getElementById("resultado").innerHTML =
        `Volumen = <strong>${V.toFixed(4)}</strong> unidades cúbicas`;
}
