import { Migration } from '@mikro-orm/migrations';

export class Migration20250428133750 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(`create index "user_username_index" on "user" ("username");`);
    this.addSql(
      `alter table "user" add constraint "user_username_unique" unique ("username");`,
    );

    this.addSql(
      `create table "comment" ("id" varchar(255) not null, "content" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "author_id" varchar(255) not null, "parent_comment_id" varchar(255) null, constraint "comment_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "comment_parent_comment_id_index" on "comment" ("parent_comment_id");`,
    );

    this.addSql(
      `create table "notification" ("id" varchar(255) not null, "created_at" timestamptz not null, "is_read" boolean not null default false, "recipient_id" varchar(255) not null, "comment_id" varchar(255) not null, constraint "notification_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "notification_is_read_index" on "notification" ("is_read");`,
    );
    this.addSql(
      `create index "notification_recipient_id_index" on "notification" ("recipient_id");`,
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
      `alter table "notification" add constraint "notification_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade on delete cascade;`,
    );
  }
}
