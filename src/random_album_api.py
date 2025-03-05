from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import random
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_random_album():
    conn = sqlite3.connect('albums.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM albums ORDER BY RANDOM() LIMIT 1')
    album = cursor.fetchone()
    conn.close()
    return album

@app.route('/api/random_album', methods=['GET'])
def random_album():
    album = get_random_album()
    if album:
        album_data = {
            'id': album[0],
            'name': album[1],
            'rank': album[2],
            'year': album[3],
            'artist': album[4],
            'release_date': album[5],
            'genre': album[6].split(','),
            'style': album[7].split(','),
            'image_url': album[8],
            'have': album[9],
            'want': album[10],
            'rating_count': album[11],
            'rating_average': album[12],
            'blur_game': album[13]
        }
        return jsonify(album_data)
    else:
        return jsonify({'error': 'No album found'}), 404

@app.route('/api/test_db', methods=['GET'])
def test_db():
    conn = sqlite3.connect('albums.db')
    cursor = conn.cursor()
    cursor.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="albums"')
    table_exists = cursor.fetchone()
    if table_exists:
        cursor.execute('SELECT COUNT(*) FROM albums')
        count = cursor.fetchone()[0]
        return jsonify({'message': f'Table "albums" exists with {count} records.'})
    else:
        return jsonify({'error': 'Table "albums" does not exist.'})

if __name__ == '__main__':
    app.run(debug=True)