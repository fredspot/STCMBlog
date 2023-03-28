use actix_web::{post, web, HttpResponse};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;

// Struct for Login Request Data
#[derive(Debug, Deserialize)]
pub struct LoginData {
    pub username: String,
    pub password: String,
}

// Struct for Login Response Data
#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
}

// Login Handler Function
#[post("/api/login")]
pub async fn login(data: web::Json<LoginData>) -> HttpResponse {
    // Read Valid Logins from auth.json File
    let mut file = File::open("auth.json").expect("File not found");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("Error reading file");
    let valid_logins: Vec<LoginData> = serde_json::from_str(&contents).expect("Error parsing JSON");

    // Check if User Credentials are Valid
    if valid_logins.iter().any(|login| login.username == data.username && login.password == data.password) {
        // Return OK Status Code and Empty Response Body
        HttpResponse::Ok().finish()
    } else {
        // Return Unauthorized Status Code
        HttpResponse::Unauthorized().finish()
    }
}
