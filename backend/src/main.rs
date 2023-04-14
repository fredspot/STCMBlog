use actix_web::{get, web, http, middleware, App, HttpResponse, HttpServer, Result};
use actix_files::Files;
use std::fs;
use actix_files::NamedFile;
mod article;
mod login;
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
                    ])
                    .allow_any_header()
            )
            .wrap(middleware::Logger::default())
            .service(article::get_latest_ids)
            .service(article::get_article)
            .service(article::get_articles)
            .service(article::create_article)
            .service(article::update_article)
            .service(article::delete_article)
            .service(article::search_articles)
            .service(article::get_tags)
            .service(login::login)
            // Add the temporary endpoint
            //.service(web::resource("/api/temp_search").route(web::get().to(article::search_articles_test)))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await    
}
