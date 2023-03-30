use actix_web::{get, web, http, middleware, App, HttpResponse, HttpServer, Result};
use actix_files::Files;
use std::fs;
use actix_files::NamedFile;
mod article;
use actix_cors::Cors;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
        .wrap(Cors::default()
                .allow_any_origin()
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                .allowed_headers(vec![
                    http::header::AUTHORIZATION,
                    http::header::ACCEPT,
                    http::header::CONTENT_TYPE,
                ]))
            .wrap(middleware::Logger::default())
        .service(article::get_latest_ids)
        .service(article::get_article)
        .service(article::get_articles)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
