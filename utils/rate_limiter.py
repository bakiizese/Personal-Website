import time
from collections import defaultdict
from functools import wraps

from flask import abort, request

_request_log: dict[str, list[float]] = defaultdict(list)


def rate_limit(max_calls: int = 5, window_seconds: int = 60):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            ip = request.remote_addr or "unknown"
            now = time.monotonic()
            cutoff = now - window_seconds
            _request_log[ip] = [t for t in _request_log[ip] if t > cutoff]
            if len(_request_log[ip]) >= max_calls:
                abort(429)
            _request_log[ip].append(now)
            return fn(*args, **kwargs)
        return wrapper
    return decorator
