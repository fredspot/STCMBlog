use actix_web::{get, web, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::article::Article;

#[get("/api/articles")]
pub async fn get_articles() -> HttpResponse {
    // Retrieve Article List from Local File System
    let articles = read_articles_from_file().await;

    // Return Article List as JSON
    HttpResponse::Ok().json(articles)
}

#[get("/api/articles/{id}")]
pub async fn get_article(web::Path(id): web::Path<String>) -> HttpResponse {
    // Retrieve Article Data from Local File System
    let article = read_article_from_file(&id).await;

    // Return Article Data as JSON
    if let Some(article) = article {
        HttpResponse::Ok().json(article)
    } else {
        HttpResponse::NotFound().body("Article not found")
    }
}

pub async fn read_articles_from_file() -> Vec<Article> {
    // Read Articles Data from JSON File
    let data = tokio::fs::read_to_string("backend/data/articles.json")
        .await
        .unwrap_or_default();
    let articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();

    // Return Articles
    articles
}

pub async fn read_article_from_file(id: &str) -> Option<Article> {
    // Read Article Data from JSON File
    let data = tokio::fs::read_to_string("backend/data/articles.json")
        .await
        .unwrap_or_default();
    let articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();

    // Find Article with Matching ID
    let article = articles.into_iter().find(|article| article.id == id);

    // Return Article or None
    article
}
