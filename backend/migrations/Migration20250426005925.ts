import { Migration } from '@mikro-orm/migrations';

export class Migration20250426005925 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_username_unique" unique ("username");`,
    );

    this.addSql(
      `create table "comment" ("id" varchar(255) not null, "content" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "author_id" varchar(255) not null, "parent_comment_id" varchar(255) null, constraint "comment_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "notification" ("id" varchar(255) not null, "created_at" timestamptz not null, "is_read" boolean not null default false, "recipient_id" varchar(255) not null, "comment_id" varchar(255) not null, constraint "notification_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "comment" add constraint "comment_parent_comment_id_foreign" foreign key ("parent_comment_id") references "comment" ("id") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "notification" add constraint "notification_recipient_id_foreign" foreign key ("recipient_id") references "user" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "notification" add constraint "notification_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "comment" drop constraint "comment_author_id_foreign";`,
    );

    this.addSql(
      `alter table "notification" drop constraint "notification_recipient_id_foreign";`,
    );

    this.addSql(
      `alter table "comment" drop constraint "comment_parent_comment_id_foreign";`,
    );

    this.addSql(
      `alter table "notification" drop constraint "notification_comment_id_foreign";`,
    );

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "comment" cascade;`);

    this.addSql(`drop table if exists "notification" cascade;`);
  }
}
