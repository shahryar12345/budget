using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models
{
    public class MonthNames
    {
        public static Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
        {
            {1, "January"},
            {2, "February"},
            {3, "March"},
            {4, "April"},
            {5, "May"},
            {6, "June"},
            {7, "July"},
            {8, "August"},
            {9, "September"},
            {10, "October"},
            {11, "November"},
            {12, "December"},
        };
    }
}
