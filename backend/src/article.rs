use actix_multipart::Multipart;
use actix_web::{delete, get, post, put, web, HttpResponse};
use futures_util::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use uuid::Uuid; // Create id of the article

// Article Struct
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Article {
    pub id: String,
    pub author: String,
    pub created: String,
    pub title: String,
    pub content: String,
    pub category: String,
    pub tags: Vec<String>,
    pub likes: u32,
}

#[get("/api/articles")]
pub async fn get_articles() -> HttpResponse {
    // Retrieve Article List from Local File System
    let articles = read_articles_from_file().await;

    // Return Article List as JSON
    HttpResponse::Ok().json(articles)
}

#[get("/api/articles/{id}")]
pub async fn get_article(path_id: web::Path<String>) -> HttpResponse {
    let id = path_id.into_inner();
    
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
    let data = tokio::fs::read_to_string("./data/articles.json")
        .await
        .unwrap_or_default();
    let articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();

    // Return Articles
    articles
}

pub async fn read_article_from_file(id: &str) -> Option<Article> {
    // Read Article Data from JSON File
    let data = tokio::fs::read_to_string("./data/articles.json")
        .await
        .unwrap_or_default();
    println!("Data: {:?}", data);

    let articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();
    println!("Articles: {:?}", articles);

    // Find Article with Matching ID
    let article = articles.into_iter().find(|article| article.id == id);
    println!("Article: {:?}", article);

    // Return Article or None
    article
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::prelude::*;
    use actix_web::{test, App};

    #[actix_rt::test]
    async fn test_get_article() {
        // Create test app with the get_article endpoint
        let mut app = test::init_service(App::new().service(get_article)).await;
    
        // Define test article ID
        let id = "1".to_string();
    
        // Make GET request to /api/articles/{id} endpoint
        let req = test::TestRequest::get().uri(&format!("/api/articles/{}", id)).to_request();
        let resp = test::call_service(&mut app, req).await;
    
        // Check if the response is a success (HTTP 200 OK)
        assert!(resp.status().is_success());
    
        // Check if the response body is valid JSON
        let body = test::read_body(resp).await;
        let article: Article = serde_json::from_slice(&body).unwrap();
        assert_eq!(article.id, id);
    }

    #[actix_rt::test]
    async fn test_files_service() {
        let mut app = test::init_service(
            App::new()
                .service(actix_files::Files::new("/src", "./frontend/src").show_files_listing())
        ).await;

        let req = test::TestRequest::get().uri("/src").to_request();
        let resp = test::call_service(&mut app, req).await;

        assert!(resp.status().is_success());
    }

}

