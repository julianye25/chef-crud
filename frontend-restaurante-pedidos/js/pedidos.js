const d = document;
const tablaPedidos = d.querySelector('.pedidos tbody');

window.addEventListener('DOMContentLoaded', async () => {
  const pedidos = await obtenerPedidos();
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    tablaPedidos.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">
          <div class="alert alert-warning" role="alert">
            No hay pedidos en este estado.
          </div>
        </td>
      </tr>
    `;
    return;
  }
  filtrarPedido(pedidos, 'por hacer', '.pedidos');
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
  const estadoPedido = pedidos.filter((pedido) => pedido.estado === filtro);

  if (!Array.isArray(estadoPedido) || estadoPedido.length === 0) {
    elemento.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">
          <div class="alert alert-warning" role="alert">
            No hay pedidos en esta lista.
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
          <button class="btn btn-primary btn-sm btn-actualizar" data-pedido='${JSON.stringify(
            pedido,
          )}'>
            Hacer
          </button>
        </td>
        <td>
          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${id}">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-actualizar')) {
    const pedido = JSON.parse(event.target.getAttribute('data-pedido'));
    actualizarPedido(pedido);
  }
  if (event.target.classList.contains('btn-eliminar')) {
    const id = event.target.getAttribute('data-id');
    eliminarPedido(id);
  }
});

const eliminarPedido = async (id) => {
  const URL = 'http://localhost:3005/pedido';
  try {
    const response = await fetch(URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    if (data.success) location.reload();
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
  }
};

const actualizarPedido = async (pedido) => {
  const URL = `http://localhost:3005/pedido/${pedido.id}`;

  const newPedido = {
    platillo: pedido.platillo,
    precio: pedido.precio,
    cantidad: pedido.cantidad,
    observaciones: pedido.observaciones,
    cliente: pedido.cliente,
    fecha: pedido.fecha,
    estado: 'preparar',
  };

  console.log('nuevo pedido', newPedido);

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPedido),
    });
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    if (data.success) location.reload();
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
  }
};
