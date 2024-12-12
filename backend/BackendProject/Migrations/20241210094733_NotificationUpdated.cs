using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class NotificationUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "notifications",
                keyColumn: "NotificationImage",
                keyValue: null,
                column: "NotificationImage",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "NotificationImage",
                table: "notifications",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "notifications",
                keyColumn: "Message",
                keyValue: null,
                column: "Message",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "notifications",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "notifications",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password", "Section" },
                values: new object[] { new DateTime(2024, 12, 10, 17, 47, 32, 363, DateTimeKind.Local).AddTicks(6334), "$2a$11$Vgd8N0SvkLvmqDwj/fW50e66tgBJWEGn2ezf1WVO3Lpu.tZNYSh1C", "Admin Section" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "notifications");

            migrationBuilder.AlterColumn<string>(
                name: "NotificationImage",
                table: "notifications",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "notifications",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password", "Section" },
                values: new object[] { new DateTime(2024, 12, 9, 22, 36, 25, 930, DateTimeKind.Local).AddTicks(1510), "$2a$11$NlMWYUbpw6UVgYU9BJBBcu8cbFJc4s0YQ8OTaZbndGMtXagiHKoia", "AdminSection" });
        }
    }
}
