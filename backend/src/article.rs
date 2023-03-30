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

#[derive(Deserialize)]
pub struct LatestParams {
    count: Option<usize>,
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
    use chrono::Utc;
    use tempfile::tempdir;

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
    async fn test_get_latest_ids() {
        // Create a temporary directory and a sample articles file with 3 articles
        let dir = tempdir().unwrap();
        let articles_path = dir.path().join("articles.json");
        let mut file = File::create(&articles_path).unwrap();
        let articles = vec![            Article {                id: Uuid::new_v4().to_string(),                author: "Alice".to_string(),                created: Utc::now().to_rfc3339(),                title: "Article 1".to_string(),                content: "Lorem ipsum dolor sit amet.".to_string(),                category: "News".to_string(),                tags: vec!["tag1".to_string(), "tag2".to_string()],
                likes: 10,
            },
            Article {
                id: String::from("2"),
                author: "Bob".to_string(),
                created: Utc::now().to_rfc3339(),
                title: "Article 2".to_string(),
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".to_string(),
                category: "Technology".to_string(),
                tags: vec!["tag2".to_string(), "tag3".to_string()],
                likes: 20,
            },
            Article {
                id: String::from("1"),
                author: "Charlie".to_string(),
                created: Utc::now().to_rfc3339(),
                title: "Article 3".to_string(),
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.".to_string(),
                category: "Opinion".to_string(),
                tags: vec!["tag3".to_string(), "tag4".to_string()],
                likes: 30,
            },
        ];
        let articles_json = serde_json::to_string(&articles).unwrap();
        file.write_all(articles_json.as_bytes()).unwrap();

        // Call the retrieve_latest_ids function to retrieve the latest 2 IDs
        let latest_ids = retrieve_latest_ids(2).await;

        // Check that the result is the two latest IDs (in reverse order)
        assert_eq!(latest_ids, vec![articles[2].id.clone(), articles[1].id.clone()]);
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

