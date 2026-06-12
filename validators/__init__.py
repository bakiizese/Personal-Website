import json
import os

from jsonschema import FormatChecker, ValidationError, validate

_SCHEMA_DIR = os.path.dirname(__file__)


def load_schema(name: str) -> dict:
    path = os.path.join(_SCHEMA_DIR, f"{name}.json")
    with open(path) as f:
        return json.load(f)


def validate_payload(payload: dict, schema_name: str) -> tuple[bool, str | None]:
    schema = load_schema(schema_name)
    try:
        validate(instance=payload, schema=schema, format_checker=FormatChecker())
        return True, None
    except ValidationError as e:
        return False, e.message
