import platform
import sys
from datetime import datetime, timezone

from flask import Blueprint, jsonify

analytics_bp = Blueprint("analytics", __name__)

_START_TIME = datetime.now(timezone.utc)


@analytics_bp.route("/analytics", methods=["GET"])
def analytics():
    uptime = (datetime.now(timezone.utc) - _START_TIME).total_seconds()
    return jsonify({
        "uptime_seconds": round(uptime, 2),
        "python_version": sys.version.split()[0],
        "platform": platform.system(),
        "architecture": platform.machine(),
        "started_at": _START_TIME.isoformat(),
    })
