import json
import os
import sys
import time

import discogs_client
from discogs_client.exceptions import HTTPError


def authenticate():
    token_file = "discogs_auth.json"
    consumer_key = "GOQhnkutpMDUfHzwYSJX"
    consumer_secret = "sXIREiAaybjimLwaIGELIPMridcCrHDw"
    user_agent = "RAG/1.0"

    discogsclient = discogs_client.Client(user_agent)

    if os.path.exists(token_file):
        with open(token_file, "r") as f:
            tokens = json.load(f)
            access_token = tokens.get("access_token")
            access_secret = tokens.get("access_secret")

        if access_token and access_secret:
            discogsclient.set_consumer_key(consumer_key, consumer_secret)
            discogsclient.set_token(access_token, access_secret)

            try:
                user = discogsclient.identity()
                print(f"Authenticated as {user.username}")
                return discogsclient
            except HTTPError:
                print("Saved tokens are invalid or expired. Re-authenticating...")

    discogsclient.set_consumer_key(consumer_key, consumer_secret)
    token, secret, url = discogsclient.get_authorize_url()

    print(f"Please browse to the following URL: {url}")
    oauth_verifier = input("Enter the verification code: ")

    try:
        access_token, access_secret = discogsclient.get_access_token(oauth_verifier)
    except HTTPError:
        print("Unable to authenticate.")
        sys.exit(1)

    with open(token_file, "w") as f:
        json.dump({"access_token": access_token, "access_secret": access_secret}, f)

    user = discogsclient.identity()
    print(f"Authenticated as {user.username}")

    return discogsclient


def append_to_json(filename, new_entry):
    if os.path.exists(filename):
        with open(filename, "r+", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):
                    data = []
            except json.JSONDecodeError:
                data = []

            data.append(new_entry)
            f.seek(0)
            json.dump(data, f, indent=4, ensure_ascii=False)
    else:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump([new_entry], f, indent=4, ensure_ascii=False)


def main():
    discogsclient = authenticate()

    print("\nFetching top 10,000 most collected albums...\n")

    search_results = discogsclient.search(type="master", sort="want", sort_order="desc")

    json_file_name = "data.json"
    open(json_file_name, "w").close()

    counter = 0
    for search_result in search_results:
        counter += 1
        if counter == 10000:
            break

        try:
            time.sleep(1)

            album_data = {}

            master_release = discogsclient.master(search_result.id)
            url = master_release.data["resource_url"]

            data = discogsclient._fetcher.fetch(
                None, "GET", url, headers={"User-agent": discogsclient.user_agent}
            )
            data = json.loads(data[0])

            album_name = data["title"]

            year = data["year"]
            genres = data["genres"]
            styles = data["styles"]

            main_release_url = data["main_release_url"]
            unparsed_main_release_data = discogsclient._fetcher.fetch(
                None, "GET", main_release_url, headers={"User-agent": discogsclient.user_agent}
            )
            main_release_data = json.loads(unparsed_main_release_data[0])
            time.sleep(1)

            release_data = main_release_data["released"]

            artists = main_release_data["artists"][0]["name"]
            image_url = main_release_data["thumb"]

            have = main_release_data["community"]["have"]
            want = main_release_data["community"]["want"]
            rating_count = main_release_data["community"]["rating"]["count"]
            rating_average = main_release_data["community"]["rating"]["average"]

            album_data[album_name] = {
                "Rank": counter,
                "Year": year,
                "Artist": artists,
                "Release Date": release_data,
                "Genre": genres,
                "Style": styles,
                "Image URL": image_url,
                "Have": have,
                "Want": want,
                "Rating Count": rating_count,
                "Rating Average": rating_average,
                "Blur Game": False,
            }

            file_name = f"{artists} - {album_name} - {year}.jpg"

            time.sleep(1)

            content, resp = discogsclient._fetcher.fetch(
                None, "GET", image_url, headers={"User-agent": discogsclient.user_agent}
            )
            with open(f"images/album_covers/{file_name}", "wb") as fh:
                fh.write(content)

            print(" == Downloading Image ==")
            print(f"    * Album: {album_name}")
            print(f"    * Rank: {counter}")
            print(f"    * Artist(s): {artists}")
            print(f"    * Year: {year}")
            print(f"    * Image URL: {image_url}")
            print(f"    * Response Status: {resp}")
            print(f"    * Saving as: album_covers/{file_name}")

            append_to_json(json_file_name, album_data)
        except Exception as e:
            print(f"Error fetching data for {search_result.title}: {e}")

    print("\nData saved to data.json")


if __name__ == "__main__":
    main()
