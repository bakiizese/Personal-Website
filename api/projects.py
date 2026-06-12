from flask import Blueprint, jsonify

projects_bp = Blueprint("projects", __name__)

_PROJECTS = [
    {
        "slug": "amharic-pipeline",
        "title": "Low-Resource Amharic Text Classification Pipeline",
        "stack": ["PyTorch", "NumPy", "Python Native"],
        "states": [
            {
                "label": "Ingestion & Serialization",
                "content": (
                    "Custom syllable/character-level tokenizer mapping native Ge'ez scripts "
                    "directly to dense, localized vocabulary coordinates — completely eliminating "
                    "Western-biased tokenization bloat and Out-of-Vocabulary [UNK] flags."
                ),
            },
            {
                "label": "Geometric Transformation",
                "content": (
                    "LongTensor (B, max_seq_len) passes to nn.Embedding to yield a 3D FloatTensor "
                    "(B, max_seq_len, 32). Sequence dimension mean-pooling compresses to uniform shape (B, 32)."
                ),
            },
            {
                "label": "Logit Projection & Loss",
                "content": (
                    "Linear layer projects hidden states into unnormalized logit arrays (B, 3), "
                    "optimized via Cross-Entropy Loss optimization curves."
                ),
            },
        ],
        "post_mortem": {
            "title": "Resolving PyTorch Memory Bloat via Dynamic Mini-Batch Collation",
            "body": (
                "In initial training runs, global padding caused severe tensor bloat by stretching all "
                "variable-length sentences to a global maximum, saturating memory. Resolved by engineering "
                "a custom dynamic collate function (collate_fn) inside the PyTorch DataLoader to dynamically "
                "pad arrays to the maximum length only within that isolated mini-batch, reducing memory "
                "overhead by 40% and stabilizing gradient updates."
            ),
        },
    },
    {
        "slug": "log-router",
        "title": "Deterministic Intelligent Log Routing Agent",
        "stack": ["Python", "re", "asyncio", "JSON Schema", "Linux I/O"],
        "states": [
            {
                "label": "Ingestion & Extraction",
                "content": (
                    "High-throughput line-by-line buffered stream parsing raw, multi-line error traces "
                    "through compiled regular expression matching lanes."
                ),
            },
            {
                "label": "Schema Validation Firewall",
                "content": (
                    "Match-groups are cast to JSON payloads and put through an isolated, decoupled JSON Schema "
                    "verification layer to enforce strict data contracts."
                ),
            },
            {
                "label": "Priority Routing & Write",
                "content": (
                    "Validated objects pass through an operational priority matrix and are written asynchronously "
                    "using non-blocking file descriptors to isolated host directories (/logs/critical vs /logs/info)."
                ),
            },
        ],
        "post_mortem": {
            "title": "Overcoming Ingestion Stalls from Greedy Multi-Line RegEx Over-Consumption",
            "body": (
                "Extended multi-line stack traces caused greedy dot-star (.*) patterns to breach valid log bounds, "
                "pulling overlapping entries into single malformed objects and crashing the schema validator. "
                "Resolved by refactoring the pipeline to non-greedy, anchoring expressions compiled with "
                "re.MULTILINE and re.DOTALL flags to strictly enforce boundary integrity."
            ),
        },
    },
    {
        "slug": "wego-ride",
        "title": "Wego Ride — Backend Microservices Architecture",
        "stack": ["Python", "Flask", "MySQL", "REST APIs"],
        "states": [
            {
                "label": "Authentication & Multi-Tenancy",
                "content": (
                    "Engineered core multi-tenant user authentication microservices enforcing strict session "
                    "boundary isolation — each tenant context cryptographically scoped to prevent cross-account "
                    "state bleed across concurrent sessions."
                ),
            },
            {
                "label": "Ride Lifecycle State Machine",
                "content": (
                    "Designed and implemented complex ride lifecycle logic as a deterministic state machine — "
                    "transitions (requested → matched → active → settled) enforced at the API layer with "
                    "transactional DB writes to guarantee zero partial-state records under concurrent load."
                ),
            },
            {
                "label": "Relational Schema & Data Consistency",
                "content": (
                    "Architected modular RESTful API surface and structured scalable relational schemas with "
                    "referential integrity constraints, ensuring absolute data consistency across high-volume "
                    "transaction records."
                ),
            },
        ],
        "post_mortem": {
            "title": "Enforcing Transactional Atomicity Across Multi-Step Ride State Transitions",
            "body": (
                "Early implementations handled multi-step state transitions as sequential non-atomic writes, "
                "creating windows for partial-state corruption under concurrent requests. Resolved by wrapping "
                "all transition logic in explicit database transactions with rollback-on-failure semantics, "
                "eliminating inconsistent ride records entirely."
            ),
        },
    },
    {
        "slug": "gym-membership-app",
        "title": "Gym Membership Mobile App — Full-Stack Architecture",
        "stack": ["Node.js", "PostgreSQL", "React Native", "REST APIs"],
        "states": [
            {
                "label": "NFC/QR Hardware Integration",
                "content": (
                    "Architected a secure local hardware integration layer using NFC and QR-based check-in "
                    "protocols — raw scan events piped through a validation middleware chain to automate user "
                    "identity resolution and structured data logging, eliminating manual entry error."
                ),
            },
            {
                "label": "Subscription Management & Data Pipeline",
                "content": (
                    "Developed centralized backend architecture managing high-volume enterprise member subscriptions "
                    "with real-time status resolution — subscription state materialized from event streams and "
                    "surfaced through a typed REST API consumed by the React Native client."
                ),
            },
            {
                "label": "Analytics Dashboard & Reporting",
                "content": (
                    "Built administrative reporting infrastructure to aggregate, process, and output real-time "
                    "operational analytics — raw PostgreSQL query results transformed into structured report "
                    "payloads with configurable date-range filtering and export-ready formatting."
                ),
            },
        ],
        "post_mortem": {
            "title": "Resolving NFC Event Race Conditions Under Rapid Sequential Scans",
            "body": (
                "Rapid successive NFC taps from the same device triggered duplicate check-in writes before the "
                "first transaction completed. Resolved by implementing an idempotency key layer (device_id + "
                "timestamp window) at the API boundary to deduplicate concurrent submissions and guarantee "
                "exactly-once check-in semantics."
            ),
        },
    },
]

_PROJECT_INDEX = {p["slug"]: p for p in _PROJECTS}


@projects_bp.route("/projects", methods=["GET"])
def list_projects():
    summary = [
        {"slug": p["slug"], "title": p["title"], "stack": p["stack"]}
        for p in _PROJECTS
    ]
    return jsonify(summary)


@projects_bp.route("/projects/<slug>", methods=["GET"])
def get_project(slug: str):
    project = _PROJECT_INDEX.get(slug)
    if not project:
        return jsonify({"error": f"Project '{slug}' not found."}), 404
    return jsonify(project)
