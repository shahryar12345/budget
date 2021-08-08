using System;
using System.Collections.Generic;
using System.Text;
using ABS.DBModels;

namespace ABSDAL.Test
{
    class TestData
    {
        public static  List<ABS.DBModels.SystemSettings> getSystemSettingTestData()
        {
            List< ABS.DBModels.SystemSettings> TestDataList = new List <ABS.DBModels.SystemSettings>();

            TestDataList.Add(new ABS.DBModels.SystemSettings { Identifier = Guid.NewGuid(), SettingKey = "DateFormat", SettingValue =  "yyyyMMdd"  });

            return TestDataList;
        }

        internal static object getItemTypeTestData()
        {
            List< ABS.DBModels.ItemTypes> TestDataList = new List <ABS.DBModels.ItemTypes>();

            TestDataList.Add(new ABS.DBModels.ItemTypes { Identifier = Guid.NewGuid(), ItemTypeCode = "X", ItemDataType = "Date" , ItemTypeValue = "yyyyMMdd"});

            return TestDataList;
        }
    }
}
