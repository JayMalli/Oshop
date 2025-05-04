using WebAPI.Data.Repo;
using WebAPI.Interfaces;

namespace WebAPI.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dc;

        public UnitOfWork(DataContext dc)
        {
            _dc = dc;
        }

        public IUserRepository UserRepository => new UserRepository(_dc);
        public IProductRepository ProductRepository => new ProductRepository(_dc);
        public ICartRepository CartRepository => new CartRepository(_dc);
        public IOrderRepository OrderRepository => new OrderRepository(_dc);

        public async Task<bool> SaveAsync()
        {
            return await _dc.SaveChangesAsync() > 0;
        }
    }
}