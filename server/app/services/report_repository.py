import hashlib
import hmac
import secrets

from datetime import (
    datetime,
    timezone,
)

from uuid import uuid4

from app.db import (
    get_connection,
)


def utc_now():
    return datetime.now(
        timezone.utc
    ).isoformat()


def row_to_report(row):
    if row is None:
        return None

    report = dict(row)

    # Never expose this secret verifier in GET/list/PATCH responses.
    report.pop("edit_token_hash", None)

    report[
        "evidence_sufficient"
    ] = bool(
        report[
            "evidence_sufficient"
        ]
    )

    photo_filename = (
        report.get(
            "photo_filename"
        )
    )

    if photo_filename:
        report[
            "photo_url"
        ] = (
            f"/uploads/"
            f"{photo_filename}"
        )
    else:
        report[
            "photo_url"
        ] = None

    return report


def create_report(data):
    connection = (
        get_connection()
    )

    public_id = (
        "FMD-"
        + uuid4()
        .hex[:8]
        .upper()
    )

    timestamp = utc_now()
    edit_token = secrets.token_urlsafe(32)
    edit_token_hash = hashlib.sha256(edit_token.encode("utf-8")).hexdigest()

    try:
        cursor = (
            connection.execute(
                """
                INSERT INTO reports (
                    public_id,
                    edit_token_hash,

                    title,
                    description,
                    location,

                    latitude,
                    longitude,

                    category,
                    category_confidence,

                    jurisdiction,

                    authority,
                    authority_source,
                    authority_evidence,
                    evidence_sufficient,

                    visual_evidence,

                    reporting_method,
                    reporting_url,
                    next_step,
                    copyable_complaint,

                    issue_status,
                    routing_status,
                    official_submission_status,

                    created_at,
                    updated_at
                )
                VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?,
                    ?, ?,
                    ?,
                    ?, ?, ?, ?,
                    ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?
                )
                """,
                (
                    public_id,
                    edit_token_hash,

                    data["title"],
                    data[
                        "description"
                    ],
                    data[
                        "location"
                    ],

                    data.get(
                        "latitude"
                    ),
                    data.get(
                        "longitude"
                    ),

                    data[
                        "category"
                    ],
                    data.get(
                        "category_confidence"
                    ),

                    data.get(
                        "jurisdiction"
                    ),

                    data.get(
                        "authority"
                    ),
                    data.get(
                        "authority_source"
                    ),
                    data.get(
                        "authority_evidence"
                    ),
                    int(
                        bool(
                            data.get(
                                "evidence_sufficient"
                            )
                        )
                    ),

                    data.get(
                        "visual_evidence"
                    ),

                    data.get(
                        "reporting_method"
                    ),
                    data.get(
                        "reporting_url"
                    ),
                    data.get(
                        "next_step"
                    ),
                    data.get(
                        "copyable_complaint"
                    ),

                    data.get(
                        "issue_status",
                        "Open",
                    ),
                    data.get(
                        "routing_status",
                        "Pending",
                    ),
                    data.get(
                        "official_submission_status",
                        "Not submitted",
                    ),

                    timestamp,
                    timestamp,
                ),
            )
        )

        connection.commit()

        row = (
            connection.execute(
                """
                SELECT *
                FROM reports
                WHERE id = ?
                """,
                (
                    cursor.lastrowid,
                ),
            ).fetchone()
        )

        return row_to_report(row), edit_token

    finally:
        connection.close()


def set_report_photo(
    public_id,
    filename,
):
    connection = (
        get_connection()
    )

    try:
        connection.execute(
            """
            UPDATE reports

            SET
                photo_filename = ?,
                updated_at = ?

            WHERE public_id = ?
            """,
            (
                filename,
                utc_now(),
                public_id,
            ),
        )

        connection.commit()

        row = (
            connection.execute(
                """
                SELECT *
                FROM reports
                WHERE public_id = ?
                """,
                (
                    public_id,
                ),
            ).fetchone()
        )

        return row_to_report(
            row
        )

    finally:
        connection.close()


def list_reports(
    limit=100,
    offset=0,
):
    connection = (
        get_connection()
    )

    try:
        rows = (
            connection.execute(
                """
                SELECT *
                FROM reports

                ORDER BY
                    created_at DESC

                LIMIT ?
                OFFSET ?
                """,
                (
                    limit,
                    offset,
                ),
            ).fetchall()
        )

        return [
            row_to_report(
                row
            )
            for row in rows
        ]

    finally:
        connection.close()


def get_report(
    public_id,
):
    connection = (
        get_connection()
    )

    try:
        row = (
            connection.execute(
                """
                SELECT *
                FROM reports
                WHERE public_id = ?
                """,
                (
                    public_id,
                ),
            ).fetchone()
        )

        return row_to_report(
            row
        )

    finally:
        connection.close()


def update_report(
    public_id,
    updates,
):
    allowed_fields = {
        "issue_status",
        "official_submission_status",
    }

    clean_updates = {
        key: value
        for key, value
        in updates.items()
        if (
            key in allowed_fields
            and value is not None
        )
    }

    if not clean_updates:
        return get_report(
            public_id
        )

    clean_updates[
        "updated_at"
    ] = utc_now()

    assignments = ", ".join(
        f"{field} = ?"
        for field
        in clean_updates
    )

    values = list(
        clean_updates.values()
    )

    values.append(
        public_id
    )

    connection = (
        get_connection()
    )

    try:
        connection.execute(
            f"""
            UPDATE reports

            SET {assignments}

            WHERE public_id = ?
            """,
            values,
        )

        connection.commit()

        row = (
            connection.execute(
                """
                SELECT *
                FROM reports
                WHERE public_id = ?
                """,
                (
                    public_id,
                ),
            ).fetchone()
        )

        return row_to_report(
            row
        )

    finally:
        connection.close()

def verify_report_edit_token(public_id: str, edit_token: str | None) -> bool:
    """Verify a creator-only capability token without exposing the stored hash."""
    if not edit_token or len(edit_token) > 128:
        return False

    connection = get_connection()
    try:
        row = connection.execute(
            "SELECT edit_token_hash FROM reports WHERE public_id = ?",
            (public_id,),
        ).fetchone()
    finally:
        connection.close()

    if not row or not row["edit_token_hash"]:
        # Legacy reports have no creator token and cannot be publicly edited.
        return False

    supplied_hash = hashlib.sha256(edit_token.encode("utf-8")).hexdigest()
    return hmac.compare_digest(supplied_hash, row["edit_token_hash"])
