CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    slug varchar(8) UNIQUE NOT NULL,
    original_url varchar(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(8) NOT NULL REFERENCES urls(slug),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
