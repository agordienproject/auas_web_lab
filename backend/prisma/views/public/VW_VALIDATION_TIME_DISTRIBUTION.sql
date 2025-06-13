SELECT
  date(validation_date) AS validation_day,
  count(*) AS validated_count,
  avg(
    (
      EXTRACT(
        epoch
        FROM
          (validation_date - creation_date)
      ) / (60) :: numeric
    )
  ) AS avg_validation_minutes,
  min(
    (
      EXTRACT(
        epoch
        FROM
          (validation_date - creation_date)
      ) / (60) :: numeric
    )
  ) AS min_validation_minutes,
  max(
    (
      EXTRACT(
        epoch
        FROM
          (validation_date - creation_date)
      ) / (60) :: numeric
    )
  ) AS max_validation_minutes
FROM
  "FCT_INSPECTION"
WHERE
  (
    ((inspection_status) :: text = 'VALIDATED' :: text)
    AND (deleted = false)
  )
GROUP BY
  (date(validation_date))
ORDER BY
  (date(validation_date));