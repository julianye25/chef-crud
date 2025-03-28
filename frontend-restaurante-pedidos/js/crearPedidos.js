const d = document;

const tipoPizza = d.getElementById('TipoPizza');
const cliente = d.querySelector('.cliente');
const cantidad = d.querySelector('.cantidad');
const crearPedidoBtn = d.getElementById('pizza-pedido');
const fecha = d.querySelector('.fecha');
const observaciones = d.querySelector('.observaciones');

crearPedidoBtn.addEventListener('click', () => {
  const dataPedido = {
    platillo: tipoPizza.value,
    precio: 30000,
    cantidad: parseInt(cantidad.value),
    observaciones: observaciones.value,
    cliente: cliente.value,
    fecha: fecha.value,
  };

  console.log(dataPedido);

  crearPedido(dataPedido);
});

const crearPedido = async (data) => {
  const URL = 'http://localhost:3005/pedido';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const dataPedido = await response.json();

    if (dataPedido.success === true) {
      location.href = './pedidos.html';
    }
    console.log(dataPedido);
  } catch (error) {
    console.error(error);
  }
};
