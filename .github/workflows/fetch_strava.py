import os
import requests
import datetime 
import json 

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

def get_activity_stream(activity_id, access_token): 

    headers = {"Authorization": f"Bearer {access_token}"}

    url = f"https://www.strava.com/api/v3/activities/{activity_id}/streams"
    params = {
        'keys': 'distance,altitude,latlng',
        'key_by_type': 'true'
    }

    
    response = requests.get(url, headers=headers, params=params)
    

    
    if response.status_code == 200:
        print(response.json())
        return response.json()
    else : 
        print(f"Failed to fetch activity stream : {response.status_code} {response.text}")

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
        #print("Fetched activities:", activities)

        activities_date = os.listdir("./data/")

        for activ_date in activities_date:
            if activ_date == ".gitkeep":
                continue 
            print(activ_date)
            try : 
                day, month = activ_date.split("-")
                day = int(day) 
                month = int(month) 
                all_activities = []
                for activity in activities : 
                    try : 
                        start_date = activity['start_date_local']
                        start_date = datetime.datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%SZ')

                        if day == start_date.day and month == start_date.month and start_date.year == 2024: 
                            print("\t", activity, "\n")
                            activity_stream = get_activity_stream(activity["id"], access_token)

                            if activity_stream is not None : 
                                
                                all_activities.append(activity_stream)
                    except : 
                        continue 
                        
                if len(all_activities) > 0:
                                
                
                    with open("data/"+activ_date+"/stream.json", 'w') as file: 
                        json.dump(all_activities, file, indent=4)
                        print("\tStream saved")
                    
            
            except : 
                continue 
    else:
        print(f"Failed to fetch activities: {response.status_code} {response.text}")

