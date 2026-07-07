const ageModal = document.getElementById('age-modal');
const btnsi = document.getElementById('btn-si');
const btnno = document.getElementById('btn-no');
const grande = document.querySelector('.grande');
const punto = document.querySelectorAll('.punto');
const btnCatalogo = document.getElementById('ver-catalogo');
const galeriaCervezas = document.querySelector('.galeria');

let currentIndex = 0;
let carrouselInterval;




const esMayorDeEdad = localStorage.getItem('mayorDeEdad');

if (esMayorDeEdad === 'true') {
    ageModal.classList.add('hidden');
}

btnsi.addEventListener('click', () => {
    localStorage.setItem('mayorDeEdad', 'true');
    ageModal.classList.add('hidden');
});

btnno.addEventListener('click', () => {
    window.location.href = "https://www.google.com";
});


punto.forEach((cadaPunto, i) => {
    punto[i].addEventListener('click', () => {
        let posicion = i
        currentIndex = i
        let operacion = posicion * -25
        grande.style.transform = `translateX(${operacion}%)`

        punto.forEach((cadaPunto, i) => {
            punto[i].classList.remove('activo')
        })
        punto[i].classList.add('activo')

        resetearAutoPlay();

    })

})

function iniciarAutoPlay() {
    carrouselInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= punto.length) {
            currentIndex = 0;
        }
        punto[currentIndex].click();
    }, 4000);
}

function resetearAutoPlay() {
    clearInterval(carrouselInterval);

    carrouselInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= punto.length) {
            currentIndex = 0;
        }
        punto[currentIndex].click();
    }, 4000);
}

if (punto.length > 0) {
    punto[0].classList.add('activo');
    iniciarAutoPlay();
}

if (btnCatalogo && catalogoTienda) {
    btnCatalogo.addEventListener('click', function (e) {
        e.preventDefault();
        catalogoTienda.classList.toggle('mostrar-tienda');

        if (catalogoTienda.classList.contains('mostrar-tienda')) {
            btnCatalogo.textContent = 'Ocultar Catálogo';
            catalogoTienda.scrollIntoView({ behavior: 'smooth' });
        } else {
            btnCatalogo.textContent = 'Ver Todas las Cervezas';
        }
    });
}

function abrirModal() {
    document.getElementById("modal-mapa").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal-mapa").style.display = "none";
}


window.onclick = function (event) {
    let modal = document.getElementById("modal-mapa");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}