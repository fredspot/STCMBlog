use actix_web::{web, get, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::article::Article;

// Extension trait to add a method to `Path` that returns the `id` field.
trait PathId {
    fn id(&self) -> &str;
}

impl PathId for web::Path<(String,)> {
    fn id(&self) -> &str {
        &self.0
    }
}

#[get("/api/articles/{id}/share")]
pub async fn share_article(path: web::Path<(String,)>) -> HttpResponse {
    // Retrieve Article List from Local File System
    let articles = read_articles_from_file().await;

    // Find Article by ID
    if let Some(article_index) = articles.iter().position(|a| a.id == path.id()) {
        // Construct Share URL
        let share_url = format!("{}/article/{}", "http://localhost:8000", article_index);

        // Return Share URL as Plain Text
        return HttpResponse::Ok().content_type("text/plain").body(share_url);
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
