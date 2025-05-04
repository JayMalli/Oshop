using System.Text;
using Microsoft.EntityFrameworkCore;
using WebAPI.Dto.products;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _dc;

        public ProductRepository(DataContext dc)
        {
            _dc = dc;
        }
        public Category AddCategory(Category categoryReq)
        {
            _dc.Categories.Add(categoryReq);

            return categoryReq;
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _dc.Categories.ToListAsync();
        }

        public async Task<List<ProductDtoRes>?> GetProducts()
        {
            var joinTbl = _dc.Products.Join(_dc.Categories, products => products.CategoryId, categories => categories.CategoryId, (products, categories) => new { products, categories });

            var data = await joinTbl.Select(m => new ProductDtoRes
            {
                CategoryName = m.categories.CategoryName,
                ProductId = m.products.ProductId,
                ProductName = m.products.ProductName,
                ProductPrice = m.products.ProductPrice,
                ProductIMG = Encoding.UTF8.GetString(m.products.ProductIMG)
            }).ToListAsync();

            return data;
        }
        public Product AddProduct(Product productReq)
        {
            _dc.Products.Add(productReq);
            return productReq;
        }

        public void DeleteProduct(Product productReq)
        {
            _dc.Products.Remove(productReq);
        }


        public UpdateProductDtoReq? UpdateProduct(UpdateProductDtoReq updateProductDtoReq)
        {
            var product = _dc.Products.Find(updateProductDtoReq.ProductId);
            if (product == null)
            {
                return null;
            }
            product.CategoryId = updateProductDtoReq.CategoryId;
            product.ProductName = updateProductDtoReq.ProductName;
            product.ProductPrice = updateProductDtoReq.ProductPrice;
            product.ProductIMG = Encoding.UTF8.GetBytes(updateProductDtoReq.ProductIMG);
            return updateProductDtoReq;
        }



    }
}