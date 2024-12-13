using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class EventAppeal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Request",
                table: "rejection_reason",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 14, 1, 39, 39, 286, DateTimeKind.Local).AddTicks(7991), "$2a$11$GNorie6HDU2JCNDLiIc4V.VfO8VBuz5ldLb93xXJPc4p44LfcW.g2" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Request",
                table: "rejection_reason");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 13, 23, 18, 8, 832, DateTimeKind.Local).AddTicks(7422), "$2a$11$4b1HSp52Zgco8ByHmsKx/ewrR79GeicgvlKgQhNppjxjp2caztMzC" });
        }
    }
}
