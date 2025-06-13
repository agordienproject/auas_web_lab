SELECT
  ref_piece,
  count(*) AS total_versions,
  min((start_date) :: date) AS first_inspection_date,
  max(
    CASE
      WHEN ("TOP_CURRENT" = 1) THEN (start_date) :: date
      ELSE NULL :: date
    END
  ) AS latest_inspection_date,
  string_agg(DISTINCT (state) :: text, ', ' :: text) AS historical_states,
  count(
    CASE
      WHEN (dents = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS total_dents_reported,
  count(
    CASE
      WHEN (corrosions = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS total_corrosions_reported,
  count(
    CASE
      WHEN (scratches = TRUE) THEN 1
      ELSE NULL :: integer
    END
  ) AS total_scratches_reported
FROM
  "DIM_PIECE"
WHERE
  (deleted = false)
GROUP BY
  ref_piece;