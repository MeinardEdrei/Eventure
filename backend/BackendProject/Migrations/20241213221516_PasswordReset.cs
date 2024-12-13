using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class PasswordReset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetCode",
                table: "users",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetCodeExpiration",
                table: "users",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password", "PasswordResetCode", "PasswordResetCodeExpiration" },
                values: new object[] { new DateTime(2024, 12, 14, 6, 15, 15, 678, DateTimeKind.Local).AddTicks(3473), "$2a$11$mvLoKyr3R7YxMPuK9qofbOanf./5Dn6u2MwiVPk9OKgDPNm15nRZu", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetCode",
                table: "users");

            migrationBuilder.DropColumn(
                name: "PasswordResetCodeExpiration",
                table: "users");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 14, 3, 41, 43, 789, DateTimeKind.Local).AddTicks(3005), "$2a$11$ZshfXSjbrumWNiSzM5S2XuoQWgALDQrLxdLS2PO1fq/NrIka2CtUy" });
        }
    }
}
