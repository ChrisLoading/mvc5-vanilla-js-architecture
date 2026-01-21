using Mvc5.Models; // DTO namespace
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Mvc5.Services;
using Mvc5.Repositories;

namespace Mvc5.Controllers
{
    [RoutePrefix("api/pr")]
    public class PrApiController : ApiController
    {
        private readonly IPrService _service;

        // DI friendly constructor (方便 unit test / for DI container)
        public PrApiController(IPrService service)
        {
            _service = service;
        }

        // parameterless constructor 保留原行為（方便現有啟動/無 DI 時可直接使用）
        //public PrApiController() : this(new PrService(new PrRepository()))
        //{

        //}

        // GET /api/pr?status=pending|review|approved|rejected&q=&page=1&pageSize=50
        [HttpGet, Route("")]
        public async Task<IHttpActionResult> List(string status = null, string q = null, int page = 1, int pageSize = 50)
        {
            var (items, total) = await _service.ListAsync(status, q, page, pageSize);

            return Ok(new
            {
                items,
                total,
                page,
                pageSize
            });
        }

        // GET /api/pr/{prNo}
        [HttpGet, Route("{prNo}")]
        public async Task<IHttpActionResult> Get(string prNo)
        {
            var dto = await _service.GetAsync(prNo);
            if (dto == null)
            {
                return NotFound();
            }

            return Ok(dto);
        }
    }
}
