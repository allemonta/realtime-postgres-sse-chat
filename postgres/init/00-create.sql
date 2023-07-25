DROP SCHEMA public cascade;
CREATE SCHEMA public;

/* REALTIME TRIGGERS UTILS */

CREATE OR REPLACE FUNCTION notify_table_update()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  PERFORM pg_notify(
    'realtime',
    JSON_BUILD_OBJECT(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'data', JSON_BUILD_OBJECT(
        'new', ROW_TO_JSON(NEW),
        'old', ROW_TO_JSON(OLD)
      )
    )::TEXT
  );

  RETURN null;
END;
$$;

CREATE OR REPLACE PROCEDURE create_realtime_trigger(table_name TEXT) 
LANGUAGE PLPGSQL
AS
$$
BEGIN
  EXECUTE format('
    DROP TRIGGER IF EXISTS %1$I_realtime_trigger ON %1$I;
    CREATE TRIGGER %1$I_realtime_trigger
    AFTER UPDATE OR INSERT OR DELETE ON %1$I
    FOR EACH ROW
    EXECUTE PROCEDURE notify_table_update();', table_name);
END;
$$;

/* TABLES */

CREATE TABLE "Items"(
    "id" INT SERIAL,
    "value" TEXT NOT NULL,
    "creationTimestamp" TIMESTAMPTZ,
    "storingTimestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "sseReceivingTimestamp" TIMESTAMPTZ,

    PRIMARY KEY ("id")
);

CALL create_realtime_trigger('Items');