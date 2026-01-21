using Mvc5.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mvc5.Services
{
    public interface IPrService
    {
        Task<(IEnumerable<PrDto> Items, int Total)> ListAsync(string status, string q, int page, int pageSize);
        Task<PrDto> GetAsync(string prNo);
        // 未來可加 CreateAsync/UpdateAsync/ApproveAsync 等商業行為方法
    }
}
