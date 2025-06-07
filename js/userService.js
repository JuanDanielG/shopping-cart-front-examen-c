function users(page = '') {
    document.getElementById('cardHeader').innerHTML = '<h5 class="fw-bolder fs-2">Listado de usuarios <i class="fa-solid fa-list-ul"></i></h5>'
    document.getElementById('info').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div></div>'

    const REQRES_ENDPOINT = page ? `https://dummyjson.com/users?page=${page}` : 'https://dummyjson.com/users'

    fetch(REQRES_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            return response.json().then(
                data => {
                    return {
                        status: response.status,
                        info: data
                    }
                }
            )
        })
        .then((result) => {
            if (result.status === 200) {
                let listUsers = `
                <button type="button" class="btn btn-outline-success mb-4" onclick="addUser()"><i class="fa-solid fa-user-plus"></i></button>
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `

                result.info.users.forEach(user => {
                    listUsers = listUsers + `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td><img src="${user.image}" class="img-thumbnail" alt="avatar del usuario" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="getUser('${user.id}')">Ver info <i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `
                });

                listUsers = listUsers + `
                    </tbody>
                </table>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item ${result.info.skip === 0 ? 'disabled' : ''}">
                            <a class="btn btn-outline-primary page-link" href="#" onclick="users('${Math.max(1, (result.info.skip / result.info.limit))}')">Anterior</a>
                        </li>
                        <li class="page-item active">
                            <span class="page-link">Página ${Math.floor(result.info.skip / result.info.limit) + 1}</span>
                        </li>
                        <li class="page-item ${result.info.skip + result.info.limit >= result.info.total ? 'disabled' : ''}">
                            <a class="btn btn-outline-primary page-link" href="#" onclick="users('${Math.floor(result.info.skip / result.info.limit) + 2}')">Siguiente</a>
                        </li>
                    </ul>
                </nav>
            `
                document.getElementById('info').innerHTML = listUsers
            }
            else {
                document.getElementById('info').innerHTML = '<div class="alert alert-warning" role="alert"><h4>No existen usuarios en la BD.</h4></div>'
            }
        })
        .catch((error) => {
            console.error('Error:', error)
            document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los usuarios</h4></div>'
        })
}

function getUser(idUser) {
    const REQRES_ENDPOINT = `https://dummyjson.com/users/${idUser}`

    fetch(REQRES_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            return response.json().then(
                data => {
                    return {
                        status: response.status,
                        info: data
                    }
                }
            )
        })
        .then((result) => {
            if (result.status === 200) {
                const user = result.info
                showModalUser(user)
            }
            else {
                document.getElementById('info').innerHTML =
                    '<div class="alert alert-danger" role="alert"><h4>No se encontró el usuario en la API.</h4></div>'
            }
        })
        .catch((error) => {
            console.error('Error:', error)
            document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar el usuario</h4></div>'
        })
}

function showModalUser(user) {
    const modalUser = `
    <!-- Modal -->
    <div class="modal fade" id="showModalUser" tabindex="-1" aria-labelledby="modalUserLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class=" fw-bolder fs-2 modal-title fs-5" id="modalUserLabel">Información del Usuario <i class="fa-regular fa-user"></i></h1>
            <button type="button" class=" btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${user.image}" class="img-fluid rounded mx-auto d-block" alt="Avatar del usuario">
                </div>
                <div class="col-md-8">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                            <p class="card-text"><strong>Nombre de usuario:</strong> ${user.username}</p>
                            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                            <p class="card-text"><strong>Teléfono:</strong> ${user.phone}</p>
                            <p class="card-text"><strong>Fecha de nacimiento:</strong> ${user.birthDate}</p>
                            <p class="card-text"><strong>Género:</strong> ${user.gender}</p>
                            <p class="card-text"><strong>Universidad:</strong> ${user.university}</p>
                            <p class="card-text"><strong>Dirección:</strong> ${user.address.address}, ${user.address.city}, ${user.address.state}</p>
                            <p class="card-text"><strong>Empresa:</strong> ${user.company.name} - ${user.company.title}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    `

    const existingModal = document.getElementById('showModalUser')
    if (existingModal) {
        existingModal.remove()
    }

    document.getElementById('showModal').innerHTML = modalUser
    const modal = new bootstrap.Modal(document.getElementById('showModalUser'))
    modal.show()
}
function addUser() {
    const modalUser = `
      <div class="modal fade" id="addUser" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 600px;">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addUserLabel">
                Agregar usuario <i class="fa-solid fa-user-plus"></i>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <form id="userForm">
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                  <div class="form-floating">
                    <input type="text" class="form-control" id="firstName" placeholder="Ingresa tu nombre">
                    <label for="firstName">Ingresa tu nombre</label>
                  </div>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa-solid fa-signature"></i></span>
                  <div class="form-floating">
                    <input type="text" class="form-control" id="lastName" placeholder="Ingresa tu apellido">
                    <label for="lastName">Ingresa tu apellido</label>
                  </div>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa-solid fa-list-ol"></i></span>
                  <div class="form-floating">
                    <input type="number" class="form-control" id="age" placeholder="Ingresa tu edad" min="1">
                    <label for="age">Ingresa tu edad</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" onclick="submitForm()">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.getElementById('showModal');
    container.innerHTML = modalUser;

    const modalElement = document.getElementById('addUser');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}
function submitForm() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const ageInput = document.getElementById('age');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const ageValue = ageInput.value.trim();
    const age = Number(ageValue);

    if (!firstName || !lastName || !ageValue || isNaN(age) || age <= 0) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const userData = {
        firstName,
        lastName,
        age,
    };

    fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario agregado:', data);
            alert("Usuario agregado con éxito!");

            firstNameInput.value = '';
            lastNameInput.value = '';
            ageInput.value = '';

            const modal = bootstrap.Modal.getInstance(document.getElementById('addUser'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error al agregar el usuario:', error);
            alert("Hubo un error al agregar el usuario.");
        });
}
