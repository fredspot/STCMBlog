use actix_multipart::{Multipart};
use actix_web::{delete, get, post, put, web, HttpResponse};
use futures_util::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use std::fs::{File};
use std::io::prelude::*;
use uuid::Uuid;


// Article Struct
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Article {
    pub id: String,
    pub title: String,
    pub content: String,
    pub category: String,
    pub tags: Option<Vec<String>>,
    pub image_url: Option<String>,
    pub likes: u32,
}

// Article Handler Functions
#[get("/api/articles")]
pub async fn get_articles() -> HttpResponse {
    // Read Articles from JSON File
    let articles = read_articles_from_file();

    // Return Articles in JSON Response
    HttpResponse::Ok().json(articles)
}

#[get("/api/articles/{id}")]
pub async fn get_article(path: web::Path<(String,)>) -> HttpResponse {
    // Read Articles from JSON File
    let articles = read_articles_from_file();

    // Find Article with Matching ID
    let article = articles.iter().find(|a| a.id == path.id());

    // Return Article in JSON Response if Found, Otherwise Return Not Found Status Code
    if let Some(article) = article {
        HttpResponse::Ok().json(article)
    } else {
        HttpResponse::NotFound().finish()
    }
}

// Extension trait to add a method to `Path` that returns the `id` field.
trait PathId {
    fn id(&self) -> &str;
}

impl PathId for web::Path<(String,)> {
    fn id(&self) -> &str {
        &self.0
    }
}

#[post("/api/articles")]
pub async fn create_article(mut payload: Multipart) -> HttpResponse {
    // Parse Form Data from Request
    let mut title = None;
    let mut content = None;
    let mut category = None;
    let mut tags: Option<&str> = None;
    let mut image_path = None;

    while let Ok(Some(mut item)) = payload.try_next().await {
        let content_disposition = item.content_disposition();
        let field_name = content_disposition.get_name().expect("REASON").to_string();
        match field_name.as_str() {
            "title" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                title = Some(String::from_utf8(buffer).unwrap());
            }
            "content" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                content = Some(String::from_utf8(buffer).unwrap());
            }
            "category" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                category = Some(String::from_utf8(buffer).unwrap());
            }
            "tags" => {
                let mut tags_buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    tags_buffer.extend_from_slice(&data);
                }
                let tags = match tags_buffer.len() {
                    0 => None,
                    _ => Some(String::from_utf8(tags_buffer).unwrap()),
                };
            }
            "file" => {
                // Generate Unique Filename for Image
                let ext = item.content_type().unwrap().subtype();
                let filename = format!("{}-{}.{}", Uuid::new_v4(), Uuid::new_v4(), ext);
                image_path = Some(format!("/static/images/{}", filename));

                // Save Image to Disk
                let mut f = File::create(format!("static/images/{}", filename)).unwrap();
                while let Some(chunk) = item.next().await {
                    let data = chunk.unwrap();
                    f.write_all(&data).unwrap();
                }
            }
            _ => {}
            }
    }

    // Create Article Object with Form Data
    let id = Uuid::new_v4().to_string();
    let title = title.unwrap();
    let content = content.unwrap();
    let category = category.unwrap();
    let tags = serde_json::from_str(&tags.unwrap()).unwrap();
    let image_url = image_path;

    let article = Article {
        id,
        title,
        content,
        category,
        tags,
        image_url,
        likes: 0,
    };

    // Append Article to JSON File
    let mut articles = read_articles_from_file();
    articles.push(article.clone());
    write_articles_to_file(&articles);

    // Return Created Article in JSON Response
    HttpResponse::Created().json(article)
}

#[put("/api/articles/{id}")]
pub async fn update_article(path: web::Path<(String,)>, mut payload: Multipart) -> HttpResponse {
    // Parse Form Data from Request
    let mut title = None;
    let mut content = None;
    let mut category = None;
    let mut tags: Option<&str> = None;
    let mut image_path = None;
    let mut likes: u32 = 0;

    while let Ok(Some(mut item)) = payload.try_next().await {
        let content_disposition = item.content_disposition();
        let field_name = content_disposition.get_name().expect("REASON").to_string();

        match field_name.as_str() {
            "title" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                title = Some(String::from_utf8(buffer).unwrap());
            }
            "content" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                content = Some(String::from_utf8(buffer).unwrap());
            }
            "category" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                category = Some(String::from_utf8(buffer).unwrap());
            }
            "tags" => {
                let mut tags_buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    tags_buffer.extend_from_slice(&data);
                }
                let tags = match tags_buffer.len() {
                    0 => None,
                    _ => Some(String::from_utf8(tags_buffer).unwrap()),
                };
            }
            "likes" => {
                let mut buffer = Vec::new();
                while let Some(chunk) = item.next().await {
                    let data = chunk.expect("Error while reading field data");
                    buffer.extend_from_slice(&data);
                }
                let likes_str = String::from_utf8(buffer).unwrap();
                likes = likes_str.parse::<u32>().unwrap();
            }
            "file" => {
                // Generate Unique Filename for Image
                let ext = item.content_type().unwrap().subtype();
                let filename = format!("{}-{}.{}", Uuid::new_v4(), Uuid::new_v4(), ext);
                image_path = Some(format!("/static/images/{}", filename));

                // Save Image to Disk
                let mut f = File::create(format!("static/images/{}", filename)).unwrap();
                while let Some(chunk) = item.next().await {
                    let data = chunk.unwrap();
                    f.write_all(&data).unwrap();
                }
            }
            _ => {}
        }
    }
    // Read Articles from JSON File
    let mut articles = read_articles_from_file();

    // Find Article with Matching ID
    if let Some(article_index) = articles.iter().position(|a| a.id == path.id()) {
        // Update Article Object with Form Data
        let title = title.unwrap();
        let content = content.unwrap();
        let category = category.unwrap();
        let tags = serde_json::from_str(&tags.unwrap()).unwrap();
        let image_url = image_path;
        let likes = likes;

        let article = Article {
            id: path.id().to_string(),
            title,
            content,
            category,
            tags,
            image_url,
            likes,
        };

        // Update Article in Articles Vector
        articles[article_index] = article.clone();

        // Write Articles Vector to JSON File
        write_articles_to_file(&articles);

        // Return Updated Article in JSON Response
        HttpResponse::Ok().json(article)
    } else {
        // Return Not Found Status Code
        HttpResponse::NotFound().finish()
    }
}

#[delete("/api/articles/{id}")]
pub async fn delete_article(path: web::Path<(String,)>) -> HttpResponse {
    // Read Articles from JSON File
    let mut articles = read_articles_from_file();

    // Find Article with Matching ID
    if let Some(article_index) = articles.iter().position(|a| a.id == path.id()) {
        // Remove Article from Articles Vector
        let deleted_article = articles.remove(article_index);

        // Write Articles Vector to JSON File
        write_articles_to_file(&articles);

        // Return Deleted Article in JSON Response
        HttpResponse::Ok().json(deleted_article)
    } else {
        // Return Not Found Status Code
        HttpResponse::NotFound().finish()
    }
}

// Helper Functions
fn read_articles_from_file() -> Vec<Article> {
    let mut file = File::open("backend/data/articles.json").expect("File not found");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("Error reading file");
    serde_json::from_str(&contents).unwrap()
}

fn write_articles_to_file(articles: &[Article]) {
    // Serialize Articles to JSON
    let json = serde_json::to_string_pretty(&articles).unwrap();

    // Write JSON to File
    let mut file = File::create("backend/data/articles.json").expect("Error creating file");
    file.write_all(json.as_bytes()).expect("Error writing to file");
}
