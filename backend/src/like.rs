use actix_web::{post, web, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::article::Article;

#[post("/api/articles/{id}/like")]
pub async fn like_article(web::Path(id): web::Path<String>) -> HttpResponse {
    // Retrieve Article List from Local File System
    let mut articles = read_articles_from_file().await;

    // Find Article by ID
    if let Some(article) = articles.iter_mut().find(|article| article.id == id) {
        // Increment Article Like Count
        article.likes += 1;

        // Write Updated Article List to Local File System
        write_articles_to_file(&articles).await;
        
        // Return Updated Article as JSON
        return HttpResponse::Ok().json(article);
    }

    // Return 404 Not Found Error if Article ID Not Found
    HttpResponse::NotFound().finish()
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

pub async fn write_articles_to_file(articles: &[Article]) {
    // Serialize Articles Data to JSON
    let data = serde_json::to_string_pretty(articles).unwrap();

    // Write Articles Data to JSON File
    tokio::fs::write("backend/data/articles.json", data)
        .await
        .unwrap_or_default();
}
