-- migrate:up
CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    updated_at BIGINT
);

-- migrate:down
DROP TABLE IF EXISTS todos;
