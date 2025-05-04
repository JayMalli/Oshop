using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dto;
using WebAPI.Dto.products;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Category>> GetCategories();
        Category AddCategory(Category categoryReq);

        Task<List<ProductDtoRes>?> GetProducts();

        Product AddProduct(Product productReq);
        void DeleteProduct(Product productReq);

        UpdateProductDtoReq? UpdateProduct(UpdateProductDtoReq updateProductDtoReq);
    }
}