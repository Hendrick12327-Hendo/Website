# API Parser Program

Here's an example of what the data will look like (this is from the [The Dark Side Of The Moon](https://www.discogs.com/master/10362-Pink-Floyd-The-Dark-Side-Of-The-Moon) album)
```json
[
  {
    "The Dark Side Of The Moon": {
      "Rank": 1,
      "Year": 1973,
      "Artist": "Pink Floyd",
      "Release Date": "1973-03-24",
      "Genre": [
        "Rock"
      ],
      "Style": [
        "Prog Rock",
        "Psychedelic Rock"
      ],
      "Image URL": "https://i.discogs.com/zXua4jpY6oGzOfQcJAomuLZK8iPNitX7SMRqtJ5D__8/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE4NzMw/MTMtMTcyNzc2NDkx/OS04NTI3LmpwZWc.jpeg",
      "Have": 28210,
      "Want": 17816,
      "Rating Count": 2310,
      "Rating Average": 4.65,
      "Blur Game": false
    }
  }
]
```

It also saves the album covers in the folder `images/album_covers/ARTIST NAME - ALBUM NAME - RELEASE YEAR.jpg`. So, make sure to create the folder `images/album_covers` before running the program so it can actually save those images there.

Also, before running the code, run the following in the cmd:
```bash
cd Desktop/Website
pip install -r requirements.txt
python api.py
```
