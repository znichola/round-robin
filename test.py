def expected_score(opponent_ratings: list[float], own_rating: float):
    """How many points we expect to score in a tourney with these opponents"""
    return sum(
        1 / (1 + 10**((opponent_rating - own_rating) / 400))
        for opponent_rating in opponent_ratings
    )


def performance_rating(opponent_ratings: list[float], score: float):
    """Calculate mathematically perfect performance rating with binary search"""
    lo, hi = 0, 4000

    while hi - lo > 0.001:
        mid = (lo + hi) / 2

        foo = expected_score(opponent_ratings, mid)
        # print(opponent_ratings, mid, foo)
        if expected_score(opponent_ratings, mid) < score:
            lo = mid
        else:
            hi = mid

    return round(mid)


print(performance_rating([1851, 2457, 1989, 2379, 2407], 4))  # should be 2551
print(performance_rating([1000, 1000], 1.5))  # should be 2551
# print(performance_rating([1000, 1000, 1000, 1000, 1000], 5))  # should be 2551
# print(performance_rating([1000, 1000, 1000, 1000, 1000, 1000], 1))  # should be 2551
# print(performance_rating([1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000 ], 1))  # should be 2551