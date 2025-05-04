using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class CartRepository : ICartRepository
    {
        private readonly DataContext _dc;

        public CartRepository(DataContext dc)
        {
            _dc = dc;
        }
        public CartItems UpdateCart(CartItems item)
        {
            var cartItem = _dc.CartItems.Where(i => i.CartId == item.CartId && i.ProductId == item.ProductId).SingleOrDefault();
            if (cartItem == null)
            {
                _dc.CartItems.Add(item);
                return item;
            }
            cartItem.ProductPrice = item.ProductPrice;
            cartItem.ProductQuantity = item.ProductQuantity;
            cartItem.ProductImage = item.ProductImage;
            cartItem.CategoryName = item.CategoryName;
            cartItem.ProductName = item.ProductName;
            return item;
        }

        public List<CartItems> GetCart(string cartId)
        {
            return _dc.CartItems.Where(c => c.CartId == cartId).ToList();
        }

        public CartItems AddCart(CartItems cart)
        {
            var c = new Cart
            {
                CartId = cart.CartId
            };
            _dc.Carts.Add(c);
            var cartItem = new CartItems
            {
                CartId = cart.CartId,
                ProductId = cart.ProductId,
                ProductPrice = cart.ProductPrice,
                ProductQuantity = cart.ProductQuantity,
                ProductImage = cart.ProductImage,
                ProductName = cart.ProductName,
                CategoryName = cart.CategoryName
            };
            _dc.CartItems.Add(cartItem);
            return cart;
        }

        public void ClearCart(string cartId)
        {
            _dc.CartItems.RemoveRange(_dc.CartItems.Where(c => c.CartId == cartId));
            _dc.Carts.RemoveRange(_dc.Carts.Where(c => c.CartId == cartId));
        }
    }
}