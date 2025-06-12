SELECT
  inspection_date AS inspection_day,
  count(*) AS total_inspections,
  count(
    CASE
      WHEN (dents = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS dents_found,
  count(
    CASE
      WHEN (corrosions = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS corrosions_found,
  count(
    CASE
      WHEN (scratches = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS scratches_found,
  count(
    CASE
      WHEN (inspection_validated = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS validated_count
FROM
  "FCT_INSPECTION"
WHERE
  (deleted = false)
GROUP BY
  inspection_date
ORDER BY
  inspection_date DESC;