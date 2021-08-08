using System;
using Xunit;
using ABSDAL;
using ABSDAL.Controllers;
using FluentAssertions;

namespace ABSDAL.Test.UTest
{
  public  class ItemTypesUT
    {
        [Fact]
        public void ItemType_GetAllNotNull()
        {
            var getTestData = TestData.getItemTypeTestData();

            var ctrller = new ItemTypesController(ContextBuilder.GetDbContext());

            var x = ctrller.GetAll_ItemTypes();


            ctrller.Should().NotBeNull();

        }
        [Fact]
        public void ItemType_GetAllNull()
        {
            var getTestData = TestData.getItemTypeTestData();

            var ctrller = new ItemTypesController(ContextBuilder.GetDbContext());

            var x = ctrller.GetAll_ItemTypes();


            ctrller.Should().BeNull();

        }
    }
}
