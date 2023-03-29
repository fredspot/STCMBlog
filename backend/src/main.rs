use actix_web::{get, web, App, HttpResponse, HttpServer, Result};
use actix_files::Files;
use std::fs;
use actix_files::NamedFile;
mod article;

#[get("/")]
async fn index() -> Result<HttpResponse> {
    let body = fs::read_to_string("./frontend/public/index.html").unwrap();
    Ok(HttpResponse::Ok().body(body))
}

#[get("/js/{filename}")]
async fn get_js(path_filename: web::Path<String>) -> Result<NamedFile> {
    let filename = path_filename.into_inner();
    let path = format!("./frontend/public/src/{}", filename);
    Ok(NamedFile::open(path)?)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
        .service(index)
        .service(get_js)
        .service(article::get_article)
        .service(article::get_articles)
        .service(actix_files::Files::new("/src", "./frontend/public/src").show_files_listing())
        .service(Files::new("/", "./frontend/public/").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
