using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendProject.Migrations
{
    /// <inheritdoc />
    public partial class EvalForm20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_evaluation_question_evaluation_form_EvaluationFormId",
                table: "evaluation_question");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "evaluation_question");

            migrationBuilder.RenameColumn(
                name: "Question",
                table: "evaluation_question",
                newName: "QuestionText");

            migrationBuilder.RenameColumn(
                name: "EvaluationFormId",
                table: "evaluation_question",
                newName: "EvaluationCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_evaluation_question_EvaluationFormId",
                table: "evaluation_question",
                newName: "IX_evaluation_question_EvaluationCategoryId");

            migrationBuilder.CreateTable(
                name: "evaluation_category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EvaluationFormId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evaluation_category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_evaluation_category_evaluation_form_EvaluationFormId",
                        column: x => x.EvaluationFormId,
                        principalTable: "evaluation_form",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 14, 3, 41, 43, 789, DateTimeKind.Local).AddTicks(3005), "$2a$11$ZshfXSjbrumWNiSzM5S2XuoQWgALDQrLxdLS2PO1fq/NrIka2CtUy" });

            migrationBuilder.CreateIndex(
                name: "IX_evaluation_category_EvaluationFormId",
                table: "evaluation_category",
                column: "EvaluationFormId");

            migrationBuilder.AddForeignKey(
                name: "FK_evaluation_question_evaluation_category_EvaluationCategoryId",
                table: "evaluation_question",
                column: "EvaluationCategoryId",
                principalTable: "evaluation_category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_evaluation_question_evaluation_category_EvaluationCategoryId",
                table: "evaluation_question");

            migrationBuilder.DropTable(
                name: "evaluation_category");

            migrationBuilder.RenameColumn(
                name: "QuestionText",
                table: "evaluation_question",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "EvaluationCategoryId",
                table: "evaluation_question",
                newName: "EvaluationFormId");

            migrationBuilder.RenameIndex(
                name: "IX_evaluation_question_EvaluationCategoryId",
                table: "evaluation_question",
                newName: "IX_evaluation_question_EvaluationFormId");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "evaluation_question",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created_At", "Password" },
                values: new object[] { new DateTime(2024, 12, 14, 1, 39, 39, 286, DateTimeKind.Local).AddTicks(7991), "$2a$11$GNorie6HDU2JCNDLiIc4V.VfO8VBuz5ldLb93xXJPc4p44LfcW.g2" });

            migrationBuilder.AddForeignKey(
                name: "FK_evaluation_question_evaluation_form_EvaluationFormId",
                table: "evaluation_question",
                column: "EvaluationFormId",
                principalTable: "evaluation_form",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
