using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mvc5.Models;

namespace Mvc5.Repositories
{
    public interface IPrRepository
    {
        /// <summary>
        /// 查詢請購單清單
        /// </summary>
        /// <param name="status">請購單狀態</param>
        /// <param name="q">查詢字串</param>
        /// <param name="page">頁碼</param>
        /// <param name="pageSize">每頁筆數</param>
        /// <returns>DTO, 總筆數</returns>
        Task<(IEnumerable<PrDto> Items, int Total)> QueryAsync(string status, string q, int page, int pageSize);

        /// <summary>
        /// Retrieves a purchase request (PR) based on the specified PR number.
        /// </summary>
        /// <remarks>This method performs an asynchronous operation to fetch the purchase request details.
        /// Ensure that the PR number provided is valid and corresponds to an existing purchase request in the
        /// system.</remarks>
        /// <param name="prNo">The unique identifier of the purchase request to retrieve. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="PrDto"/> object
        /// representing the purchase request, or <see langword="null"/> if no matching purchase request is found.</returns>
        Task<PrDto> GetAsync(string prNo);
    }
}
