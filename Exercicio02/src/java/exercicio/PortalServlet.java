
package exercicio;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "PortalServlet", urlPatterns = {"/portal"})
public class PortalServlet extends HttpServlet {

    protected void processRequest(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {
        
        // Recuperar sessão ativa ou redirecionar para tela de login
        HttpSession session = request.getSession(false);
        if (session == null) {
            response.sendRedirect(request.getContextPath());
            return;
        }
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        
        // Montar resposta ao usuário
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<meta charset=\"UTF-8\" />");
            out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />");
            out.println("<title>Web 2 :: Exercício 02</title>");
            out.println("<link rel=\"stylesheet\" href=\"" + request.getContextPath() + "/css/bootstrap.min.css\">");
            out.println("<link rel=\"stylesheet\" href=\"" + request.getContextPath() + "/css/portal-styles.css\">");
            out.println("</head>");
            out.println("<body>");
            // navbar que na realidade é apenas o título e um botão de logout
            out.println("<header>");
            out.println("<div id=\"wrapper-out\">");
            out.println("<div class=\"row justify-content-center fixed-top\" id=\"fake-navbar\">");
            out.println("<div class=\"col-2\"></div>");
            out.println("<div class=\"col-8\">");
            out.println("<h2 class=\"text-center\">Portal :: Exercício 2</h2></div>");
            out.println("<div class=\"col-2\">");
            out.println("<a href=\"" + request.getContextPath() + "/logout\">"
                    + "<button class=\"btn-danger rounded\">Logout</button></a></div>");
            out.println("</div>");
            out.println("</header>");
            // Inicio da main
            out.println("<main>");
            out.println("<div class=\"wrapper\">");
            out.println("<div class=\"alert alert-success w-100 text-center\" role=\"alert\" style=\"display:none\">Usuário Inserido</div>");
            out.println("<div class=\"alert alert-danger w-100 text-center\" role=\"alert\" style=\"display:none\"></div>");
            // Formulário::início
            
            out.println("<div id=\"form-content\">");
            out.println("<div class=\"container text-center\">");
            out.println("<h3>Adicionar novo usuário</h3>");
            // Formulário::campos
            out.println("<form>");
            out.println("<div class=\"form-group\">");
            out.println("<label for=\"usuario\">Nome do usuário</label>");
            out.println("<input type=\"text\" class=\"form-control\" name=\"nome\" id=\"usuario\" placeholder=\"Insira um nome\" autofocus/>");
            out.println("</div>");
            out.println("<div class=\"form-group\">");
            out.println("<label for=\"login\">Nome de login</label>"); 
            out.println("<input type=\"text\" class=\"form-control\" name=\"login\" id=\"login\" placeholder=\"Insira um login\"/>");
            out.println("</div>");
            out.println("<div class=\"form-group\">");
            out.println("<label for=\"senha\">Senha de acesso</label>");
            out.println("<input type=\"password\" class=\"form-control\" name=\"senha\" id=\"senha\" placeholder=\"Insira uma senha\"/>");
            out.println("</div>");
            out.println("<button type=\"submit\" id=\"btn-ok\">Cadastrar</button>");
            out.println("</form>");
            out.println("</div>");
            out.println("</div>");
            out.println("</div>");

            // tabela
            out.println("<div class=\"row justify-content-center\">");
            out.println("<div class=\"col-9\">");
            out.println("<table class=\"table table-stripped\">");
            out.println("<thead class=\"table-primary\">");
            out.println("<tr>");
            out.println("<th scope=\"col\">Nome do usuário</th>");
            out.println("<th scope=\"col\">Login de acesso</th>");
            out.println("<th scope=\"col\">Senha</th>");
            out.println("</tr>");
            out.println("</thead>");
            out.println("<tbody></tbody>");
            out.println("</table>");
            out.println("</div>");
            out.println("</div>");
            out.println("</main>");
            out.println("<script src=\"" + request.getContextPath() + "/js/jquery.min.js\"></script>");
            out.println("<script src=\"" + request.getContextPath() + "/js/portal-scripts.js\"></script>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
