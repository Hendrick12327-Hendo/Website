import json
import sqlite3
import os

DB_FILE = "albums.db"
JSON_FILE = "src/data.json"

def create_database():
    """Create SQLite database and albums table if not exists."""
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    
    cur.execute('''
        DROP TABLE IF EXISTS albums
    ''')
    
    cur.execute('''
        CREATE TABLE albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rank INTEGER,
            year INTEGER,
            artist TEXT,
            release_date TEXT,
            genre TEXT,
            style TEXT,
            image_url TEXT,
            have INTEGER,
            want INTEGER,
            rating_count INTEGER,
            rating_average REAL,
            blur_game BOOLEAN
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database and table are ready.")

def insert_data():
    """Load JSON data and insert into the database."""
    if not os.path.exists(JSON_FILE):
        print(f"⚠️ JSON file '{JSON_FILE}' not found.")
        return

    with open(JSON_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    chunk_size = 1000  # Process 1000 albums at a time
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        for album in chunk:
            for name, info in album.items():
                cur.execute('''
                    INSERT INTO albums (
                        name, rank, year, artist, release_date, genre, style, image_url, have, want, rating_count, rating_average, blur_game
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    name, info['Rank'], info['Year'], info['Artist'], info['Release Date'], 
                    ','.join(info['Genre']), ','.join(info['Style']), info['Image URL'], 
                    info['Have'], info['Want'], info['Rating Count'], info['Rating Average'], info['Blur Game']
                ))
                print(f"Inserted album: {name}")
        conn.commit()  # Commit the data after each chunk
        print(f"Processed {i + chunk_size} albums")

    conn.close()
    print("✅ Data inserted successfully.")

def query_data():
    """Query and display sample album records."""
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    cur.execute("SELECT id, name, artist, year, image_url FROM albums LIMIT 10")
    rows = cur.fetchall()

    conn.close()

    print("\n📀 Sample Albums:")
    for row in rows:
        print(f"#{row[0]} - {row[1]} ({row[3]}) by {row[2]}")
        print(f"   Image URL: {row[4]}\n")

if __name__ == "__main__":
    create_database()  # Step 1: Create database and table
    insert_data()      # Step 2: Insert data from JSON
    query_data()       # Step 3: Query and display results
