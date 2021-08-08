using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABS.DBModels.Models.SecurityModels;
using ABSDAL.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ABSDAL.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly BudgetingContext _context;

        public AuthenticationController(BudgetingContext budgetingContext)
        {
            _context = budgetingContext;
        }




        // GET: api/Authentication
        [HttpGet]
        [Route("GetMenuItems")]
        public async Task<string> GetMenuItems()
        {
 
            var lstscreenoperation = await _context._IdentityScreenOperations.Include(f=>f.IdentityScreens).Include(f=>f.IdentityOperation).Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();

            var menuitemsdata = lstscreenoperation.GroupBy(f => f.IdentityScreens, (key, value) => new
            {
                id = key.IdentityScreenID
        ,
                name = key.Name
        ,
                value = key.Value
        ,
                description = key.Description
        ,
                parentId = key.ParentID
        ,
                actionsPermission = value. ToList().Select(s=> new { id = s.IdentityOperation.IdentityOperationID 
                , name=s.IdentityOperation.Name
                , value = s.IdentityOperation.Value
                , description = s.IdentityOperation.Description
                } )
            })
                .ToList();

            var ser = Newtonsoft.Json.JsonConvert.SerializeObject(menuitemsdata);
            return ser;

        }

        // GET: api/Authentication/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Authentication
        [HttpPost]
        [Route("SignIn")]
        public async Task<UserAuthResponse> SignIn([FromBody] UserAuthRequest UserObj)
        {
          var res =  await Operations.opAuthentication.UserSignIn(UserObj,_context);
            return res;
        }
        [HttpGet]
        [Route("UserDetails")]
        public ABS.DBModels.UserAuthenticationModel UserDetails( string UserObj)
        {
          var res =   Operations.opAuthentication.UserDetails(UserObj,_context);
            return res.Result;
        }
         [HttpGet]
        [Route("GetUserAuthorization")]
        public string GetUserAuthorization( string UserObj)
        {
          var res =   Operations.opAuthentication.GetUserAuthorization(UserObj,_context);
            return res.Result;
        }
        
        [HttpPost]
        [Route("UpdateUserDetails")]
        public string  UpdateUserDetails([FromBody] UserAuthenticationModel UserObj)
        {
          var res =   Operations.opAuthentication.UpdateUserDetails(UserObj,_context);
            return res.Result;
        }
        
        [HttpGet]
        [Route("RoleSetupDetails")]
        public async Task<ABS.DBModels.RoleAuthenticationModel> RoleSetupDetails( string RamObj)
        {
          var res =  await  Operations.opAuthentication.RoleSetupDetails(RamObj, _context);
            return res;
        }
        
        [HttpPost]
        [Route("UpdateRoleSetupDetails")]
        public async Task<string> UpdateRoleSetupDetails([FromBody] RoleAuthenticationModel RamObj)
        {
          var res =  await  Operations.opAuthentication.UpdateRoleSetupDetails(RamObj, _context);
            return res ;
        }

        [HttpPost]
        [Route("GenerateMenuData")]
        public async Task<string> GenerateMenuData([FromBody] string MenuObj )
        {
            var res = await Operations.opAuthentication.GenerateMenuData(MenuObj, _context);
            return res;
        }

        // PUT: api/Authentication/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
