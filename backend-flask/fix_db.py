from app import app
from database import db  # Adjust this import based on your project structure
from sqlalchemy import text

def column_exists(conn, table, column):
    """Check if a column exists in a given table."""
    result = conn.execute(text(f"PRAGMA table_info({table});"))
    return any(row[1] == column for row in result.fetchall())

def fix_database():
    with app.app_context():
        with db.engine.connect() as conn:
            # Check if column exists before adding it
            if not column_exists(conn, "users", "username"):
                conn.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(120);"))
                conn.execute(text("UPDATE users SET username = 'default' WHERE username IS NULL;"))

            conn.commit()
            print("Database updated successfully!")

if __name__ == "__main__":
    fix_database()