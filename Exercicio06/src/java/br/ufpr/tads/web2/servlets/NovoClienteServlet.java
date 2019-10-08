package br.ufpr.tads.web2.servlets;

import br.ufpr.tads.web2.beans.Cliente;
import br.ufpr.tads.web2.beans.Endereco;
import br.ufpr.tads.web2.dao.ClienteDAO;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "NovoCliente", urlPatterns = {"/clientes/novo"})
public class NovoClienteServlet extends HttpServlet {

    // Retornar o formulário de cadastro de cliente
    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        // Redirecionar para formulário de cadastro
        request.getRequestDispatcher("/jsp/clientesForm.jsp").forward(request, response);
    }

    // Recebe os dados do cliente e salva em banco de dados
    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        // Definir encoding dos dados da requisição
        request.setCharacterEncoding("UTF-8");

        // Salvar parâmetros da requisição em bean
        String cpf = request.getParameter("cpf");
        Cliente cliente = new Cliente();
        Endereco endereco = new Endereco();
        cliente.setCpf(cpf);
        cliente.setNome(request.getParameter("nome"));
        cliente.setEmail(request.getParameter("email"));
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            cliente.setDataNasc(formatter.parse(request.getParameter("nasc")));
        } catch (ParseException | NullPointerException e) {
            cliente.setDataNasc(null);
        }
        endereco.setCep(request.getParameter("cep"));
        endereco.setRua(request.getParameter("rua"));
        endereco.setNumero(Integer.parseInt(request.getParameter("numero")));
        endereco.setCidade(request.getParameter("cidade"));
        endereco.setUf(request.getParameter("estado"));
        cliente.setEndereco(endereco);

        // Validar se CPF já está cadastrado
        if (ClienteDAO.comCpf(cpf) != null) {
            request.setAttribute("cliente", cliente);
            request.setAttribute("erro", "CPF já cadastrado!");
            this.doGet(request, response);
            return;
        }

        // Salvar cliente em banco de dados e redirecionar para lista
        ClienteDAO.inserir(cliente);
        response.sendRedirect(request.getContextPath() + "/clientes");
    }
}