using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class SchoolYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_users_UserId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_UserId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "SchoolYearId",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Semester",
                table: "Events",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "school_year",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DateStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DateEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsArchived = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_school_year", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 9, 22, 36, 25, 930, DateTimeKind.Local).AddTicks(1510), "$2a$11$NlMWYUbpw6UVgYU9BJBBcu8cbFJc4s0YQ8OTaZbndGMtXagiHKoia" });

            migrationBuilder.CreateIndex(
                name: "IX_Events_SchoolYearId",
                table: "Events",
                column: "SchoolYearId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_school_year_SchoolYearId",
                table: "Events",
                column: "SchoolYearId",
                principalTable: "school_year",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_school_year_SchoolYearId",
                table: "Events");

            migrationBuilder.DropTable(
                name: "school_year");

            migrationBuilder.DropIndex(
                name: "IX_Events_SchoolYearId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "SchoolYearId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Semester",
                table: "Events");

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
                values: new object[] { new DateTime(2024, 12, 9, 19, 36, 8, 282, DateTimeKind.Local).AddTicks(8363), "$2a$11$ot/F.ReOl1reu5OsuItlmurIp9c1Mmb6mJNvwJJCMW.JjdmNXTIPG" });

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
        }
    }
}
