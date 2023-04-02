use actix_multipart::Multipart;
use actix_web::{delete, get, post, put, web, http, HttpResponse, Responder};
use futures_util::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use uuid::Uuid; // Create id of the article
use serde_json::json;
use serde_json::Value;

// Article Struct
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Article {
    pub id: String,
    pub author: String,
    pub created: String,
    pub title: String,
    pub content: String,
    pub category: String,
    pub tags: Option<Vec<String>>,
}

#[derive(Deserialize)]
pub struct LatestParams {
    count: Option<usize>,
}

#[delete("/api/articles/{id}")]
pub async fn delete_article(path_id: web::Path<String>) -> HttpResponse {
    let id = path_id.into_inner();

    let mut articles = read_articles_from_file().await;
    let original_len = articles.len();

    articles.retain(|article| article.id != id);
    if original_len == articles.len() {
        return HttpResponse::NotFound().body("Article not found");
    }

    let file = File::create("./data/articles.json").unwrap();
    serde_json::to_writer(file, &articles).unwrap();

    HttpResponse::Ok().body("Article deleted")
}

#[put("/api/articles/{id}")]
pub async fn update_article(path_id: web::Path<String>, payload: web::Json<Value>) -> HttpResponse {
    let id = path_id.into_inner();

    let mut articles = read_articles_from_file().await;
    let index = articles.iter().position(|article| article.id == id);

    if let Some(index) = index {
        let mut updated_article = articles[index].clone();

        if let Some(title) = payload["title"].as_str() {
            updated_article.title = title.to_string();
        }
        if let Some(content) = payload["content"].as_str() {
            updated_article.content = content.to_string();
        }
        if let Some(category) = payload["category"].as_str() {
            updated_article.category = category.to_string();
        }
        if let Some(tags_str) = payload["tags"].as_str() {
            let tags: Vec<String> = tags_str.split(',').map(|tag| tag.trim().to_string()).collect();
            updated_article.tags = Some(tags);
        }

        articles[index] = updated_article.clone();

        let file = File::create("./data/articles.json").unwrap();
        serde_json::to_writer(file, &articles).unwrap();

        HttpResponse::Ok().json(updated_article)
    } else {
        HttpResponse::NotFound().body("Article not found")
    }
}

#[post("/api/create_article")]
pub async fn create_article(payload: web::Json<Value>) -> impl Responder {
    let title = payload["title"].as_str().unwrap();
    let content = payload["content"].as_str().unwrap();
    let author = payload["author"].as_str().unwrap();
    let category = payload["category"].as_str().unwrap();
    let tags_str = payload["tags"].as_str().unwrap();

    let tags: Vec<String> = tags_str.split(',').map(|tag| tag.trim().to_string()).collect();

    let article = Article {
        id: Uuid::new_v4().to_string(),
        author: author.to_string(),
        created: chrono::Utc::now().to_rfc3339(),
        title: title.to_string(),
        content: content.to_string(),
        category: category.to_string(),
        tags: Some(tags),
    };

    // Save the article to the "articles.json" file
    let mut articles: Vec<Article> = match File::open("./data/articles.json") {
        Ok(file) => serde_json::from_reader(file).unwrap_or_else(|_| vec![]),
        Err(_) => vec![],
    };
    articles.push(article.clone());
    let file = File::create("./data/articles.json").unwrap();
    serde_json::to_writer(file, &articles).unwrap();
    HttpResponse::Created().json(article)
}

#[get("/api/articles/latest")]
pub async fn get_latest_ids(web::Query(params): web::Query<LatestParams>) -> HttpResponse {
    let count = params.count.unwrap_or(10);
    let latest_ids = retrieve_latest_ids(count).await;

    // Return Latest IDs as JSON
    HttpResponse::Ok().json(latest_ids)
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

pub async fn retrieve_latest_ids(count: usize) -> Vec<String> {
    // Read Articles Data from JSON File
    let data = tokio::fs::read_to_string("./data/articles.json")
        .await
        .unwrap_or_default();
    let mut articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();

    // Sort Articles by Created Date (latest first) and extract the IDs
    articles.sort_by_key(|article| chrono::DateTime::parse_from_rfc3339(&article.created).unwrap());
    let latest_ids = articles.iter().rev().take(count).map(|article| article.id.clone()).collect();

    // Return Latest IDs
    latest_ids
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

    let articles: Vec<Article> = serde_json::from_str(&data).unwrap_or_default();

    // Find Article with Matching ID
    let article = articles.into_iter().find(|article| article.id == id);

    // Return Article or None
    article
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::prelude::*;
    use actix_web::{test, App, http::StatusCode};
    use chrono::Utc;
    use tempfile::tempdir;
    use actix_web::test::{init_service, TestRequest};

    #[actix_rt::test]
    async fn test_get_latest_ids_api() {
        // Create test app with the get_latest_ids endpoint
        let mut app = test::init_service(App::new().service(get_latest_ids)).await;
    
        // Define test parameters
        let count = 2;
    
        // Make GET request to /api/articles/latest endpoint
        let req = test::TestRequest::get()
            .uri(&format!("/api/articles/latest?count={}", count))
            .to_request();
        let resp = test::call_service(&mut app, req).await;
    
        // Check if the response is a success (HTTP 200 OK)
        assert!(resp.status().is_success());
    
        // Check if the response body is valid JSON
        let body = test::read_body(resp).await;
        let latest_ids: Vec<String> = serde_json::from_slice(&body).unwrap();
        assert_eq!(latest_ids.len(), count);
    }

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

