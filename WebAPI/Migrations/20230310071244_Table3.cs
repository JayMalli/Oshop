using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    public partial class Table3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_OrdersOrderId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_OrdersOrderId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "OrdersOrderId",
                table: "OrderItems");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrdersOrderId",
                table: "OrderItems",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrdersOrderId",
                table: "OrderItems",
                column: "OrdersOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_OrdersOrderId",
                table: "OrderItems",
                column: "OrdersOrderId",
                principalTable: "Orders",
                principalColumn: "OrderId");
        }
    }
}
