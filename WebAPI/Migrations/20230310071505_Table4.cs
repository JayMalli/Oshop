using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    public partial class Table4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Order_OrderUserId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_OrderUserId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrderUserId",
                table: "Orders");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderUserId",
                table: "Orders",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderUserId",
                table: "Orders",
                column: "OrderUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Order_OrderUserId",
                table: "Orders",
                column: "OrderUserId",
                principalTable: "Order",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
