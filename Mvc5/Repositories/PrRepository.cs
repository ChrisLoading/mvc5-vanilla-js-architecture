using Mvc5.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;

namespace Mvc5.Repositories
{
    public class PrRepository : IPrRepository
    {
        public async Task<(IEnumerable<PrDto> Items, int Total)> QueryAsync(string status, string q, int page, int pageSize)
        {
            using (var db = new AppDbContext())
            {
                // 基本查詢（含項目/簽核流）
                var query = db.PRHeader
                    .Include(h => h.PRItem)
                    .Include(h => h.PRApprover)
                    .AsQueryable();

                // 關鍵字（PrNo/Requester/Dept）
                if (!string.IsNullOrEmpty(q))
                {
                    query = query.Where(x => x.PrNo.Contains(q) || x.Requester.Contains(q) || x.Dept.Contains(q));
                }

                // 狀態過濾（依實作，這裡示範用字串，如果用 tinyint enum，改成對應條件）
                if (!string.IsNullOrEmpty(status))
                {
                    // pending/review/approved/rejected → 對應資料庫欄位值
                    // 這裡先示例：資料庫存中文（不建議），可改 enum 後在此映射
                    if (status == "approved")
                        query = query.Where(x => x.ApproveStatus == "簽核完成");
                    else if (status == "rejected")
                        query = query.Where(x => x.ApproveStatus == "退回");
                    else if (status == "review")
                        query = query.Where(x => x.ApproveStatus == "審核中");
                    else
                        query = query.Where(x => x.ApproveStatus == "未覆核" || x.ApproveStatus == null || x.ApproveStatus == "");
                }

                // 總筆數
                var total = await query.CountAsync();

                var list = await query
                    .OrderByDescending(x => x.PrNo)
                    .Skip((page-1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var dtoList = list.Select(x => new PrDto
                {
                    PrNo = x.PrNo, 
                    PrDate = x.PrDate, 
                    Requester = x.Requester,
                    ApproverStatus = x.ApproveStatus,
                    CreatedAt = x.CreatedAt, 
                    Approvers = x.PRApprover
                        .OrderBy(a => a.Step)
                        .Select(a => new ApproverDto
                        {
                            Title = a.Title, 
                            Approver = a.Approver,
                            ApproveDate = a.ApproveDate, 
                            ApproveStatus = a.ApproveStatus
                        }).ToList(),
                    Items = x.PRItem
                        .OrderBy(i => i.Idx)
                        .Select(i => new ItemDto
                        {
                            Idx = i.Idx, 
                            Category = i.Category,
                            Name = i.Name, 
                            Spec = i.Spec,
                            Qty = i.Qty ?? 0, 
                            Vendor = i.Vendor
                        }).ToList()
                }).ToList();

                return (dtoList, total);
            }
        }

        public async Task<PrDto> GetAsync(string PrNo)
        {
            using (var db = new AppDbContext())
            {
                var x = await db.PRHeader
                    .Include(h => h.PRItem)
                    .Include(h => h.PRApprover)
                    .FirstOrDefaultAsync(h => h.PrNo == PrNo);
                if (x == null)
                {
                    return null;
                }

                var dto = new PrDto
                {
                    PrNo = x.PrNo, 
                    PrDate = x.PrDate, 
                    Requester = x.Requester, 
                    Dept = x.Dept,
                    ApproverStatus = x.ApproveStatus,
                    CreatedAt = x.CreatedAt,
                    Approvers = x.PRApprover
                        .OrderBy(a => a.Step)
                        .Select(a => new ApproverDto
                        {
                            Title = a.Title, 
                            Approver = a.Approver,
                            ApproveDate = a.ApproveDate, 
                            ApproveStatus = a.ApproveStatus
                        }).ToList(),
                    Items = x.PRItem
                        .OrderBy(i => i.Idx)
                        .Select(i => new ItemDto
                        {
                            Idx = i.Idx, 
                            Category = i.Category,
                            Name = i.Name, 
                            Spec = i.Spec,
                            Qty = i.Qty ?? 0, 
                            Vendor = i.Vendor
                        }).ToList()
                };
                return dto;
            }
        }
    }
}