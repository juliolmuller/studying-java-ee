<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8" errorPage="/WEB-INF/jsp/error-page.jsp" %>

<t:baseLayout>

  <%-- Cabeçalho da página --%>
  <header class="container-fluid bg-dark mb-5">
    <nav class="navbar navbar-expand-lg navbar-dark" role="navigation">
      <a class="navbar-brand" href="index.html">
        <img src="${pageContext.request.contextPath}/img/reclame-ali-white.png" width="30" height="30" class="d-inline-block align-top" alt="Logo do sistema" />
        <span class="text-white-50 h4 c-title">Reclame Ali</span>
      </a>
      <div class="container">
        <ul class="navbar-nav text-white">
          <li class="nav-item">
            <a class="nav-link" href="${baseUri}">Início</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="${baseUri}/atendimentos">Meus Atendimentos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="${baseUri}/dados-pessoais">Meus Dados</a>
          </li>
        </ul>
      </div>
      <div class="form-inline">
        <a href="${pageContext.request.contextPath}/" class="btn btn-sm btn-outline-danger text-white my-2 my-sm-0">
          <i class="fas fa-door-open"></i>
          Sair
        </a>
      </div>
    </nav>
  </header>

  <!-- Corpo da página -->
  <main class="container">
    <h2 class="mb-4">
      Novo Atendimento
    </h2>

    <%-- Formulário para abertura de atendimento --%>
    <form action="${baseUri}/atendimentos/novo" method="POST">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label for="codigo-produto">Código de barras do produto:</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fas fa-barcode"></i>
                </span>
              </div>
              <input type="number" id="codigo-produto" class="form-control" placeholder="Exemplo: 789000000" />
              <div class="input-group-append">
                <button class="btn btn-secondary" type="button" id="buscar-produto">
                  Buscar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="detalhes-produto" class="col-12 col-md-6" style="display:none">
          <input type="hidden" name="produto_id" />
          <div class="form-group">
            <label for="produto-nome">Nome do produto:</label>
            <input type="text" id="produto-nome" class="form-control" value="Sabonete SOAP (aroma lavanda)" disabled />
          </div>
          <div class="form-group">
            <label for="produto-categoria">Categoria:</label>
            <input type="text" id="produto-categoria" class="form-control" value="Sabonetes" disabled />
          </div>
          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label for="produto-utc">Código UTC:</label>
                <input type="number" id="produto-utc" class="form-control" value="788792912250" disabled />
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label for="produto-ean">Código EAN:</label>
                <input type="number" id="produto-ean" class="form-control" value="3127888483996" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="form-group">
            <label for="atendimento-tipo">Motivo do atendimento:</label>
            <select id="atendimento-tipo" class="form-control" name="atendimento_tipo">
              <option>Selecione...</option>
              <option value="1">Financeiro</option>
              <option value="2">Produto não recebido</option>
              <option value="3">Produto com defeito</option>
              <option value="4">Saúde</option>
              <option value="5">Sugesões de melhoria</option>
              <option value="0">Outros</option>
            </select>
          </div>
          <div class="form-group">
            <label for="atendimento-desc">Descrição:</label>
            <textarea id="atendimento-desc" class="form-control" rows="5" name="desc"></textarea>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-lg btn-primary w-25">
        <i class="fas fa-paper-plane"></i>
        Enviar
      </button>
    </form>
  </main>

</t:baseLayout>
