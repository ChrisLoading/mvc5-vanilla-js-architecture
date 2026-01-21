using Mvc5.Models;
using Mvc5.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Mvc5.Services
{
    public class PrService : IPrService
    {
        private readonly IPrRepository _repo;
        public PrService(IPrRepository repo)
        {
            _repo = repo;
        }

        public async Task<(IEnumerable<PrDto> Items, int Total)> ListAsync(string status, string q, int page, int pageSize)
        {
            return await _repo.QueryAsync(status, q, page, pageSize);
        }

        public async Task<PrDto> GetAsync(string prNo)
        {
            return await _repo.GetAsync(prNo);
        }
    }

}