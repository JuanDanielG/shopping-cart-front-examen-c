async function getProducts() {
    document.getElementById('cardHeader').innerHTML = '<h3 class="fw-bolder fs-2">Lista de Productos <i class="fa-solid fa-boxes-stacked"></i></h3>';
    document.getElementById('info').innerHTML = '<p>Cargando productos...</p>';

    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        if (data.products?.length > 0) {
            let listProducts = `
            <button type="button" class="btn btn-outline-primary mb-4" onclick="addProduct()"><i class="fa-solid fa-square-plus"></i></button>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Marca</th>
                            <th>Imagen</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.products.forEach(product => {
                listProducts += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.brand}</td>
                        <td><img src="${product.thumbnail}" class="img-thumbnail" style="max-width: 60px;" alt="Producto"></td>
                        <td>
                            <button class="btn btn-outline-primary btn-sm" onclick="showInfoProduct(${product.id})">Ver info <i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `;
            });

            listProducts += `</tbody></table>`;
            document.getElementById('info').innerHTML = listProducts;
        } else {
            document.getElementById('info').innerHTML = '<h3>No se encontraron productos.</h3>';
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los usuarios</h4></div>';
    }
}

async function showInfoProduct(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        showModalProduct(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        alert("No se pudo cargar la información del producto.");
    }
}

function showModalProduct(product) {
    const reviews = product.reviews?.map(review => `
        <div class="border rounded p-2 mb-2">
            <strong>${review.reviewerName}</strong> (${review.rating}/5)<br>
            <small>${new Date(review.date).toLocaleDateString()}</small><br>
            <p>${review.comment}</p>
        </div>
    `).join('') || "<p>Sin reseñas disponibles.</p>";

    const modalHTML = `
        <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="fw-bolder fs-2 modal-title">${product.title}</h5>
                        <button type="button" class="btn-outline-secondary" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${product.thumbnail}" class="img-fluid rounded" alt="${product.title}">
                                <p><strong>Stock:</strong> ${product.stock}</p>
                                <p><strong>Valoración:</strong> ${product.rating}</p>
                                <p><strong>Precio:</strong> $${product.price}</p>
                            </div>
                            <div class="col-md-8">
                                <p><strong>Descripción:</strong> ${product.description}</p>
                                <p><strong>Categoría:</strong> ${product.category}</p>
                                <p><strong>Marca:</strong> ${product.brand}</p>
                                <p><strong>SKU:</strong> ${product.sku}</p>
                                <p><strong>Política de Devolución:</strong> ${product.returnPolicy}</p>
                                <hr>
                                <h6>Reseñas:</h6>
                                ${reviews}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('showModal').innerHTML = modalHTML;

    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('modalProduct'));
        modal.show();
    }, 100);
}
function addProduct() {
    const modalProduct = `
    <div class="modal fade" id="addProduct" tabindex="-1" aria-labelledby="addProductLabel" aria-hidden="true">
      <div class="modal-dialog" style="max-width: 600px;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductLabel">Agregar producto <i class="fa-solid fa-box-open"></i></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <form id="productForm">
              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-tag"></i></span>
                <div class="form-floating">
                  <input type="text" class="form-control" id="title" placeholder="Nombre del producto">
                  <label for="title">Nombre del producto</label>
                </div>
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-info-circle"></i></span>
                <div class="form-floating">
                  <input type="text" class="form-control" id="description" placeholder="Descripción">
                  <label for="description">Descripción</label>
                </div>
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <div class="form-floating">
                  <input type="number" class="form-control" id="price" placeholder="Precio">
                  <label for="price">Precio</label>
                </div>
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-industry"></i></span>
                <div class="form-floating">
                  <input type="text" class="form-control" id="brand" placeholder="Marca">
                  <label for="brand">Marca</label>
                </div>
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text"><i class="fa-solid fa-list"></i></span>
                <div class="form-floating">
                  <input type="text" class="form-control" id="category" placeholder="Categoría">
                  <label for="category">Categoría</label>
                </div>
              </div>

            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-outline-primary" onclick="submitProductForm()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.getElementById('showModal').innerHTML = modalProduct;

    const modalElement = document.getElementById('addProduct');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function submitProductForm() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const brand = document.getElementById('brand').value.trim();
    const category = document.getElementById('category').value.trim();

    if (!title || !description || isNaN(price) || !brand || !category) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const productData = { title, description, price, brand, category };

    fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    })
        .then(res => res.json())
        .then(data => {
            console.log('Producto agregado:', data);
            alert('Producto agregado con éxito.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProduct'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error al agregar producto:', error);
            alert('Error al agregar el producto.');
        });
}
