CREATE TABLE IF NOT EXISTS videodata
(
    userid uuid NOT NULL,
    videoid character varying(255) COLLATE pg_catalog."default" NOT NULL,
    points integer,
    upload_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
)

TABLESPACE pg_default;

ALTER TABLE videodata
    OWNER to icgadmin;