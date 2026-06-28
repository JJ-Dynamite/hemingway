use axum::{Router, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct AnalyzeRequest { text: String }
#[derive(Serialize)]
struct Suggestion { sentence: String, issue: String, suggestion: String }
#[derive(Serialize)]
struct AnalyzeResponse { score: u32, grade: String, suggestions: Vec<Suggestion>, word_count: u32 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/analyze", axum::routing::post(analyze_text))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("hemingway backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "hemingway", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn analyze_text(Json(req): Json<AnalyzeRequest>) -> Json<AnalyzeResponse> {
    let words: Vec<&str> = req.text.split_whitespace().collect();
    let word_count = words.len() as u32;
    let suggestions = vec![
        Suggestion { sentence: "Passive voice detected".into(), issue: "Passive voice".into(), suggestion: "Use active voice for clarity".into() },
        Suggestion { sentence: "Complex sentence found".into(), issue: "Hard to read".into(), suggestion: "Break into shorter sentences".into() },
    ];
    let grade = if word_count > 50 { "Grade 8".into() } else { "Grade 5".into() };
    Json(AnalyzeResponse { score: 72, grade, suggestions, word_count })
}
