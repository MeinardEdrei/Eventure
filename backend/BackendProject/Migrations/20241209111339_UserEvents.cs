using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class UserEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_events_registration_form_User_Id",
                table: "user_events");

            migrationBuilder.DropForeignKey(
                name: "FK_user_events_users_UserId",
                table: "user_events");

            migrationBuilder.DropIndex(
                name: "IX_user_events_UserId",
                table: "user_events");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "user_events");

            migrationBuilder.RenameColumn(
                name: "User_Id",
                table: "user_events",
                newName: "RForm_Id");

            migrationBuilder.RenameIndex(
                name: "IX_user_events_User_Id",
                table: "user_events",
                newName: "IX_user_events_RForm_Id");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Events",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 9, 19, 13, 37, 850, DateTimeKind.Local).AddTicks(4040), "$2a$11$yo.ckgII3xHboYWGo8rC5.rhpc57f/x.brRsoO5FVingPaf9r8dPS" });

            migrationBuilder.CreateIndex(
                name: "IX_Events_UserId",
                table: "Events",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_users_UserId",
                table: "Events",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_events_registration_form_RForm_Id",
                table: "user_events",
                column: "RForm_Id",
                principalTable: "registration_form",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_users_UserId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_user_events_registration_form_RForm_Id",
                table: "user_events");

            migrationBuilder.DropIndex(
                name: "IX_Events_UserId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "RForm_Id",
                table: "user_events",
                newName: "User_Id");

            migrationBuilder.RenameIndex(
                name: "IX_user_events_RForm_Id",
                table: "user_events",
                newName: "IX_user_events_User_Id");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "user_events",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 9, 17, 20, 4, 977, DateTimeKind.Local).AddTicks(7428), "$2a$11$L9Y/x.3uusLr3.g3TOvFvuAPv8UHrH6I1BUNQfrwDTuFAq/ADHYDK" });

            migrationBuilder.CreateIndex(
                name: "IX_user_events_UserId",
                table: "user_events",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_user_events_registration_form_User_Id",
                table: "user_events",
                column: "User_Id",
                principalTable: "registration_form",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_events_users_UserId",
                table: "user_events",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id");
        }
    }
}
