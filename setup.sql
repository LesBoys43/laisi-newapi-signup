DROP TABLE IF EXISTS codes;

CREATE TABLE codes
(
  id serial NOT NULL,
  code character(48) NOT NULL,
  quota integer NOT NULL,
  usage_count integer NOT NULL,
  CONSTRAINT codes_pk_id PRIMARY KEY (id),
  CONSTRAINT codes_uniq_code UNIQUE (code)
)
WITH (
  OIDS=FALSE
);