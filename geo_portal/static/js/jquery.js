const server = 'http://172.21.12.90:3000/';
let botaoSalvarEstado = document.querySelector('button')

function limparLinhas (linhas) {
    linhas.forEach(element => {
        element.remove()
    });
}

function editarLinha (estado) {
    $('input[name=uf]').val(estado.uf);
    $('input[name=area]').val(estado.area);
    $('#salvar').data('id', estado.id)
}

function criarLinhas (response) {
    let corpoTabela = document.querySelector('tbody');
    let trs = document.querySelectorAll('tbody tr');

    limparLinhas(trs);

    response.forEach(estado => {

        let row = $('<tr/>');
        let tdEstado = $('<td/>');
        let tdArea = $('<td/>');
        let tdAcoes = $('<td/>');

        let botaoDeletar = $('<button/>');
        botaoDeletar.html('Deletar');
        botaoDeletar.addClass('btn btn-danger');
        botaoDeletar.on('click', () => deletarLinha(estado.id));

        let botaoEditar = $('<button/>');
        botaoEditar.html('Editar');
        botaoEditar.addClass('btn btn-info');
        botaoEditar.on('click', () => editarLinha(estado));

        tdEstado.html(estado.uf);
        tdArea.html(estado.area);

        botaoDeletar.appendTo(tdAcoes) // tdAcoes.appendChild(botaoDeletar);
        botaoEditar.appendTo(tdAcoes)

        tdEstado.appendTo(row); // igual a row.appendChild(tdEstado);
        tdArea.appendTo(row);
        tdAcoes.appendTo(row);

        row.appendTo(corpoTabela) // corpoTabela.appendChild(row);

    });
}

function listarEstado () {
    $.get(`${server}estados2`, function (data) {
        criarLinhas(data);
    });
}

function deletarLinha (id) {
    $.ajax({
        method: "DELETE",
        url: `${server}estados2/${id}`
    })
        .done(function (msg) {
            listarEstado()
        });
}

function criarEstado () {
    let objetoASerEnviado = {
        uf: $('input[name=uf]').val(),
        area: $('input[name=area]').val()
    };

    $.post(`${server}estados2`, objetoASerEnviado)
        .done(function (data) {
            listarEstado()
        });
}

function editarEstado (id) {

    let objetoASerEnviado = {
        uf: $('input[name=uf]').val(),
        area: $('input[name=area]').val()
    };

    $.ajax({
        method: "PUT",
        url: `${server}estados2/${id}`,
        data: objetoASerEnviado
    })
        .done(function (msg) {
            listarEstado()
        });
}

function salvarEstado () {
    let id = $('#salvar').data('id');
    if (id) {
        editarEstado(id)
    } else {
        criarEstado()
    }

}

listarEstado()
