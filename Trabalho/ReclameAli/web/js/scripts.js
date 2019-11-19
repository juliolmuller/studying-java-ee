
// Configurar toastr
toastr.options.showMethod = 'slideDown';
toastr.options.hideEasing = 'swing';
toastr.options.timeOut = 10000;

// Function to escape HTML
function escapeHTML(string) {
  if (string == undefined || string == null)
    return '';
  if (typeof(string) === 'object') {
    const obj = Object.assign({}, string);
    for (let o in obj)
      obj[o] = escapeHTML(obj[o]);
    return obj;
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(string).replace(/[&<>"']/g, m => map[m]);
}

// Colocar máscara nos formulários
const phoneMask = value => (value.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009');
const phoneConfig = {
  onKeyPress(value, event, field, options) {
    field.mask(phoneMask.apply({}, arguments), options);
  }
};
$('[name="first_name"]').mask('S'.repeat(30), { translation: { S: { pattern: /[A-Za-zÀ-ÖØ-öø-ÿ ]/ } } });
$('[name="last_name"]').mask('S'.repeat(150), { translation: { S: { pattern: /[A-Za-zÀ-ÖØ-öø-ÿ ]/ } } });
$('[name="cpf"]').mask('000.000.000-00', { reverse: true });
$('[name="date_birth"]').mask('00/00/0000');
$('[name="email"]').mask('S'.repeat(255), { translation: { S: { pattern: /[\w\.@]/ } } });
$('[name="phone"]').mask(phoneMask, phoneConfig);
$('[name="zip_code"]').mask('00000-000');
$('[name="street"]').mask('S'.repeat(255), { translation: { S: { pattern: /[A-Za-zÀ-ÖØ-öø-ÿ\.\,\d ]/ } } });
$('[name="number"]').mask('999990', { reverse: true });
$('[name="complement"]').mask('S'.repeat(30), { translation: { S: { pattern: /[A-Za-zÀ-ÖØ-öø-ÿ\.\,\d ]/ } } });
$('[name="city"]').mask('S'.repeat(80), { translation: { S: { pattern: /[A-Za-zÀ-ÖØ-öø-ÿ ]/ } } });
$('[name="weight"]').mask('999990', { reverse: true });
$('[name="utc_code"]').mask('0000.0000.0000', { reverse: true });
$('[name="ean_code"]').mask('0.000.000.000.000', { reverse: true });

// Configurar DatePicker para campo de data
$('[name="date_birth"]').datepicker({
  format: 'dd/mm/yyyy',
  days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  startView: 2,
  autoHide: true,
  zIndex: 2048
});

// Adicionar recurso de consulta de CEP
$('#find-zip_code').click(() => {
  let zipFormat = /([0-9]{5})-([0-9]{3})/;
  let zip = $('[name="zip_code"]').val();
  if (zip && zipFormat.test(zip)) {
    zip = zip.replace(zipFormat, '$1$2');
    $('[name="zip_code"]').prop('disabled', true);
    $('[name="street"]').val('');
    $('[name="number"]').val('');
    $('[name="complement"]').val('');
    $('[name="city"]').val('');
    $('[name="state"]').val('');
    $.ajax({
      method: 'GET',
      url: `https://viacep.com.br/ws/${zip}/json`,
      success(response) {
        $('[name="street"]').val(response.logradouro);
        $('[name="city"]').val(response.localidade);
        $('select[name="state"] option')
          .filter((index, el) => el.text.substring(0, 2) === response.uf)
          .prop('selected', true);
        $('[name="number"]').focus();
      },
      complete() {
        $('[name="zip_code"]').prop('disabled', false);
      }
    });
  }
});

// Função para extração dos dados do formulpario
function extractDataForm(formSelector) {
  const data = {};
  $(`${formSelector} [name]`).each((i, el) => data[el.name] = el.value);
  return data;
}

// Limpar formulário
function cleanForm(formSelector) {
  $(`${formSelector} [name]`).each((i, el) => {
    const type = $(el).attr('type');
    if (type == 'radio' || type == 'checkbox')
      $(el).prop('checked', false);
    else
      $(el).val('');
  });
}

// VErificar se formulário de signin está preenchido
$('#form-signin').submit(e => {
  const login = $(`#form-signin [name="login"]`).val();
  const pswd = $(`#form-signin [name="password"]`).val();
  if (!login || !pswd) {
    e.preventDefault();
    e.target.classList.add('was-validated');
  }
});

// Enviar dados de signup via AJAX
$('#form-signup').submit(e => {
  e.preventDefault();
  $('#form-signup .is-invalid').removeClass('is-invalid');
  $('#form-signup [type="submit"]').prop('disabled', true);
  const userData = extractDataForm('#form-signup');
  userData.terms = !!$('[name="terms"]').prop('checked');
  $.ajax({
    method: 'POST',
    url: e.target.action,
    data: userData,
    success() {
      let baseUrl = window.location.href.split('/');
      baseUrl[4] = 'cliente';
      window.location.href = baseUrl.join('/');
    },
    error({ responseJSON }) {
      console.error('Fail to register: review validation messages and try again');
      for (let err of responseJSON) {
        $(`#invalid-${err.field}`).text(err.message);
        $(`[name="${err.field}"]`).addClass('is-invalid');
      }
    },
    complete() {
      $('#form-signup [type="submit"]').removeAttr('disabled');
    }
  });
});

// Adicionar evento para checkbox
$('input[type="checkbox"]').on('change', function() {
  $(this).prop('checked', !$(this).prop('checked'));
});

// Contador de caracteres
function charCounter(e, selector, max) {
  $(selector).text(`Caracteres digitados: ${e.target.value.length}/${max}`);
}

// Constantes do módulo de categorias
const CATEGORY_TABLE = '#category-table';
const CATEGORY_FORM = '#category-form';
const CATEGORY_MODAL = '#category-modal';

// Excluir categoria
function deleteCategory(id, e) {
  if (confirm(`Tem certeza de que deseja excluir a categoria #${id}?`)) {
    const idStr = String(id).padStart(3, '0');
    $.ajax({
      method: 'POST',
      url: `${$(CATEGORY_FORM).attr('action')}?action=delete`,
      data: { id },
      success(response) {
        toastr.success(response.message);
        $(e.target).closest('tr').remove();
      },
      error(error) {
        const { status, responseJSON } = error;
        if (status == 422) {
          toastr.error(responseJSON.message);
        } else {
          console.error(error);
        }
      }
    });
  }
}

// Abrir modal/form para criação de categoria
function createCategory() {
  $(`${CATEGORY_FORM}-title`).text('Nova Categoria');
  $(CATEGORY_MODAL).modal('show');
  cleanForm(CATEGORY_FORM);
  $('#category-name').focus();
}

// Abrir modal/form para edição de categoria
function editCategory(id) {
  const idStr = String(id).padStart(3, '0');
  $(`${CATEGORY_FORM}-title`).text(`Editando Categoria #${idStr}`);
  $(CATEGORY_MODAL).modal('show');
  $.ajax({
    method: 'GET',
    url: `${$(CATEGORY_FORM).attr('action')}?id=${id}`,
    success(response) {
      const category = escapeHTML(response);
      cleanForm(CATEGORY_FORM);
      $(`${CATEGORY_FORM} [name="id"]`).val(category.id);
      $(`${CATEGORY_FORM} [name="name"]`).val(category.name).focus();
    },
    error(error) {
      console.error(error);
      $(CATEGORY_MODAL).modal('hide');
      toastr.error(`Falha ao tentar recuperar os dados da categoria #${idStr}`);
    }
  });
}

// Montar linha da tabela de categoria
function categoryRow(category = {}) {
  const escapedId = escapeHTML(category.id);
  return `
    <tr>
      <th scope="row" class="text-center">${escapedId.padStart(3, '0')}</th>
      <td>${escapeHTML(category.name)}</td>
      <td class="text-right">
        <button type="button" class="btn btn-sm btn-info" title="Editar" onclick="editCategory(${escapedId})"><i class="fas fa-edit"></i></button>
        <button type="submit" class="btn btn-sm btn-danger" title="Excluir" onclick="deleteCategory(${escapedId}, event)"><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  `;
}

// Configurar evento de submissão de formulário de categoria
$(CATEGORY_FORM).submit(e => {
  e.preventDefault();
  const category = extractDataForm(CATEGORY_FORM);
  $.ajax({
    method: 'POST',
    url: `${$(CATEGORY_FORM).attr('action')}?action=${!category.id ? 'new' : 'update'}`,
    data: category,
    success(response) {
      if (!category.id) {
        toastr.success('Categoria criada com sucesso');
        $(`${CATEGORY_TABLE} tbody`).append(categoryRow(response));
      } else {
        toastr.success('Categoria atualizada com sucesso');
        $(`${CATEGORY_TABLE} tbody tr`).filter((i, el) => Number($(el).children().first().text()) == category.id).replaceWith(categoryRow(response));
      }
      $(CATEGORY_MODAL).modal('hide');
    },
    error(error) {
      const { status, responseJSON } = error;
      if (status == 422) {
        responseJSON.forEach(err => toastr.error(err.message));
      } else {
        console.error(error);
      }
    }
  });
});

// Constantes do módulo de produtos
const PRODUCT_TABLE = '#product-table';
const PRODUCT_FORM = '#product-form';
const PRODUCT_MODAL = '#product-modal';

// Excluir produto
function deleteProduct(id, e) {
  if (confirm(`Tem certeza de que deseja excluir o produto #${id}?`)) {
    $.ajax({
      method: 'POST',
      url: `${$(PRODUCT_FORM).attr('action')}?action=delete`,
      data: { id },
      success(response) {
        toastr.success(response.message);
        $(e.target).closest('tr').remove();
      },
      error(error) {
        const { status, responseJSON } = error;
        if (status == 422) {
          toastr.error(responseJSON.message);
        } else {
          console.error(error);
        }
      }
    });
  }
}

// Abrir modal/form para criação de produto
function createProduct() {
  $(`${PRODUCT_FORM}-title`).text('Novo Produto');
  $(PRODUCT_MODAL).modal('show');
  cleanForm(PRODUCT_FORM);
  $('#product-name').focus();
}

// Abrir modal/form para edição de produto
function editProduct(id) {
  const idStr = String(id).padStart(6, '0');
  $(`${PRODUCT_FORM}-title`).text(`Editando Produto #${idStr}`);
  $(PRODUCT_MODAL).modal('show');
  $.ajax({
    method: 'GET',
    url: `${$(PRODUCT_FORM).attr('action')}?id=${id}`,
    success(response) {
      const product = escapeHTML(response);
      cleanForm(PRODUCT_FORM);
      $(`${PRODUCT_FORM} [name="id"]`).val(product.id);
      $(`${PRODUCT_FORM} [name="name"]`).val(product.name).focus();
      $(`${PRODUCT_FORM} [name="weight"]`).val(product.weight);
      $(`${PRODUCT_FORM} [name="category"]`).val(product.category.id);
      $(`${PRODUCT_FORM} [name="utc_code"]`).val(product.utc);
      $(`${PRODUCT_FORM} [name="ean_code"]`).val(product.ean);
      $(`${PRODUCT_FORM} [name="description"]`).val(product.description);
    },
    error(error) {
      console.error(error);
      $(PRODUCT_MODAL).modal('hide');
      toastr.error(`Falha ao tentar recuperar os dados do produto #${idStr}`);
    }
  });
}

// Montar linha da tabela de produtos
function productRow(product = {}) {
  const escapedId = escapeHTML(product.id);
  const escapedWeight = String(Number(escapeHTML(product.weight)).toFixed(1)).replace('.', ',');
  const escapedUtc = escapeHTML(product.utc).replace(/(\d{4})(\d{4})(\d{4})/, '$1.$2.$3');
  return `
    <tr>
      <th scope="row" class="text-center">${escapedId.padStart(6, '0')}</th>
      <td class="text-left">${escapeHTML(product.name)}</td>
      <td class="text-right">${escapedWeight}</td>
      <td class="text-center">${escapeHTML(product.category.name)}</td>
      <td class="text-center">${escapedUtc}</td>
      <td class="text-right">
        <button type="button" class="btn btn-sm btn-info" title="Editar" onclick="editProduct(${escapedId})"><i class="fas fa-edit"></i></button>
        <button type="submit" class="btn btn-sm btn-danger" title="Excluir" onclick="deleteProduct(${escapedId}, event)"><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  `;
}

// Configurar evento de submissão de formulário de produto
$(PRODUCT_FORM).submit(e => {
  e.preventDefault();
  const product = extractDataForm(PRODUCT_FORM);
  $.ajax({
    method: 'POST',
    url: `${$(PRODUCT_FORM).attr('action')}?action=${!product.id ? 'new' : 'update'}`,
    data: product,
    success(response) {
      if (!product.id) {
        toastr.success('Produto criado com sucesso');
        $(`${PRODUCT_TABLE} tbody`).append(productRow(response));
      } else {
        toastr.success('Produto atualizado com sucesso');
        $(`${PRODUCT_TABLE} tbody tr`).filter((i, el) => Number($(el).children().first().text()) == product.id).replaceWith(productRow(response));
      }
      $(PRODUCT_MODAL).modal('hide');
    },
    error(error) {
      const { status, responseJSON } = error;
      if (status == 422) {
        responseJSON.forEach(err => toastr.error(err.message));
      } else {
        console.error(error);
      }
    }
  });
});

// Constantes do módulo de usuários
const USER_TABLE = '#user-table';
const USER_MODAL = '#user-modal';
const USER_FORM = '#user-form';
const PSWD_MODAL = '#password-modal';
const PSWD_FORM = '#password-form';

// Formatar dados de usuário
function formatUserData(user, dateOptions = {}) {
  user.cpf = user.cpf.replace(/([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4');
  user.dateBirth = (new Date(`${user.dateBirth.year}-${user.dateBirth.month}-${user.dateBirth.day} 00:00:00`)).toLocaleDateString('pt-BR', dateOptions).replace(/ de /g, "-");
  user.phone = user.phone ? user.phone = user.phone.replace(/([0-9]{2})([0-9]{4,5})([0-9]{4})/, '($1) $2-$3') : '';
  user.address.zipCode = user.address.zipCode ? user.address.zipCode = user.address.zipCode.replace(/([0-9]{5})([0-9]{3})/, '$1-$2') : '';
}

// Excluir usuário
function deleteUser(id, e) {
  if (confirm('Se você excluir este usuário, todos os atendimentos associados a ele serão reassociados a você.\nTem certeza de que quer prosseguir com a exclusão?')) {
    $.ajax({
      method: 'POST',
      url: `${$(USER_FORM).attr('action')}?action=delete`,
      data: { id },
      success(response) {
        toastr.success(response.message);
        $(e.target).closest('tr').remove();
      },
      error(error) {
        const { status, responseJSON } = error;
        if (status == 422) {
          toastr.error(responseJSON.message);
        } else {
          console.error(error);
        }
      }
    });
  }
}

// Abrir modal/form para criação de usuário
function createUser() {
  $('#password-creation').show();
  $(`${USER_FORM}-title`).text('Cadastrar Colaborador');
  $(USER_MODAL).modal('show');
  cleanForm(USER_FORM);
  $('#user-first_name').focus();
}

// Abrir modal/form para edição de dados cadastrais
function editUser(id) {
  $('#password-creation').hide();
  $(`${USER_FORM} [name="cpf"]`).prop('readonly', true);
  $(`${USER_FORM}-title`).text(`Editar Colaborador (usuário #${id})`);
  $(USER_MODAL).modal('show');
  $.ajax({
    method: 'GET',
    url: `${$(USER_FORM).attr('action')}?id=${id}`,
    success(response) {
      const user = escapeHTML(response);
      formatUserData(user);
      cleanForm(USER_FORM);
      $(`${USER_FORM} [name="id"]`).val(user.id);
      $(`${USER_FORM} [name="role"][value="${user.role}"]`).prop("checked", true);
      $(`${USER_FORM} [name="first_name"]`).val(user.firstName).focus();
      $(`${USER_FORM} [name="last_name"]`).val(user.lastName).focus();
      $(`${USER_FORM} [name="cpf"]`).val(user.cpf);
      $(`${USER_FORM} [name="date_birth"]`).val(`${user.dateBirth}`);
      $(`${USER_FORM} [name="email"]`).val(user.email);
      $(`${USER_FORM} [name="phone"]`).val(user.phone);
      $(`${USER_FORM} [name="zip_code"]`).val(user.address.zipCode);
      $(`${USER_FORM} [name="street"]`).val(user.address.street);
      $(`${USER_FORM} [name="number"]`).val(user.address.number);
      $(`${USER_FORM} [name="complement"]`).val(user.address.complement);
      $(`${USER_FORM} [name="city"]`).val(user.address.city);
      $(`${USER_FORM} [name="state"]`).val(user.address.state ? user.address.state.id : '');
    },
    error(error) {
      console.error(error);
      $(USER_MODAL).modal('hide');
      toastr.error(`Falha ao tentar recuperar os dados do usuário #${id}`);
    }
  });
}

// Montar linha da tabela de usuários
function userRow(user = {}) {
  user = escapeHTML(user);
  formatUserData(user, { year: 'numeric', month: 'short', day: 'numeric' });
  user.role = (user.role == 'gerente') ? '<i class="fas fa-user-check"></i>' : '';
  return `
    <tr>
      <th scope="row" class="text-center">${user.cpf}</th>
      <td class="text-left">${user.firstName} ${user.lastName}</td>
      <td class="text-center">${user.dateBirth}</td>
      <td class="text-center">${user.phone}</td>
      <td class="text-center">${user.role}</td>
      <td class="text-right">
        <button type="button" class="btn btn-sm btn-info" title="Editar dados" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-sm btn-warning" title="Alterar senha" onclick="editPassword(${user.id})"><i class="fas fa-unlock-alt"></i></button>
        <button type="submit" class="btn btn-sm btn-danger" title="Excluir" onclick="deleteUser(${user.id}, event)"><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  `;
}

// Configurar evento de submissão de formulário de produto
$(USER_FORM).submit(e => {
  e.preventDefault();
  const product = extractDataForm(USER_FORM);
  $.ajax({
    method: 'POST',
    url: `${$(USER_FORM).attr('action')}?action=${!product.id ? 'new' : 'update'}`,
    data: product,
    success(response) {
      if (!product.id) {
        toastr.success('Usuário criado com sucesso');
        $(`${USER_TABLE} tbody`).append(productRow(response));
      } else {
        toastr.success('Usuário atualizado com sucesso');
        $(`${USER_TABLE} tbody tr`).filter((i, el) => Number($(el).children().first().text()) == product.id).replaceWith(productRow(response));
      }
      $(USER_MODAL).modal('hide');
    },
    error(error) {
      const { status, responseJSON } = error;
      if (status == 422) {
        responseJSON.forEach(err => toastr.error(err.message));
      } else {
        console.error(error);
      }
    }
  });
});








// TODO:s Adicionar recurso de busca de produto
$('#find-product').click(() => {
  const produto = $('#product-code').val();
  $('#product-details').show();
});

// Adicionar evento para linhas de tabelas
$('.c-clickable').click(function() {
  window.location = $(this).data('href');
});

// TODO: Adicionar evento para filtro de tabelas
$('#filtro-atendimentos').change(function() {
  $('tr').show();
  switch ($(this).val()) {
    case 'abertos':
      $('td span.badge-success')
        .parent()
        .parent()
        .hide();
      break;
    case 'vencidos':
      $('tbody tr').hide();
      $('tr.table-danger').show();
      break;
    case 'fechados':
      $('tbody tr').hide();
      $('td span.badge-success')
        .parent()
        .parent()
        .show();
      break;
  }
});
