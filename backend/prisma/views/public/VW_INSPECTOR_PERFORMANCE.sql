SELECT
  u.id_user,
  u.first_name,
  u.last_name,
  count(i.id_inspection) AS total_inspections,
  count(
    CASE
      WHEN (i.inspection_validated = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS validated_inspections,
  count(DISTINCT i.ref_piece) AS unique_pieces_inspected,
  max(i.inspection_date) AS last_inspection_date
FROM
  (
    "DIM_USER" u
    LEFT JOIN "FCT_INSPECTION" i ON ((u.id_user = i.user_creation))
  )
WHERE
  (
    (u.deleted = false)
    AND (
      (i.deleted = false)
      OR (i.deleted IS NULL)
    )
  )
GROUP BY
  u.id_user,
  u.first_name,
  u.last_name;