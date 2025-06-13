SELECT
  p.id_piece,
  p.ref_piece,
  p.start_date,
  p.end_date,
  p.name_piece,
  p.state,
  p.name_program,
  p.dents,
  p.corrosions,
  p.scratches,
  p.details,
  p.id_inspection,
  p.inspection_date,
  p.inspection_path,
  p.inspection_status,
  p.user_validation,
  p.validation_date,
  p.creation_date,
  p.user_creation,
  p.modification_date,
  p.user_modification,
  p.deleted,
  p."TOP_CURRENT",
  i.first_name AS validator_first_name,
  i.last_name AS validator_last_name
FROM
  (
    "DIM_PIECE" p
    LEFT JOIN "DIM_USER" i ON ((p.user_validation = i.id_user))
  )
WHERE
  (
    (p."TOP_CURRENT" = 1)
    AND (p.deleted = false)
  );