using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class PostEvaluationTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "evaluation_form",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    OrganizerId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evaluation_form", x => x.Id);
                    table.ForeignKey(
                        name: "FK_evaluation_form_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "evaluation_question",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EvaluationFormId = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Question = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evaluation_question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_evaluation_question_evaluation_form_EvaluationFormId",
                        column: x => x.EvaluationFormId,
                        principalTable: "evaluation_form",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "evaluation_answer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AttendeeId = table.Column<int>(type: "int", nullable: false),
                    EvaluationFormId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Answer = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evaluation_answer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_evaluation_answer_evaluation_form_EvaluationFormId",
                        column: x => x.EvaluationFormId,
                        principalTable: "evaluation_form",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_evaluation_answer_evaluation_question_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "evaluation_question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_evaluation_answer_users_AttendeeId",
                        column: x => x.AttendeeId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_answer_AttendeeId",
                table: "evaluation_answer",
                column: "AttendeeId");

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_answer_EvaluationFormId",
                table: "evaluation_answer",
                column: "EvaluationFormId");

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_answer_QuestionId",
                table: "evaluation_answer",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_form_EventId",
                table: "evaluation_form",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_question_EvaluationFormId",
                table: "evaluation_question",
                column: "EvaluationFormId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "evaluation_answer");

            migrationBuilder.DropTable(
                name: "evaluation_question");

            migrationBuilder.DropTable(
                name: "evaluation_form");
        }
    }
}
