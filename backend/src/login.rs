use actix_web::{post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[post("/api/login")]
pub async fn login(payload: web::Json<LoginRequest>) -> impl Responder {
    let users: Vec<User> = match File::open("./data/auth.json") {
        Ok(file) => serde_json::from_reader(file).unwrap_or_else(|_| vec![]),
        Err(_) => vec![],
    };

    let user_exists = users.into_iter().any(|user| {
        user.username == payload.username && user.password == payload.password
    });

    if user_exists {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::Unauthorized().finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{http, test, App};

    #[actix_rt::test]
    async fn test_login() {
        let mut app = test::init_service(
            App::new()
                .service(login)
        )
        .await;

        let login_request = LoginRequest {
            username: "gok".to_string(),
            password: "stcm_fund00".to_string(),
        };

        let req = test::TestRequest::post()
            .uri("/api/login")
            .set_json(&login_request)
            .to_request();

        let resp = test::call_service(&mut app, req).await;

        assert_eq!(resp.status(), http::StatusCode::OK);
    }
}
