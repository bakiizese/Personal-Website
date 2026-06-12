import hashlib
import json
import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, current_app, jsonify, request

from utils.rate_limiter import rate_limit
from validators import validate_payload

contact_bp = Blueprint("contact", __name__)
log = logging.getLogger(__name__)


@contact_bp.route("/contact", methods=["POST"])
@rate_limit(max_calls=5, window_seconds=60)
def contact():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json."}), 400

    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Malformed JSON body."}), 400

    valid, error_msg = validate_payload(payload, "contact_schema")
    if not valid:
        return jsonify({"error": error_msg}), 400

    name = payload["name"].strip()
    email = payload["email"].strip()
    message = payload["message"].strip()

    ip_raw = request.remote_addr or "unknown"
    ip_hash = hashlib.sha256(ip_raw.encode()).hexdigest()[:12]

    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "name": name,
        "email": email,
        "message": message,
        "ip_hash": ip_hash,
    }

    log_path = current_app.config["CONTACT_LOG_PATH"]
    try:
        os.makedirs(os.path.dirname(log_path), exist_ok=True)
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError as exc:
        log.error("Failed to write contact record: %s", exc)
        return jsonify({"error": "Internal server error. Please try again later."}), 500

    log.info("Contact received from ip_hash=%s", ip_hash)
    return jsonify({"status": "ok", "message": "Transmission received."}), 200
