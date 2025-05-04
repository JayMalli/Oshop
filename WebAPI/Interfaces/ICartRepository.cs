using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dto;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ICartRepository
    {
        CartItems UpdateCart(CartItems cart);
        CartItems AddCart(CartItems cart);

        List<CartItems> GetCart(string cartId);

        void ClearCart(string cartId);
    }

}