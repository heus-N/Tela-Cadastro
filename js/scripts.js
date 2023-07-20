const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const fantasynameInput = document.querySelector("#fantasy-name");
const cpfcnpjInput = document.querySelector("#cpf-cnpj");
const menutypeClick = document.querySelector("#menu-type");
const typeJur = document.querySelector("#pes-jur");
const typeFis = document.querySelector("#pes-fis");
const formInputs = document.querySelectorAll("[data-input]");

// CEP Input somente numeros
cepInput.addEventListener("keypress", (e) => {

    const onlyNumbers = /[0-9]|\./;
    const key = String.fromCharCode(e.keyCode);

    // permitir apenas numeros
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

// CPF Input somente numeros
cpfcnpjInput.addEventListener("keypress", (e) => {

    const onlyNumbers = /[0-9]|\./;
    const key = String.fromCharCode(e.keyCode);

    // permitir apenas numeros
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    //   checar se o CEP tem a quantidade necessarias de caracteres
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

// Pegar endereço pela API
const getAddress = async (cep) => {

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.erro === true) {
        if (!addressInput.hasAttribute("disabled")) {
            toggleDisabled();
        }

        addressForm.reset();
        alert('CEP Inválido, tente novamente.')
        return;
    }

    // Ativar ou desativar input caso esteja vazio
    if (addressInput.value === "") {
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;

};

const toggleDisabled = () => {
    if (addressInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
            input.removeAttribute("disabled");
            
        });
    } else {
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    }
};

// Salvar endereço
addressForm.addEventListener("submit", (e) => {

    e.preventDefault()

    setTimeout(() => {

        addressForm.reset();

        toggleDisabled();
    }, 1000);
})

// Habilitando e alterando campo nome fantasia caso pessoa juridica
typeJur.onclick = function () {
    fantasynameInput.disabled = false;
    fantasynameInput.placeholder = "Nome Fantasia";
    cpfcnpjInput.placeholder = "CNPJ";
}

// Desabilitando e alterando campo nome fantasia caso pessoa física
typeFis.onclick = function () {
    fantasynameInput.reset;
    fantasynameInput.disabled = true;
    fantasynameInput.placeholder = "--";
    cpfcnpjInput.placeholder = "CPF";
}

const KEY_DB = '@registerusers'

var listaRegistros = {
    lastId: 0,
    users: []
}

function saveDB() {
    localStorage.setItem(KEY_DB, JSON.stringify(listaRegistros))
}


function readDB() {
    const data = localStorage.getItem(KEY_DB)
    if (data) {
        listaRegistros = JSON.parse(data)
    }
    renderTable()
}


// Gerando a tabela
function renderTable() {
    const tbody = document.getElementById('lista-registros-body')
    if (tbody) {
        tbody.innerHTML = listaRegistros.users
            // Organizando usuarios em ordem alfabética de acordo com o nome
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1
            })

            .map(user => {
                return `<tr>
                    <td>${user.id}</td>
                    <td>${user.nome}</td>
                    <td>${user.endereco}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick='visualizar("cadastro", false, ${user.id})' class="btn btn-primary">Editar</button>
                        <button class="btn btn-danger" onclick='askDelete(${user.id})'>Deletar</button>
                        </td>
                </tr>`
            }).join('')
    }
}

// Adicionando usuarios a tabela
function insertUser(nome, endereco, email, cep, cpf, numero, bairro, nomefantasia, cidade, celular) {
    const id = listaRegistros.lastId + 1;
    listaRegistros.lastId = id;
    listaRegistros.users.push({
        id, nome, endereco, email, cep, cpf, numero, bairro, nomefantasia, cidade, celular
    })
    saveDB();
    renderTable();
    visualizar('lista');

}

function editUser(id, nome, endereco, email, cep, cpf, numero, bairro, nomefantasia, cidade, celular) {

    //cpfcnpjInput.setAttribute(disabled);

    var usuario = listaRegistros.users.find(usuario => usuario.id == id)
    usuario.nome = nome;
    usuario.endereco = endereco;
    usuario.email = email;
    usuario.cep = cep;
    //usuario.cpf = cpf;  //Linha comentada para não ser possivel a atualização de cpf
    usuario.numero = numero;
    usuario.bairro = bairro;
    usuario.nomefantasia = nomefantasia;
    usuario.cidade = cidade;
    usuario.celular = celular;
    saveDB();
    renderTable();
    visualizar('lista');
}

function deleteUser(id) {
    listaRegistros.users = listaRegistros.users.filter(user => {
        return user.id != id
    })
    saveDB()
    renderTable()
}

function askDelete(id) {
    if (confirm("Quer deletar o regitro de id: " + id + "?")) {
        deleteUser(id);
    }
}

function visualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina)
    if (pagina === 'cadastro') {
        addressForm.reset();
        toggleDisabled();
        if (novo) addressForm.reset()
        if (id) {
            const usuario = listaRegistros.users.find(user => user.id == id) // Procura por um usuario que tenha o mesmo ID
            if (usuario) {
                document.getElementById('user-id').value = usuario.id
                document.getElementById('name').value = usuario.nome
                document.getElementById('fantasy-name').value = usuario.nomefantasia
                document.getElementById('cep').value = usuario.cep
                document.getElementById('address').value = usuario.endereco
                document.getElementById('number').value = usuario.numero
                document.getElementById('neighborhood').value = usuario.bairro
                document.getElementById('city').value = usuario.cidade
                document.getElementById('cellphone').value = usuario.celular
                document.getElementById('email').value = usuario.email
            }
        }
        // Deixando campo de preenchimento cpf/cnpj como Focus para primeiro preenchimento
        document.getElementById('cpf-cnpj').focus();
    }
}

// Gerando usuarios para adicionar a tabela
function submitUser(e) {
    e.preventDefault()

    const data = {
        id: document.getElementById('user-id').value,
        nome: document.getElementById('name').value,
        endereco: document.getElementById('address').value,
        email: document.getElementById('email').value,
        cep: document.getElementById('cep').value,
        cpf: document.getElementById('cpf-cnpj').value,
        numero: document.getElementById('number').value,
        bairro: document.getElementById('neighborhood').value,
        nomefantasia: document.getElementById('fantasy-name').value,
        cidade: document.getElementById('city').value,
        celular: document.getElementById('cellphone').value,
    }

    const usuario = listaRegistros.users.find(user => user.cpf)

    if (data.id) {
        editUser(data.id, data.nome, data.endereco, data.email, data.cep, data.cpf, data.numero, data.bairro, data.nomefantasia, data.cidade, data.celular)
        alert('Usuario alterado')
    } else {
        if (usuario) {
            if (usuario.cpf === data.cpf) {
                alert('Cpf ja cadastrado. Tente novamente')
                addressForm.reset()
            } else {
                insertUser(data.nome, data.endereco, data.email, data.cep, data.cpf, data.numero, data.bairro, data.nomefantasia, data.cidade, data.celular)
                alert('Usuario salvo')
            }
        }else{
            insertUser(data.nome, data.endereco, data.email, data.cep, data.cpf, data.numero, data.bairro, data.nomefantasia, data.cidade, data.celular)
            alert('Usuario salvo')
        }
    }
}

window.addEventListener('load', () => {
    renderTable();
    readDB();
    document.getElementById('address-form').addEventListener('submit', submitUser);

})

