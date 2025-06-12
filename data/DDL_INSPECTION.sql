-- Table: user
DROP TABLE IF EXISTS "DIM_USER" CASCADE;
CREATE TABLE "DIM_USER" (
  "id_user"             BIGSERIAL PRIMARY KEY,
  "first_name"          VARCHAR(120),
  "last_name"           VARCHAR(120),
  "pseudo"              VARCHAR(120),
  "email"               VARCHAR(120),
  "password"            VARCHAR(120),
  "role"                VARCHAR(120)
);

-- Comments for DIM_USER table columns
COMMENT ON COLUMN "DIM_USER"."id_user"        IS 'Unique user ID';
COMMENT ON COLUMN "DIM_USER"."pseudo"         IS 'User nickname or alias';
COMMENT ON COLUMN "DIM_USER"."first_name"     IS 'User''s first name';
COMMENT ON COLUMN "DIM_USER"."last_name"      IS 'User''s last name';
COMMENT ON COLUMN "DIM_USER"."email"          IS 'User''s email address';
COMMENT ON COLUMN "DIM_USER"."password"       IS 'User''s password';
COMMENT ON COLUMN "DIM_USER"."role"           IS 'Role or access level (e.g., admin, inspector)';

-- Table: FCT_INSPECTION
DROP TABLE IF EXISTS "FCT_INSPECTION" CASCADE;
CREATE TABLE "FCT_INSPECTION" (
  "id_inspection"       BIGSERIAL PRIMARY KEY,
  "name_piece"          VARCHAR(120),
  "ref_piece"           VARCHAR(120),
  "name_program"        VARCHAR(120),
  "state"               VARCHAR(50),
  "dents"               BOOLEAN,
  "corrosions"          BOOLEAN,
  "scratches"           BOOLEAN,
  "details"             VARCHAR,
  "inspection_date"     DATE,
  "inspection_path"     VARCHAR(255),
  "inspection_validated" BOOLEAN,
  "user_validation"     INT,
  "creation_date"       TIMESTAMP,
  "user_creation"       INT,
  "modification_date"   TIMESTAMP,
  "user_modification"   INT
);

-- Comments for inspection table columns
COMMENT ON COLUMN "FCT_INSPECTION"."id_inspection"        IS 'Unique inspection ID';
COMMENT ON COLUMN "FCT_INSPECTION"."name_piece"           IS 'Name of the inspected part';
COMMENT ON COLUMN "FCT_INSPECTION"."ref_piece"            IS 'Reference or model number of the part';
COMMENT ON COLUMN "FCT_INSPECTION"."name_program"         IS 'Associated inspection program name';
COMMENT ON COLUMN "FCT_INSPECTION"."state"                IS 'General state or status (e.g., OK, NOK)';
COMMENT ON COLUMN "FCT_INSPECTION"."dents"                IS 'True if dents are present';
COMMENT ON COLUMN "FCT_INSPECTION"."corrosions"           IS 'True if corrosion is detected';
COMMENT ON COLUMN "FCT_INSPECTION"."scratches"            IS 'True if scratches are observed';
COMMENT ON COLUMN "FCT_INSPECTION"."details"              IS 'Free text with inspection details';
COMMENT ON COLUMN "FCT_INSPECTION"."inspection_date"      IS 'Date and time of the inspection';
COMMENT ON COLUMN "FCT_INSPECTION"."inspection_path"      IS 'Path to associated inspection images or data';
COMMENT ON COLUMN "FCT_INSPECTION"."inspection_validated" IS 'True if inspection was validated';
COMMENT ON COLUMN "FCT_INSPECTION"."user_validation"      IS 'ID of the user who validated the inspection';
COMMENT ON COLUMN "FCT_INSPECTION"."creation_date"        IS 'Date the inspection record was created';
COMMENT ON COLUMN "FCT_INSPECTION"."user_creation"        IS 'ID of the user who created the record';
COMMENT ON COLUMN "FCT_INSPECTION"."modification_date"    IS 'Date the inspection was last modified';
COMMENT ON COLUMN "FCT_INSPECTION"."user_modification"    IS 'ID of the user who last modified the record';

-- Table: DIM_PIECE
DROP TABLE IF EXISTS "DIM_PIECE" CASCADE;
CREATE TABLE "DIM_PIECE" (
  "ref_piece"           VARCHAR(120),
  "start_date"          VARCHAR(120),
  "end_date"            VARCHAR(120),
  "name_piece"          VARCHAR(120),
  "state"               VARCHAR(50),
  "name_program"        VARCHAR(120),
  "dents"               BOOLEAN,
  "corrosions"          BOOLEAN,
  "scratches"           BOOLEAN,
  "details"             VARCHAR,
  "inspection_date"     DATE,
  "inspection_path"     VARCHAR(255),
  "inspection_validated" BOOLEAN,
  "user_validation"     INT,
  "creation_date"       TIMESTAMP,
  "user_creation"       INT,
  "modification_date"   TIMESTAMP,
  "user_modification"   INT,
  "TOP_CURRENT"         INT
);

-- Comments for piece table columns
COMMENT ON COLUMN "DIM_PIECE"."ref_piece"            IS 'Reference or model number of the part';
COMMENT ON COLUMN "DIM_PIECE"."start_date"           IS 'Start date of the piece';
COMMENT ON COLUMN "DIM_PIECE"."end_date"             IS 'End date of the piece';
COMMENT ON COLUMN "DIM_PIECE"."name_piece"           IS 'Name of the piece';
COMMENT ON COLUMN "DIM_PIECE"."state"                IS 'State of the piece';
COMMENT ON COLUMN "DIM_PIECE"."name_program"         IS 'Name of the program';
COMMENT ON COLUMN "DIM_PIECE"."dents"                IS 'True if dents are present';
COMMENT ON COLUMN "DIM_PIECE"."corrosions"           IS 'True if corrosion is detected';
COMMENT ON COLUMN "DIM_PIECE"."scratches"            IS 'True if scratches are observed';
COMMENT ON COLUMN "DIM_PIECE"."details"              IS 'Free text with inspection details';
COMMENT ON COLUMN "DIM_PIECE"."inspection_date"      IS 'Date and time of the inspection';
COMMENT ON COLUMN "DIM_PIECE"."inspection_path"      IS 'Path to associated inspection images or data';
COMMENT ON COLUMN "DIM_PIECE"."inspection_validated" IS 'True if inspection was validated';
COMMENT ON COLUMN "DIM_PIECE"."user_validation"      IS 'ID of the user who validated the inspection';
COMMENT ON COLUMN "DIM_PIECE"."TOP_CURRENT"          IS 'Top current of the piece';


