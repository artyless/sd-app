CREATE TABLE IF NOT EXISTS public."User"
(
    id               SERIAL PRIMARY KEY NOT NULL,
    "userName"       VARCHAR(32) UNIQUE NOT NULL,
    "firstName"      VARCHAR(32)        NOT NULL,
    "lastName"       VARCHAR(32)        NOT NULL DEFAULT '',
    email            VARCHAR(64) UNIQUE NOT NULL,
    "hashedPassword" VARCHAR(255)       NOT NULL,
    "createdAt"      TIMESTAMP          NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Collection"
(
    id             SERIAL PRIMARY KEY  NOT NULL,
    title          VARCHAR(32)         NOT NULL,
    "amountImages" INTEGER DEFAULT 0,
    bucket         VARCHAR(255) UNIQUE NOT NULL,
    "userId"       INTEGER             NOT NULL,
    FOREIGN KEY ("userId") REFERENCES public."User" (id),
    CONSTRAINT unique_user_collection UNIQUE ("userId", title)
);

CREATE TABLE IF NOT EXISTS public."Image"
(
    id               SERIAL PRIMARY KEY  NOT NULL,
    prompt           VARCHAR(255)        NOT NULL,
    "promptRu"       VARCHAR(255)        NOT NULL,
    "storageAddress" VARCHAR(255) UNIQUE NOT NULL,
    "searchId"       VARCHAR(255)                 DEFAULT '',
    published        BOOLEAN             NOT NULL DEFAULT FALSE,
    "likeCount"      INTEGER             NOT NULL DEFAULT 0,
    "createdAt"      TIMESTAMP           NOT NULL DEFAULT now(),
    "userId"         INTEGER             NOT NULL,
    "collectionId"   INTEGER             NOT NULL,
    FOREIGN KEY ("userId") REFERENCES public."User" (id),
    FOREIGN KEY ("collectionId") REFERENCES public."Collection" (id)
);

CREATE TABLE IF NOT EXISTS public."Like"
(
    id          SERIAL PRIMARY KEY NOT NULL,
    "createdAt" TIMESTAMP          NOT NULL DEFAULT now(),
    "userId"    INTEGER            NOT NULL,
    "imageId"   INTEGER            NOT NULL,
    FOREIGN KEY ("userId") REFERENCES public."User" (id),
    FOREIGN KEY ("imageId") REFERENCES public."Image" (id)
);

CREATE OR REPLACE FUNCTION update_collection_image_count()
    RETURNS TRIGGER AS
$$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE public."Collection"
        SET "amountImages" = (
            SELECT COUNT(*)
            FROM public."Image"
            WHERE "collectionId" = OLD."collectionId"
        )
        WHERE id = OLD."collectionId";

        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        UPDATE public."Collection"
        SET "amountImages" = (
            SELECT COUNT(*)
            FROM public."Image"
            WHERE "collectionId" = NEW."collectionId"
        )
        WHERE id = NEW."collectionId";

        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER image_added_trigger
    AFTER INSERT
    ON public."Image"
    FOR EACH ROW
EXECUTE FUNCTION update_collection_image_count();

CREATE TRIGGER image_deleted_trigger
    AFTER DELETE
    ON public."Image"
    FOR EACH ROW
EXECUTE FUNCTION update_collection_image_count();


DROP TRIGGER IF EXISTS update_collection_amount_trigger ON "Collection";
DROP TABLE IF EXISTS public."Like";
DROP TABLE IF EXISTS public."Image";
DROP TABLE IF EXISTS public."Collection";
DROP TABLE IF EXISTS public."User";
