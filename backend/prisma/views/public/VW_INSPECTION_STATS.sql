WITH stats AS (
  SELECT
    1 AS id,
    count(*) AS total_inspections,
    count(
      CASE
        WHEN (
          ("FCT_INSPECTION".inspection_status) :: text = 'VALIDATED' :: text
        ) THEN 1
        ELSE NULL :: integer
      END
    ) AS validated_inspections,
    count(
      CASE
        WHEN (
          ("FCT_INSPECTION".inspection_status) :: text = 'PENDING' :: text
        ) THEN 1
        ELSE NULL :: integer
      END
    ) AS pending_inspections,
    count(
      CASE
        WHEN (
          ("FCT_INSPECTION".inspection_status) :: text = 'REJECTED' :: text
        ) THEN 1
        ELSE NULL :: integer
      END
    ) AS deleted_inspections,
    count(DISTINCT "FCT_INSPECTION".ref_piece) AS unique_pieces_inspected,
    count(
      CASE
        WHEN ("FCT_INSPECTION".dents = TRUE) THEN 1
        ELSE NULL :: integer
      END
    ) AS inspections_with_dents,
    count(
      CASE
        WHEN ("FCT_INSPECTION".corrosions = TRUE) THEN 1
        ELSE NULL :: integer
      END
    ) AS inspections_with_corrosions,
    count(
      CASE
        WHEN ("FCT_INSPECTION".scratches = TRUE) THEN 1
        ELSE NULL :: integer
      END
    ) AS inspections_with_scratches
  FROM
    "FCT_INSPECTION"
  WHERE
    ("FCT_INSPECTION".deleted = false)
)
SELECT
  id,
  total_inspections,
  validated_inspections,
  pending_inspections,
  deleted_inspections,
  unique_pieces_inspected,
  inspections_with_dents,
  inspections_with_corrosions,
  inspections_with_scratches
FROM
  stats;