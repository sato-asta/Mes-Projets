import requests

class APIsports:
    def __init__(self):
        self.base_url = "https://www.thesportsdb.com/api/v1/json/3"

    def scrap_team_data(self, team_name):
        url = f"{self.base_url}/searchteams.php?t={team_name}"
        team_dt = requests.get(url).json()

        if not team_dt["teams"]:
            return None
        
        team_info = team_dt["teams"][0]
        team_id = team_info["idTeam"]

        url = f"{self.base_url}/eventsnext.php?id={team_id}"
        events = requests.get(url).json()
        next_event = events["events"][0] if events["events"] else None

        url = f"{self.base_url}/lookup_all_players.php?id={team_id}"
        players_dt = requests.get(url).json()
        players = players_dt["player"] if players_dt["player"] else []

        return {
            "team": team_info,
            "next_events": next_event,
            "players": players
        }
    
    def format_team_data(self, data):
        if not data:
            return "No data available for this team"
        
        team = data["team"]
        event = data["next_event"]
        players = data["players"]

        text = f"team: {team['strTeam']}\n"
        text += f"stadium: {team['strStadium']}\n"
        text += f"country: {team['strCountry']}\n"

        if event:
            opponent = (event["strAwayTeam"]
                        if event["strHomeTeam"] == team["strTeam"]
                        else event["strHomeTeam"])
            text += "Next Match:\n"
            text += f"- Opponent: {opponent}\n"
            text += f"- Date: {event['dateEvent']}\n\n"
        
        text += "player (first 11):\n"
        for player in players[:11]:
            text += f"- {player['strPlayer']} ({player['strPosition']})\n"
        
        return text
    
    def get_team_knowledge(self, team_name):
        data = self.scrap_team_data(team_name)
        return self.format_team_data(data)