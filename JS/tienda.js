let carrito = [];


window.modificarCantidad = function (idUnico, accion) {
    const producto = carrito.find(item => item.id === idUnico);
    if (!producto) return;

    if (accion === 'sumar') {
        producto.cantidad++;
    } else if (accion === 'restar') {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== idUnico);
        }
    } else if (accion === 'eliminar') {
        carrito = carrito.filter(item => item.id !== idUnico);
    }

    actualizarInterfazCarrito();
    actualizarBotonesCatalogo();
};


document.addEventListener("DOMContentLoaded", () => {

    const cartFloatingBtn = document.getElementById('cart-floating-btn');
    const carritoDrawer = document.getElementById('carrito-drawer');
    const carritoOverlay = document.getElementById('carrito-overlay');
    const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
    const btnEnviarPedido = document.getElementById('btn-enviar-pedido');


    if (cartFloatingBtn && carritoDrawer && carritoOverlay) {
        cartFloatingBtn.addEventListener('click', () => {
            carritoDrawer.classList.add('activo');
            carritoOverlay.classList.add('activo');
        });
    }

    const cerrarPanel = () => {
        if (carritoDrawer && carritoOverlay) {
            carritoDrawer.classList.remove('activo');
            carritoOverlay.classList.remove('activo');
        }
    };

    if (btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarPanel);
    if (carritoOverlay) carritoOverlay.addEventListener('click', cerrarPanel);


    document.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
        const nombreBase = tarjeta.getAttribute('data-nombre');
        const btn = tarjeta.querySelector('.btn-agregar-carrito');
        const selectFormato = tarjeta.querySelector('.select-formato');

        if (btn && selectFormato) {
            btn.addEventListener('click', () => {
                const opcionSeleccionada = selectFormato.options[selectFormato.selectedIndex];
                const formatoTexto = opcionSeleccionada.text.split('—')[0].trim();
                const precio = parseInt(opcionSeleccionada.getAttribute('data-precio'), 10);


                const idProducto = `${nombreBase}-${formatoTexto}`;

                const productoExistente = carrito.find(item => item.id === idProducto);

                if (productoExistente) {
                    productoExistente.cantidad++;
                } else {
                    carrito.push({
                        id: idProducto,
                        nombre: nombreBase,
                        formato: formatoTexto,
                        precio: precio,
                        cantidad: 1
                    });
                }

                actualizarInterfazCarrito();
                actualizarBotonesCatalogo();
            });


            selectFormato.addEventListener('change', actualizarBotonesCatalogo);
        }
    });

    // Enviar por WhatsApp estructurado
    if (btnEnviarPedido) {
        btnEnviarPedido.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. ¡Agrega unas buenas cervezas primero!");
                return;
            }

            let total = 0;
            let mensaje = '🍻 *NUEVO PEDIDO - CERVECERÍA RUCAPEQUEN* 🍻\n\n';
            mensaje += 'Hola. Me gustaría realizar el siguiente pedido:\n';
            mensaje += '-------------------------------------------\n';

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                mensaje += `▪️ *${item.cantidad}x* ${item.nombre} (${item.formato}) - $${subtotal.toLocaleString('es-CL')}\n`;
            });

            mensaje += '-------------------------------------------\n';
            mensaje += `💰 *Total a pagar: $${total.toLocaleString('es-CL')}*\n\n`;
            mensaje += '¿Me confirman disponibilidad para coordinar la transferencia?';

            const tuNumero = "56961707038";
            window.open(`https://api.whatsapp.com/send?phone=${tuNumero}&text=${encodeURIComponent(mensaje)}`, '_blank');
        });
    }

    actualizarInterfazCarrito();
});


function actualizarInterfazCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoTotal = document.getElementById('carrito-total');
    const cartBadge = document.getElementById('cart-badge');

    if (!carritoContenido || !carritoTotal) return;

    carritoContenido.innerHTML = '';

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        carritoTotal.textContent = '$0';
        if (cartBadge) {
            cartBadge.textContent = '0';
            cartBadge.style.display = 'none';
        }
        return;
    }

    let totalCalculado = 0;
    let totalItems = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalCalculado += subtotal;
        totalItems += item.cantidad;

        const itemLinea = document.createElement('div');
        itemLinea.classList.add('carrito-item-linea');
        itemLinea.innerHTML = `
            <div class="item-info">
                <span class="item-nombre">${item.nombre} <br><small style="color:#d4af37">${item.formato}</small></span>
                <span class="item-precio">$${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div class="item-controles">
                <button class="btn-control-cant" onclick="modificarCantidad('${item.id}', 'restar')">-</button>
                <span class="item-cantidad-display">${item.cantidad}</span>
                <button class="btn-control-cant" onclick="modificarCantidad('${item.id}', 'sumar')">+</button>
                <button class="btn-eliminar-item" onclick="modificarCantidad('${item.id}', 'eliminar')">
                    <i class="fa-solid fa-trash-can"></i> 
                </button>
            </div>
        `;
        carritoContenido.appendChild(itemLinea);
    });

    carritoTotal.textContent = `$${totalCalculado.toLocaleString('es-CL')}`;
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function actualizarBotonesCatalogo() {
    document.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
        const nombreBase = tarjeta.getAttribute('data-nombre');
        const btn = tarjeta.querySelector('.btn-agregar-carrito');
        const selectFormato = tarjeta.querySelector('.select-formato');

        if (btn && selectFormato) {
            const opcionSeleccionada = selectFormato.options[selectFormato.selectedIndex];
            const formatoTexto = opcionSeleccionada.text.split('—')[0].trim();
            const idProducto = `${nombreBase}-${formatoTexto}`;

            const producto = carrito.find(item => item.id === idProducto);

            if (producto) {
                btn.textContent = `Agregado (${producto.cantidad})`;
                btn.style.backgroundColor = "#28a745";
                btn.style.color = "#fff";
            } else {
                btn.textContent = "Agregar al carrito";
                btn.style.backgroundColor = "transparent";
                btn.style.color = "#d4af37";
            }
        }
    });
}