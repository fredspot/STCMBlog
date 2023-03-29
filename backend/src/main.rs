use actix_web::{web, App, HttpServer, Responder};
use actix_files::Files;

mod article;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // prefixes all resources and routes attached to it...
            // ...so this handles requests for `GET /app/index.html`
            .service(Files::new("/", "../frontend").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}