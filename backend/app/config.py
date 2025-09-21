from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@localhost:5432/facial_recognition"
    secret_key: str = "your-secret-key-here"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    redis_url: str = "redis://localhost:6379"
    recognition_threshold: float = 0.6
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"


settings = Settings()
