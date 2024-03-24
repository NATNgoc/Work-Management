import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711248365956 implements MigrationInterface {
  name = 'Init1711248365956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."workspace_members_role_enum" AS ENUM('owner', 'leader', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspace_members" ("workspace_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" "public"."workspace_members_role_enum" NOT NULL DEFAULT 'member', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4896b609c71ca5ad20ad662077b" PRIMARY KEY ("workspace_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workspaces_type_enum" AS ENUM('personal', 'teamwork')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_id" uuid NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "type" "public"."workspaces_type_enum" NOT NULL DEFAULT 'personal', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('accepted', 'pending', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workspace_id" uuid NOT NULL, "created_by" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "isDone" boolean NOT NULL DEFAULT false, "status" "public"."task_status_enum" NOT NULL DEFAULT 'pending', "dueDate" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_assignments" ("task_id" uuid NOT NULL, "userId_assigned_to" uuid NOT NULL, "userId_assigned_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f18a2e00603dc48a07996b0e6d" PRIMARY KEY ("task_id", "userId_assigned_to", "userId_assigned_by"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workspace_invitations_status_enum" AS ENUM('accepted', 'pending', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspace_invitations" ("workspace_id" uuid NOT NULL, "inviting_user_id" uuid NOT NULL, "invited_user_id" uuid NOT NULL, "status" "public"."workspace_invitations_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32d5b4131ceafee5f8c2f1e8039" PRIMARY KEY ("workspace_id", "inviting_user_id", "invited_user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system_parameters" ("id" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "value" jsonb NOT NULL, CONSTRAINT "PK_aa5092b6c74cc30dfcd959ce14a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_4e83431119fa585fc7aa8b817db" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspaces" ADD CONSTRAINT "FK_3bc45ecdd8fdc2108bb92516dde" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_4a49d67b2dc62b675e3dfb25296" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_7126a406a07736826b7988ae207" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_b389f4488d0a8241c3c98273966" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_e5d5edd841944af23344b36b70a" FOREIGN KEY ("userId_assigned_to") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_299a4972c7d711da41557f0a8d2" FOREIGN KEY ("userId_assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" ADD CONSTRAINT "FK_cf5df369b7a86ea3cdf18c7b56d" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" ADD CONSTRAINT "FK_b57635adb8131108970d70eeaf6" FOREIGN KEY ("inviting_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" ADD CONSTRAINT "FK_fcdda3808100eeb7245ebc47bfd" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" DROP CONSTRAINT "FK_fcdda3808100eeb7245ebc47bfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" DROP CONSTRAINT "FK_b57635adb8131108970d70eeaf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_invitations" DROP CONSTRAINT "FK_cf5df369b7a86ea3cdf18c7b56d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_299a4972c7d711da41557f0a8d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_e5d5edd841944af23344b36b70a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_b389f4488d0a8241c3c98273966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_7126a406a07736826b7988ae207"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_4a49d67b2dc62b675e3dfb25296"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspaces" DROP CONSTRAINT "FK_3bc45ecdd8fdc2108bb92516dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_4e83431119fa585fc7aa8b817db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd"`,
    );
    await queryRunner.query(`DROP TABLE "system_parameters"`);
    await queryRunner.query(`DROP TABLE "workspace_invitations"`);
    await queryRunner.query(
      `DROP TYPE "public"."workspace_invitations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "task_assignments"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    await queryRunner.query(`DROP TABLE "workspaces"`);
    await queryRunner.query(`DROP TYPE "public"."workspaces_type_enum"`);
    await queryRunner.query(`DROP TABLE "workspace_members"`);
    await queryRunner.query(`DROP TYPE "public"."workspace_members_role_enum"`);
  }
}
