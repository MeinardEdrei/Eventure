using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class FixUserEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "User_Id",
                table: "user_events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 9, 19, 36, 8, 282, DateTimeKind.Local).AddTicks(8363), "$2a$11$ot/F.ReOl1reu5OsuItlmurIp9c1Mmb6mJNvwJJCMW.JjdmNXTIPG" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User_Id",
                table: "user_events");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 9, 19, 13, 37, 850, DateTimeKind.Local).AddTicks(4040), "$2a$11$yo.ckgII3xHboYWGo8rC5.rhpc57f/x.brRsoO5FVingPaf9r8dPS" });
        }
    }
}
