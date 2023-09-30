from pathlib import Path as P

import chess
import chess.pgn

import pandas as pd

def get_first_moves(paths: list[P], num: int = -1, aggregate: bool = False):
    first_moves = []
    i = 0
    for path in paths:
        games = []
        with path.open("r") as pgn:
            while game := chess.pgn.read_game(pgn):
                if i == num:
                    break
                games.append(game)
                i += 1

        for game in games:
            for move in game.mainline_moves():
                first_moves.append({"from": move.from_square, "to": move.to_square, "result": game.headers["Result"]})
                break
    aggregation = aggregate_first_moves(first_moves) if aggregate else []

    return first_moves, aggregation


def aggregate_first_moves(first_moves: list[dict]) -> dict:
    aggregation = {}  # {"12, 28": {"count": 1}}
    for move in first_moves:
        move_string = f"{move['from']}, {move['to']}"
        if move_string not in aggregation:
            aggregation[move_string] = {"count": 1, "wins": 0, "win_percentage": 0}
        else:
            aggregation[move_string]["count"] += 1
        # Do win percentages here
        aggregation[move_string]["wins"] += 1 if move["result"] == "1-0" else 0
    for value in aggregation.values():
        value["win_percentage"] = value["wins"] / value["count"]
    return aggregation


def format_num_2_digits(num: int) -> str:
    return f"0{num}" if num < 10 else str(num)


def generate_dataframe():
    game_count = 0
    pgnPath = 'lichess_db_standard_rated_2013-01.pgn'
    # What features do we need here?
    games = pd.DataFrame(columns=['Date', 'AverageElo', 'Result', 'Opening', 'NumMoves'])


    with open(pgnPath) as f:
        # Limit number of games used for testing
        while game_count < 15:
            game = chess.pgn.read_game(f)

            if game is None:
                break

            game_count += 1
            game_info = []

            game_info.append(game.headers["UTCDate"])
            game_info.append((int(game.headers["WhiteElo"]) + int(game.headers["BlackElo"])) / 2)
            result = game.headers["Result"]
            game_info.append("White" if result == "1-0" else "Black" if result == "0-1" else "Draw")
            game_info.append(game.headers["Opening"])
            game_info.append(sum(1 for move in game.mainline_moves()))

            games.loc[len(games.index)] = game_info



