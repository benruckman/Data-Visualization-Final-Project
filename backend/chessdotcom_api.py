import asyncio

import requests
from chessdotcom.aio import ChessDotComResponse, Client, get_leaderboards, get_player_profile


class ChessDotComClient(Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rate_limit_handler.tries = 2
        self.rate_limit_handler.tts = 4
        self.request_config["headers"]["User-Agent"] = "ben.ruckman@live.com"

    async def gather_cors(self, cors: list[ChessDotComResponse]):
        return await asyncio.gather(*cors)

    async def get_players(self, usernames: list[str]):
        cors = [get_player_profile(name) for name in usernames]

        responses = await self.gather_cors(cors)
        return responses

    async def get_players_from_leaderboards(self):
        cors = [get_leaderboards()]

        response = await self.gather_cors(cors)
        return response[0].json["leaderboards"]
