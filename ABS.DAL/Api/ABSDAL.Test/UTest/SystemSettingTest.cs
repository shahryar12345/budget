using System;
using Xunit;
using ABSDAL;
using ABSDAL.Controllers;
using FluentAssertions;

namespace ABSDAL.Test
{
    public class SystemSettingTest
    {
        [Fact]
        public void SystemSetting_GetAllNotNull()
        {
            var getTestData = TestData.getSystemSettingTestData();

            var ctrller = new SystemSettingsController(ContextBuilder.GetDbContext());

           var x =  ctrller.GetAll_SystemSettings();

            
            ctrller.Should().NotBeNull();

        }
 [Fact]
        public void SystemSetting_GetAllNull()
        {
            var getTestData = TestData.getSystemSettingTestData();

            var ctrller = new SystemSettingsController(ContextBuilder.GetDbContext());

            var x = ctrller.GetAll_SystemSettings();


            ctrller.Should().BeNull();

        }
    }
}
