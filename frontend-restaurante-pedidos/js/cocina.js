const d = document;
const porPreparar = d.querySelector(' tbody');
const preparado = d.querySelector(' tbody');

window.addEventListener('DOMContentLoaded', async () => {
  const pedidos = await obtenerPedidos();
  if (pedidos.length === 0) {
    porPreparar.innerHTML = `
      <div class="alert alert-warning" role="alert">
        No hay pedidos por preparar.
      </div>
    `;
    return;
  } else {
    filtrarPedido(pedidos, 'preparar', '#Pizza');
    filtrarPedido(pedidos, 'preparando', '#Pasta');

    // filterPedidos(pedidos);
    actualizarPedido(pedidos);
  }
});

const obtenerPedidos = async () => {
  const URL = 'http://localhost:3005/pedidos';
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const dataPedidos = await response.json();

    return dataPedidos;
  } catch (error) {
    console.error(error);
  }
};

const filtrarPedido = (pedidos, filtro, etiqueta) => {
  const elemeto = d.querySelector(`${etiqueta} tbody`);
  const estadoPedido = Array.isArray(pedidos)
    ? pedidos.filter((pedido) => pedido.estado === filtro)
    : [];

  if (estadoPedido.length === 0) {
    elemeto.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">
          <div class="alert alert-warning" role="alert">
            No hay pedidos en este estado.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elemeto.innerHTML = '';
  estadoPedido.forEach((pedido, i) => {
    const { id, platillo, estado } = pedido;

    let botonTexto = '';
    let nuevoEstado = '';
    if (filtro === 'preparar') {
      botonTexto = 'Cambiar a "Preparando"';
      nuevoEstado = 'preparando';
    } else if (filtro === 'preparando') {
      botonTexto = 'Cambiar a "Por Entregar"';
      nuevoEstado = 'por entregar';
    }

    elemeto.innerHTML += `
      <tr>
        <td>${platillo}</td>
        <td>${i + 1}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick='actualizarEstado(${JSON.stringify(
            pedido,
          )}, "${nuevoEstado}")'>
            ${botonTexto}
          </button>
        </td>
      </tr>
    `;
  });
};

const actualizarPedido = async (pedido) => {
  const URL = `http://localhost:3005/pedido/${pedido.id}`;

  // Cambiar el estado del pedido a "preparando"
  const newPedido = {
    platillo: pedido.platillo,
    precio: pedido.precio,
    cantidad: pedido.cantidad,
    observaciones: pedido.observaciones,
    cliente: pedido.cliente,
    fecha: pedido.fecha,
    estado: 'preparando', // Cambiar el estado
  };

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPedido),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.success) {
      // Actualizar la lista de pedidos en la interfaz
      const pedidos = await obtenerPedidos(); // Obtener la lista actualizada
      filtrarPedido(pedidos, 'preparar', '#Pizza'); // Volver a renderizar la tabla
      filtrarPedido(pedidos, 'preparando', '#Pasta'); // Actualizar otra tabla si es necesario
    }
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
  }
};

const actualizarEstado = async (pedido, nuevoEstado) => {
  const URL = `http://localhost:3005/pedido/${pedido.id}`;

  // Cambiar el estado del pedido
  const updatedPedido = {
    platillo: pedido.platillo,
    precio: pedido.precio,
    cantidad: pedido.cantidad,
    observaciones: pedido.observaciones,
    cliente: pedido.cliente,
    fecha: pedido.fecha,
    estado: nuevoEstado, // Cambiar al nuevo estado
  };

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPedido),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.success) {
      // Actualizar la lista de pedidos en la interfaz
      const pedidos = await obtenerPedidos(); // Obtener la lista actualizada
      filtrarPedido(pedidos, 'preparar', '#Pizza'); // Actualizar tabla de "preparar"
      filtrarPedido(pedidos, 'preparando', '#Pasta'); // Actualizar tabla de "preparando"
      filtrarPedido(pedidos, 'por entregar', '#Entregar'); // Actualizar tabla de "por entregar"
    }
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
  }
};
