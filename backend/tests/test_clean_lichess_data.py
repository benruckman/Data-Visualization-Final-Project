import json
from pathlib import Path as P

from backend.clean_lichess_data import format_num_2_digits, get_first_moves, optimized_get_aggregate_first_moves

chess_path = P(__file__).parent.parent / "data" / "lichess"

#  "lichess_db_standard_rated_2013-01.pgn"
file_paths = [
    chess_path / "lichess_pgns" / f"lichess_db_standard_rated_2013-{format_num_2_digits(i)}.pgn" for i in range(1, 13)
]

all_file_paths = [
    chess_path / "lichess_pgns" / f"lichess_db_standard_rated_{year}-{format_num_2_digits(month)}.pgn"
    for year in range(2013, 2024)
    for month in range(1, 13)
]


def test_get_1000_first_moves_2013_01():
    first_moves, aggregation = get_first_moves([all_file_paths[0]], num=1000, aggregate=True, all=False)
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
    (chess_path / "first_moves" / "too_large_all.json").write_text(json.dumps(first_moves, indent=2))

    (chess_path / "aggregation_of_first_moves" / "all.json").write_text(json.dumps(aggregation, indent=2))


def test_get_all_file_paths_for_each_month():
    paths = all_file_paths[:-4]
    start_year = 2016
    start_month = 1
    for year in range(start_year, 2024):
        for month in range(start_month, 13):
            if year == start_year and month < start_month:
                continue

            i = (year - 2013) * 12 + month - 1
            print(i)
            aggregation = optimized_get_aggregate_first_moves(paths[i])
            (chess_path / "aggregation_of_first_moves" / "all" / f"{year}-{month}.json").write_text(
                json.dumps(aggregation, indent=2)
            )
            i = i + 1


def test_get_1000_first_moves_optimized_2013_01():
    aggregation = optimized_get_aggregate_first_moves(all_file_paths[0], num_games=1000)
    (chess_path / "aggregation_of_first_moves" / "aggregation_1000_2013_01.json").write_text(
        json.dumps(aggregation, indent=2)
    )


def test_aggregate_the_aggregated_data_into_years():
    years = [2013, 2014, 2015, 2016, 2017, 2018, 2019]
    all_years_aggregation = {}
    for year in years:
        aggregation = {}
        for month in range(1, 13):
            aggregation_of_month: dict = json.loads(
                (chess_path / "aggregation_of_first_moves" / "all" / f"{year}-{month}.json").read_text()
            )
            for move in aggregation_of_month:
                if move in aggregation:
                    aggregation[move]["count"] += aggregation_of_month[move]["count"]
                    aggregation[move]["wins"] += aggregation_of_month[move]["wins"]
                else:
                    aggregation[move] = {}
                    aggregation[move]["count"] = aggregation_of_month[move]["count"]
                    aggregation[move]["wins"] = aggregation_of_month[move]["wins"]
            
        for move in aggregation:
            aggregation[move]["win_percentage"] = aggregation[move]["wins"] / aggregation[move]["count"]
        (chess_path / "aggregation_of_first_moves" / "all" / "years" / f"{year}.json").write_text(
            json.dumps(aggregation, indent=2)
        )

        for move in aggregation:
            if move in all_years_aggregation:
                all_years_aggregation[move]["count"] += aggregation[move]["count"]
                all_years_aggregation[move]["wins"] += aggregation[move]["wins"]
            else:
                all_years_aggregation[move] = {}
                all_years_aggregation[move]["count"] = aggregation[move]["count"]
                all_years_aggregation[move]["wins"] = aggregation[move]["wins"]

    for move in all_years_aggregation:
        all_years_aggregation[move]["win_percentage"] = all_years_aggregation[move]["wins"] / all_years_aggregation[move]["count"]
    (chess_path / "aggregation_of_first_moves" / "all" / "years" / "all_years.json").write_text(
        json.dumps(all_years_aggregation, indent=2)
    )

