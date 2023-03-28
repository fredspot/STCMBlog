use actix_web::{get, web, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::article::Article;

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    keyword: Option<String>,
    category: Option<String>,
    tags: Option<String>,
}

#[get("/api/articles")]
pub async fn search_articles(query: web::Query<SearchQuery>) -> HttpResponse {
    // Retrieve Article List from Local File System
    let articles = read_articles_from_file().await;

    // Filter Articles by Search Criteria
    let filtered_articles = filter_articles(articles, &query);

    // Return Filtered Article List as JSON
    HttpResponse::Ok().json(filtered_articles)
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

pub fn filter_articles(mut articles: Vec<Article>, query: &SearchQuery) -> Vec<Article> {
    // Filter Articles by Search Criteria
    if let Some(keyword) = &query.keyword {
        articles = articles
            .into_iter()
            .filter(|article| article.title.contains(keyword) || article.content.contains(keyword))
            .collect();
    }

    if let Some(category) = &query.category {
        articles = articles.into_iter().filter(|article| article.category == *category).collect();
    }

    if let Some(tags) = &query.tags {
        let tags: Vec<&str> = serde_json::from_str(tags).unwrap_or_default();
        articles = articles
            .into_iter()
            .filter(|article| {
                let article_tags: Vec<&str> = article.tags.as_ref().unwrap().iter().map(|tag| tag.as_str()).collect();
                tags.iter().all(|tag| article_tags.contains(tag))
            })
            .collect();
    }

    // Return Filtered Articles
    articles
}
