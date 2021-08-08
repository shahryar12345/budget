using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.SubAccounts
{
    public class SubAccountDetails
    {

        public int bvRowId { get; set; }

        public string scenariotype { get; set; }
        public List<SubAccountData> rows { get; set; }

    }

    public class SubAccountData
    {
        public string subAccName { get; set; }

        public bool isParentRow { get; set; }
        public bool isSubAccRow { get; set; }
        public bool isReconcilRow { get; set; }
        public bool islock { get; set; }

        public decimal? January { get; set; }
        public decimal? February { get; set; }
        public decimal? March { get; set; }
        public decimal? April { get; set; }
        public decimal? May { get; set; }
        public decimal? June { get; set; }
        public decimal? July { get; set; }
        public decimal? August { get; set; }
        public decimal? September { get; set; }
        public decimal? October { get; set; }
        public decimal? November { get; set; }
        public decimal? December { get; set; }
        public decimal? total { get; set; }

    }
}
