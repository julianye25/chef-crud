const d = document;

window.addEventListener('DOMContentLoaded', async () => {
  const pedidos = await obtenerPedidos();
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    const tablaEntregar = document.querySelector('.entregar tbody');
    tablaEntregar.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          <div class="alert alert-warning" role="alert">
            No hay pedidos por entregar.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filtrarPedido(pedidos, 'por entregar', '.entregar');
  filtrarPedido(pedidos, 'entregado', '.entregado');
});

const obtenerPedidos = async () => {
  const URL = 'http://localhost:3005/pedidos';
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return Array.isArray(data) ? data : []; // Asegúrate de que siempre sea un array
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};

const filtrarPedido = (pedidos, filtro, etiqueta) => {
  const elemento = d.querySelector(`${etiqueta} tbody`);
  const estadoPedido = Array.isArray(pedidos)
    ? pedidos.filter((pedido) => pedido.estado === filtro)
    : [];

  if (estadoPedido.length === 0) {
    elemento.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          <div class="alert alert-warning" role="alert">
            No hay pedidos ${filtro}.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elemento.innerHTML = '';
  estadoPedido.forEach((pedido, i) => {
    const { platillo, estado, id } = pedido;

    elemento.innerHTML += `
      <tr>
        <td>${platillo}</td>
        <td>${i + 1}</td>
        <td>${estado}</td>
        <td>
          ${
            estado === 'por entregar'
              ? `<button class="btn btn-primary btn-sm btn-actualizar" onclick='actualizarEstado(${JSON.stringify(
                  pedido,
                )}, "entregado")'>
                   Entregar
                 </button>`
              : ''
          }
        </td>
        <td>
          ${
            estado === 'entregado'
              ? `<button class="btn btn-danger btn-sm btn-eliminar" data-id="${id}">
                   Eliminar
                 </button>`
              : ''
          }
        </td>
      </tr>
    `;
  });
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
      filtrarPedido(pedidos, 'por entregar', '.entregar'); // Actualizar tabla de "por entregar"
      filtrarPedido(pedidos, 'entregado', '.entregado'); // Actualizar tabla de "entregado"
    }
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
  }
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-eliminar')) {
    const id = event.target.getAttribute('data-id');
    eliminarPedido(id);
  }
});

const eliminarPedido = async (id) => {
  console.log('eliminar');

  const URL = 'http://localhost:3005/pedido'; // La URL no incluye el ID en este caso

  try {
    const response = await fetch(URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }), // Enviar el ID en el cuerpo de la solicitud
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (data.success) {
      // Actualizar la lista de pedidos en la interfaz
      const pedidos = await obtenerPedidos(); // Obtener la lista actualizada
      filtrarPedido(pedidos, 'por entregar', '.entregar'); // Actualizar tabla de "por entregar"
      filtrarPedido(pedidos, 'entregado', '.entregado'); // Actualizar tabla de "entregado"
    } else {
      console.error('Error al eliminar el pedido:', data.message);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud DELETE:', error);
  }
};
