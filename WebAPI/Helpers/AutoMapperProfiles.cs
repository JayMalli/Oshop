using System.Text;
using AutoMapper;
using WebAPI.Dto;
using WebAPI.Dto.category;
using WebAPI.Dto.orders;
using WebAPI.Dto.products;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<char, byte>().ConvertUsing(s => Convert.ToByte(s));
            CreateMap<RegisterReqDto, User>().ReverseMap();
            CreateMap<LoginReqDto, User>().ReverseMap();
            CreateMap<CategoryDtoReq, Category>().ReverseMap();
            CreateMap<CategoryDtoRes, Category>().ReverseMap();
            CreateMap<ProductDtoRes, Product>();
            CreateMap<ProductDtoReq, Product>();
            CreateMap<Product, ProductDtoRes>().ForMember(p => p.ProductIMG, opt => opt.MapFrom(src => Encoding.UTF8.GetString(src.ProductIMG)));
            CreateMap<CartDto, CartItems>();
            CreateMap<CartItems, CartDto>().ForMember(c => c.ProductImage, opt => opt.MapFrom(src => Encoding.UTF8.GetString(src.ProductImage)));
            CreateMap<OrderReqDto, Order>();
            CreateMap<OrderDetailsDto, Orders>();
        }
    }
}