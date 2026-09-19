import sqlite3
from pathlib import Path


APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"

DB_PATH = DATA_DIR / "fixmydhaka.db"

REPORT_UPLOAD_DIR = (
    DATA_DIR / "report_uploads"
)


def get_connection():
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    REPORT_UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    connection = sqlite3.connect(
        DB_PATH
    )

    connection.row_factory = (
        sqlite3.Row
    )

    return connection


def init_db():
    connection = get_connection()

    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                public_id TEXT UNIQUE NOT NULL,

                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,

                latitude REAL,
                longitude REAL,

                category TEXT NOT NULL,
                category_confidence REAL,

                jurisdiction TEXT,

                authority TEXT,
                authority_source TEXT,
                authority_evidence TEXT,
                evidence_sufficient INTEGER NOT NULL DEFAULT 0,

                visual_evidence TEXT,

                reporting_method TEXT,
                reporting_url TEXT,
                next_step TEXT,
                copyable_complaint TEXT,

                photo_filename TEXT,

                issue_status TEXT NOT NULL DEFAULT 'Open',
                routing_status TEXT NOT NULL DEFAULT 'Pending',

                official_submission_status TEXT
                    NOT NULL
                    DEFAULT 'Not submitted',

                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_reports_created_at
            ON reports(created_at)
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_reports_authority
            ON reports(authority)
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_reports_category
            ON reports(category)
            """
        )

        connection.commit()

    finally:
        connection.close()