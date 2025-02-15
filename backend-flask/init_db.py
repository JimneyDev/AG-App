import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")  # Create or connect to SQLite database
    cursor = conn.cursor()

    # Read schema.sql and execute its commands
    with open("schema.sql", "r") as f:
        cursor.executescript(f.read())

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
