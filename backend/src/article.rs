use actix_multipart::Multipart;
use actix_web::{delete, get, post, put, web, HttpResponse};
use futures_util::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use uuid::Uuid;

// Article Struct
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Article {
    pub id: String,
    pub title: String,
    pub content: String,
    pub category: String,
    pub tags: Vec<String>,
    pub likes: u32,
}