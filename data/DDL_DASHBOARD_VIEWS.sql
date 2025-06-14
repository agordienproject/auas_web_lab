-- Inspection Statistics View
CREATE OR REPLACE VIEW "VW_INSPECTION_STATS" AS
WITH stats AS (
    SELECT 
        1 as id, -- Unique key for Prisma
        COUNT(*) as total_inspections,
        COUNT(CASE WHEN inspection_status = 'VALIDATED' THEN 1 END) as validated_inspections,
        COUNT(CASE WHEN inspection_status = 'PENDING' THEN 1 END) as pending_inspections,
        COUNT(CASE WHEN inspection_status = 'REJECTED' THEN 1 END) as deleted_inspections,
        COUNT(DISTINCT ref_piece) as unique_pieces_inspected,
        COUNT(CASE WHEN dents = true THEN 1 END) as inspections_with_dents,
        COUNT(CASE WHEN corrosions = true THEN 1 END) as inspections_with_corrosions,
        COUNT(CASE WHEN scratches = true THEN 1 END) as inspections_with_scratches
    FROM "FCT_INSPECTION"
    WHERE deleted = false
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
FROM stats;

-- Piece Current State View
CREATE OR REPLACE VIEW "VW_PIECE_CURRENT_STATE" AS
SELECT 
    p.id_piece,  -- Unique key for Prisma
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
    i.first_name as validator_first_name,
    i.last_name as validator_last_name
FROM "DIM_PIECE" p
LEFT JOIN "DIM_USER" i ON p.user_validation = i.id_user
WHERE p."TOP_CURRENT" = 1 AND p.deleted = false;

-- Inspector Performance View
CREATE OR REPLACE VIEW "VW_INSPECTOR_PERFORMANCE" AS
SELECT 
    u.id_user,  -- Unique key for Prisma
    u.first_name,
    u.last_name,
    COUNT(i.id_inspection) as total_inspections,
    COUNT(CASE WHEN i.inspection_status = 'VALIDATED' THEN 1 END) as validated_inspections,
    COUNT(DISTINCT i.ref_piece) as unique_pieces_inspected,
    MAX(i.inspection_date) as last_inspection_date
FROM "DIM_USER" u
LEFT JOIN "FCT_INSPECTION" i ON u.id_user = i.user_creation
WHERE u.deleted = false AND (i.deleted = false OR i.deleted IS NULL)
GROUP BY u.id_user, u.first_name, u.last_name;

-- Daily Inspection Trends View
CREATE OR REPLACE VIEW "VW_DAILY_INSPECTION_TRENDS" AS
SELECT
    DATE(inspection_date) as inspection_day,  -- Unique key for Prisma
    COUNT(*) as total_inspections,
    COUNT(CASE WHEN dents = true THEN 1 END) as dents_found,
    COUNT(CASE WHEN corrosions = true THEN 1 END) as corrosions_found,
    COUNT(CASE WHEN scratches = true THEN 1 END) as scratches_found,
    COUNT(CASE WHEN inspection_status = 'VALIDATED' THEN 1 END) as validated_count
FROM "FCT_INSPECTION"
WHERE deleted = false
GROUP BY DATE(inspection_date)
ORDER BY inspection_day ASC;

-- Piece History Summary View
CREATE OR REPLACE VIEW "VW_PIECE_HISTORY_SUMMARY" AS
SELECT 
    ref_piece,  -- Unique key for Prisma
    COUNT(*) as total_versions,
    MIN(start_date::date) as first_inspection_date,
    MAX(CASE WHEN "TOP_CURRENT" = 1 THEN start_date::date END) as latest_inspection_date,
    STRING_AGG(DISTINCT state, ', ') as historical_states,
    COUNT(CASE WHEN dents = true THEN 1 END) as total_dents_reported,
    COUNT(CASE WHEN corrosions = true THEN 1 END) as total_corrosions_reported,
    COUNT(CASE WHEN scratches = true THEN 1 END) as total_scratches_reported
FROM "DIM_PIECE"
WHERE deleted = false
GROUP BY ref_piece; 

-- Validation Time Distribution View
CREATE OR REPLACE VIEW "VW_VALIDATION_TIME_DISTRIBUTION" AS
SELECT
    DATE(validation_date) AS validation_day,  -- Unique key for Prisma
    COUNT(*) AS validated_count,
    AVG(EXTRACT(EPOCH FROM (validation_date - creation_date)) / 60) AS avg_validation_minutes,
    MIN(EXTRACT(EPOCH FROM (validation_date - creation_date)) / 60) AS min_validation_minutes,
    MAX(EXTRACT(EPOCH FROM (validation_date - creation_date)) / 60) AS max_validation_minutes
FROM "FCT_INSPECTION"
WHERE inspection_status = 'VALIDATED'
  AND deleted = false
GROUP BY DATE(validation_date)
ORDER BY validation_day ASC;
