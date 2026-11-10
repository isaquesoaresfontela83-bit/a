import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.util.concurrent.Executors;

public class SaborDaEmilly {
  public static void main(String[] args) throws Exception {
    int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
    Path root = Paths.get("public").toAbsolutePath().normalize();
    HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
    server.createContext("/", exchange -> serve(exchange, root));
    server.setExecutor(Executors.newCachedThreadPool());
    server.start();
    System.out.println("Sabor da Emily: http://127.0.0.1:" + port);
  }
  private static void serve(HttpExchange ex, Path root) throws IOException {
    if (!"GET".equals(ex.getRequestMethod()) && !"HEAD".equals(ex.getRequestMethod())) {
      ex.getResponseHeaders().set("Allow", "GET, HEAD"); ex.sendResponseHeaders(405, -1); return;
    }
    String path = ex.getRequestURI().getPath();
    if (path.equals("/")) path = "/index.html";
    Path file = root.resolve(path.substring(1)).normalize();
    if (!file.startsWith(root) || !Files.isRegularFile(file)) { ex.sendResponseHeaders(404, -1); return; }
    String type = file.toString().endsWith(".css") ? "text/css; charset=utf-8" : file.toString().endsWith(".js") ? "text/javascript; charset=utf-8" : file.toString().endsWith(".png") ? "image/png" : "text/html; charset=utf-8";
    byte[] bytes = Files.readAllBytes(file);
    ex.getResponseHeaders().set("Content-Type", type);
    ex.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
    ex.sendResponseHeaders(200, "HEAD".equals(ex.getRequestMethod()) ? -1 : bytes.length);
    if (!"HEAD".equals(ex.getRequestMethod())) { ex.getResponseBody().write(bytes); ex.close(); }
  }
}
