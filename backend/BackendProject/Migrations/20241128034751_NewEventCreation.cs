using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class NewEventCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Start",
                table: "Events",
                newName: "TimeStart");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "Events",
                newName: "TimeEnd");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Events",
                newName: "DateStart");

            migrationBuilder.AddColumn<string>(
                name: "CampusType",
                table: "Events",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateEnd",
                table: "Events",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "Events",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CampusType",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DateEnd",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "TimeStart",
                table: "Events",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "TimeEnd",
                table: "Events",
                newName: "End");

            migrationBuilder.RenameColumn(
                name: "DateStart",
                table: "Events",
                newName: "Date");
        }
    }
}
