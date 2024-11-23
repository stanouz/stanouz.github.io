import os
import requests

def refresh_access_token():
    """Refresh Strava API access token using refresh token."""
    client_id = os.environ['STRAVA_CLIENT_ID'] 
    client_secret = os.environ['STRAVA_CLIENT_SECRET']
    refresh_token = os.environ['STRAVA_REFRESH_TOKEN']

    url = "https://www.strava.com/oauth/token"
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    response = requests.post(url, data=data)

    if response.status_code == 200:
        token_data = response.json()
        print("Access token refreshed successfully!")
        print(f"New access token: {token_data['access_token']}")
        print(f"Expires in: {token_data['expires_in']} seconds")
        return token_data
    else:
        print(f"Failed to refresh token: {response.status_code} {response.text}")
        return None


# Refresh the token
token_data = refresh_access_token()

if token_data:
    # Use the new access token
    access_token = token_data["access_token"]

    print(access_token)


    # Example: Fetch activities with the new token
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get("https://www.strava.com/api/v3/athlete/activities", headers=headers)

    if response.status_code == 200:
        activities = response.json()
        print("Fetched activities:", activities)
    else:
        print(f"Failed to fetch activities: {response.status_code} {response.text}")


print(os.listdir("./data/"))
