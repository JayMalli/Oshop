using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dto.category;
using WebAPI.Dto.products;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public ProductController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet("getcategories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _uow.ProductRepository.GetCategories();
            var categoriesDto = _mapper.Map<List<CategoryDtoRes>>(categories);
            return Ok(categoriesDto);
        }
        [HttpPost("addcategory")]
        public async Task<IActionResult> AddCategory(CategoryDtoReq categoryReq)
        {
            var categories = await _uow.ProductRepository.GetCategories();
            var cat = categories.Find(c => c.CategoryId == categoryReq.CategoryName.ToLower());
            if (cat != null)
            {
                return BadRequest("Catgory is already  exist");
            }
            var category = _mapper.Map<Category>(categoryReq);
            category.CategoryId = categoryReq.CategoryName.ToLower();
            _uow.ProductRepository.AddCategory(category);
            await _uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpGet("getproducts")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPrducts()
        {
            var products = await _uow.ProductRepository.GetProducts();
            var productsDto = _mapper.Map<List<ProductDtoRes>>(products);
            return Ok((productsDto));
        }

        [HttpPost("addproduct")]
        public async Task<IActionResult> AddProduct([FromBody] ProductDtoReq productDto)
        {
            var products = await _uow.ProductRepository.GetProducts();
            var pro = products.Find(p => p.ProductId == productDto.ProductName.ToLower());
            if (pro != null)
            {
                return StatusCode(400, "Product is already exist");
            }
            var product = _mapper.Map<Product>(productDto);
            product.ProductId = productDto.ProductName.ToLower();
            product.ProductIMG = Encoding.UTF8.GetBytes(productDto.ProductIMG);
            // product
            _uow.ProductRepository.AddProduct(product);
            await _uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpPut("updateproduct")]

        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductDtoReq updateProductDtoReq)
        {
            if (updateProductDtoReq.ProductId == null)
            {
                return StatusCode(400, "product does not exist");
            }
            var result = _uow.ProductRepository.UpdateProduct(updateProductDtoReq);
            if (result == null)
            {
                return BadRequest();
            }
            await _uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpDelete("deleteproduct/{productId}")]
        public async Task<ActionResult> DeleteProduct(string productId)
        {

            var products = await _uow.ProductRepository.GetProducts();
            var product = products.Find(p => p.ProductId == productId);
            if (product == null)
            {
                return StatusCode(404, "Product doesn't exist!");
            }
            var prouctDetails = _mapper.Map<Product>(product);
            _uow.ProductRepository.DeleteProduct(prouctDetails);

            await _uow.SaveAsync();

            return StatusCode(200, "proudct deleted successfully!");
        }
    }
}