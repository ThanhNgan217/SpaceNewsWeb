using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace News.api.Migrations
{
    /// <inheritdoc />
    public partial class Add_FK_Groups_Posts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
            name: "FK_Groups_Post_GroupID",
            table: "Posts",
            column: "GroupID",
            principalTable: "Groups",
            principalColumn: "Id",
            onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
