function getCarts() {
    document.getElementById('cardHeader').innerHTML = '<h3 class="fw-bolder fs-2">Lista de Compras <i class="fa-solid fa-cart-shopping"></i></h3>';
    document.getElementById('info').innerHTML = 'Cargando...';

    fetch("https://dummyjson.com/carts", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(result => result.json())
        .then(data => {
            if (data.carts && data.carts.length > 0) {
                let listCarts = `
                <button type="button" class="btn btn-outline-success mb-4" onclick="addCart()"><i class="fa-solid fa-cart-plus"></i></button>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Id Carro</th>
                            <th scope="col">Productos Totales</th>
                            <th scope="col">Cantidad total</th>
                            <th scope="col">Precio total</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

                data.carts.forEach(cart => {
                    listCarts += `
                    <tr>
                        <td>${cart.id}</td>
                        <td>${cart.totalProducts}</td>
                        <td>${cart.totalQuantity}</td>
                        <td>$${cart.total.toFixed(2)}</td>
                        <td>
                            <button type="button" class="btn btn-outline-primary" onclick="showInfoCart(${cart.id})">Ver info <i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `;
                });

                listCarts += `
                    </tbody>
                </table>
            `;
                document.getElementById('info').innerHTML = listCarts;
            } else {
                document.getElementById('info').innerHTML = '<h3>No se encontró lista de compras</h3>';
            }
        })
        .catch(err => {
            console.error("Error al obtener la lista de carritos:", err);
            document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los usuarios</h4></div>';
        });
}

function showInfoCart(cartId) {
    console.log("id:" + cartId);
    fetch(`https://dummyjson.com/carts/${cartId}`)
        .then(res => {
            if (!res.ok) throw new Error('Carrito no encontrado');
            return res.json();
        })
        .then(cart => showModalCart(cart))
        .catch(err => {
            console.error("Error al obtener el carrito:", err);
            alert("Ocurrió un error al cargar los detalles del carrito.");
        });
}

function showModalCart(cart) {

    const modalContainer = document.getElementById('showModal');
    modalContainer.innerHTML = '';

    let productsHTML = '';
    cart.products.forEach(product => {
        productsHTML += `
            <div class="card mb-2">
              <div class="card-body d-flex align-items-center">
                <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid me-3" style="max-width: 100px; max-height: 100px;">
                <div>
                  <h6 class="card-title">${product.title}</h6>
                  <p class="card-text mb-1">Precio: $${product.price}</p>
                  <p class="card-text mb-1">Cantidad: ${product.quantity}</p>
                  <p class="card-text">Total: $${product.total}</p>
                </div>
              </div>
            </div>
        `;
    });

    const modalCart = `
        <div class="modal fade" id="modalCart" tabindex="-1" aria-labelledby="modalCartLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="fw-bolder fs-2   modal-title fs-5" id="modalCartLabel">ID Carro: ${cart.id}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <h5 class="fw-bold">User ID: ${cart.userId}</h5>
                <p>Total Productos: ${cart.totalProducts}</p>
                <p>Total Cantidad: ${cart.totalQuantity}</p>
                <p>Total: $${cart.total.toFixed(2)}</p>
                <p>Descuento Total: $${cart.discountedTotal.toFixed(2)}</p>
                <hr/>
                ${productsHTML}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar.</button>
              </div>
            </div>
          </div>
        </div>
    `;

    modalContainer.innerHTML = modalCart;

    const modal = new bootstrap.Modal(document.getElementById('modalCart'));
    modal.show();
}
function addCart() {
    const modalCart = `
    <div class="modal fade" id="addCartProduct" tabindex="-1" aria-labelledby="addCartProductLabel" aria-hidden="true">
      <div class="modal-dialog" style="max-width: 600px;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCartProductLabel">Agregar productos al carrito <i class="fa-solid fa-cart-plus"></i></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <form id="cartProductForm">
              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <div class="form-floating">
                  <input type="number" class="form-control" id="userId" placeholder="ID del usuario">
                  <label for="userId">ID del usuario</label>
                </div>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                <div class="form-floating">
                  <input type="number" class="form-control" id="productId" placeholder="ID del producto">
                  <label for="productId">ID del producto</label>
                </div>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-sort-numeric-up"></i></span>
                <div class="form-floating">
                  <input type="number" class="form-control" id="quantity" placeholder="Cantidad" min="1">
                  <label for="quantity">Cantidad</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" onclick="submitCartProductForm()">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.getElementById('showModal').innerHTML = modalCart;

    const modalElement = document.getElementById('addCartProduct');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function submitCartProductForm() {
    const userId = parseInt(document.getElementById('userId').value);
    const productId = parseInt(document.getElementById('productId').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (isNaN(userId) || isNaN(productId) || isNaN(quantity) || quantity < 1) {
        alert('Por favor completa todos los campos correctamente.');
        return;
    }

    const cartData = {
        userId: userId,
        products: [
            {
                id: productId,
                quantity: quantity,
            },
        ],
    };

    fetch('https://dummyjson.com/carts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
    })
        .then(res => res.json())
        .then(data => {
            console.log('Carrito actualizado:', data);
            alert('Producto agregado al carrito exitosamente.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCartProduct'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito.');
        });
}
