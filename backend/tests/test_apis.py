import json
from pathlib import Path as P

import pytest

from backend.apis import ChessDotComClient

chess_path = P(__file__).parent.parent / "data" / "chess.com"


@pytest.mark.asyncio()
async def test_get_player():
    chess_client = ChessDotComClient()
    usernames = ["fabianocaruana"]
    responses = await chess_client.get_players(usernames)
    profiles = [response.json for response in responses]
    (chess_path / "fabianocaruana.json").write_text(json.dumps(profiles, indent=2))


@pytest.mark.asyncio()
async def test_get_players():
    chess_client = ChessDotComClient()
    usernames = ["fabianocaruana", "GMHikaruOnTwitch", "MagnusCarlsen", "GarryKasparov"]
    responses = await chess_client.get_players(usernames)
    profiles = [response.json for response in responses]
    (chess_path / "users.json").write_text(json.dumps(profiles, indent=2))


@pytest.mark.asyncio()
async def test_get_players_from_leaderboard():
    chess_client = ChessDotComClient()
    profiles = await chess_client.get_players_from_leaderboards()
    (chess_path / "leaderboards.json").write_text(json.dumps(profiles, indent=2))
