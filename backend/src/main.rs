use actix_web::{web, App, HttpServer};

mod article;
mod login;
mod read;
mod search;
mod like;
mod share;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Set up HTTP server
    let server = HttpServer::new(|| {
        App::new()
            .service(article::get_articles)
            .service(article::get_article)
            .service(
                web::resource("/api/articles")
                    .route(web::post().to(article::create_article)),
            )
            .service(article::update_article)
            .service(article::delete_article)
            .service(login::login)
            .service(read::get_read_page)
            .service(search::search_articles)
            .service(like::like_article)
            .service(share::share_article)
    })
    .bind("127.0.0.1:8080")?;

    println!("Server running at http://127.0.0.1:8080");

    // Run server
    server.run().await
}
