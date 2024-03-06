CREATE TABLE users
(
    userid uuid DEFAULT gen_random_uuid(),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    signup_date date DEFAULT CURRENT_DATE,
    points integer,
    PRIMARY KEY (userid)
)

TABLESPACE pg_default;

ALTER TABLE users
    OWNER to icgadmin;
