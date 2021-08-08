using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.SubAccounts
{
    public class SubAccountsList
    {

        public List<int> BudgetVersionID { get; set; }
        public List<int> EntityID { get; set; }
        public List<int> DeptID { get; set; }
        public List<int> StatisticsCodeID { get; set; }
        public List<int> GLAccountID { get; set; }
        public List<int> JobCodeID { get; set; }
        public List<int> PayTypeID { get; set; }
       
    }
}
