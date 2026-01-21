using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Mvc5.Models
{
    public class PrDto
    {
        public string PrNo { get; set; }
        public string PrDate { get; set; }
        public string Requester { get; set; }
        public string Dept { get; set; }
        public string ApproverStatus { get; set; }
        public string CreatedAt { get; set; }
        public List<ApproverDto> Approvers { get; set; }
        public List<ItemDto> Items { get; set; }
    }

    public class ApproverDto
    {
        public string Title { get; set; }
        public string Approver { get; set; }
        public string ApproveDate { get; set; }
        public string ApproveStatus { get; set; }
    }

    public class ItemDto
    {
        public int Idx { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string Spec { get; set; }
        public int Qty { get; set; }
        public string Vendor { get; set; }
    }
}