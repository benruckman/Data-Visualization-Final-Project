from pathlib import Path as P

import chess
import chess.pgn


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
                first_moves.append({"from": move.from_square, "to": move.to_square})
                break
    aggregation = aggregate_first_moves(first_moves) if aggregate else []

    return first_moves, aggregation


def aggregate_first_moves(first_moves: list[dict]) -> dict:
    aggregation = {}  # {"12, 28": {"count": 1}}
    for move in first_moves:
        move_string = f"{move['from']}, {move['to']}"
        if move_string not in aggregation:
            aggregation[move_string] = {"count": 1}
        else:
            aggregation[move_string]["count"] += 1
    return aggregation


def format_num_2_digits(num: int) -> str:
    return f"0{num}" if num < 10 else str(num)
