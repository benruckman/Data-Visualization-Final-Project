import json
from pathlib import Path as P

from backend.clean_lichess_data import format_num_2_digits, get_first_moves

chess_path = P(__file__).parent.parent / "data" / "lichess"

#  "lichess_db_standard_rated_2013-01.pgn"
file_paths = [
    chess_path / "lichess_pgns" / f"lichess_db_standard_rated_2013-{format_num_2_digits(i)}.pgn" for i in range(1, 13)
]


def test_get_1000_first_moves_2013_01():
    first_moves, aggregation = get_first_moves(
        [chess_path / "lichess_pgns" / "lichess_db_standard_rated_2013-01.pgn"], num=1000, aggregate=True
    )
    (chess_path / "first_moves" / "1000_2013_01.json").write_text(json.dumps(first_moves, indent=2))
    (chess_path / "aggregation_of_first_moves" / "aggregation_1000_2013_01.json").write_text(
        json.dumps(aggregation, indent=2)
    )


def test_get_first_moves_2013_01():
    first_moves, aggregation = get_first_moves(
        [chess_path / "lichess_pgns" / "lichess_db_standard_rated_2013-01.pgn"], aggregate=True
    )
    (chess_path / "first_moves" / "all_2013_01.json").write_text(json.dumps(first_moves, indent=2))

    (chess_path / "aggregation_of_first_moves" / "aggregation_2013_01.json").write_text(
        json.dumps(aggregation, indent=2)
    )


def test_get_all_file_paths():
    first_moves, aggregation = get_first_moves(file_paths, aggregate=True)
    (chess_path / "first_moves" / "all.json").write_text(json.dumps(first_moves, indent=2))

    (chess_path / "aggregation_of_first_moves" / "all.json").write_text(json.dumps(aggregation, indent=2))
