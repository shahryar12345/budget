using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using ABS.ADSIntegrator.ABSClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;

namespace ABS.ADSIntegrator.Controllers
{
    [ApiController]

    public class ADSDataImport : ControllerBase
    {

        private readonly IHttpClientFactory _httpClientFactory;

        public IConfiguration Configuration;



        public ADSDataImport(IConfiguration _config, IHttpClientFactory httpClientFactory)
        {
            Configuration = _config;
            _httpClientFactory = httpClientFactory;
        }
        [HttpGet]
        [Route("integrator/ImportAll")]
        [ApiExplorerSettings(GroupName = "Generics")]

        public async Task<IActionResult> ImportAll()
        {




            /*
             
             paytypes - Types
             Entities Groups
             
             */
            Console.WriteLine("Import All Started: ||");
            await TypesPayTypes();

            await GetADSEntityCodeGroups();
            await GetADSEntities();
            await GetADSEntityCodeGroupMembers();
            await Task.Delay(10000);


            await GetADSDepartmentMasters();
            await GETADSDepartmentHierarchies();
            await GETADSDepartmentCodeGroups();
            await GetADSDepartments();
            await Task.Delay(10000);

            await GETADSDepartmentNodes();
            await Task.Delay(10000);

            await GETADSDepartmentCodeGroupMembers();

            await GetADSStatisticsCodesMaster();
            await GetADSStatisticsCodesGroups();
            await GetADSStatisticsCodes();
            await GetADSStatisticsCodesGroupMembers();
            await Task.Delay(10000);

            await GetGLAccountMasterData();
            await GetGLAccountsHierarchyData();

            await GetGLAccountData();
            await Task.Delay(10000);

            await GetGLAccountsNodesData();
            await Task.Delay(60000);


            await GetPayTypesMasterData();
            await GetPayTypesCodeGroupsData();
            await GetPayTypesData();
            await Task.Delay(10000);

            await GetPayTypesCodeGroupMembersData();
            await Task.Delay(10000);


            await GetJOBCODEsMasterData();
            await GetJOBCODEsCodeGroupsData();
            await GetJOBCODEsData();
            await Task.Delay(10000);

            await GetJOBCODEsCodeGroupMembersData();
            await Task.Delay(60000);


            await GetADSChargeCodeMaster();
            await GetADSChargeCodes();

            await GetADSTimePeriods();

            await DataScenariosStaffing();
            await DataScenariosGL();
            await DataScenariosStats();
            await Task.Delay(60000);
            await GetStatisticsActivityData();
            await Task.Delay(180000);
            await StaffingData();
            await Task.Delay(180000);
            await GetADSGLActivityData();

            //await GetADSStatisticsCodesData();

            //await StaffingDataPayType();
            //await StaffingDataJobCode();

            Console.WriteLine("!!! Import All Finished !!!");
            return Ok();
        }
        [HttpGet]
        [Route("integrator/TimePeriods")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Timeperiods")]

        public async Task<IActionResult> GetADSTimePeriods()
        {


            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.GetADSTimePeriodData());

        }

        [HttpGet]
        [Route("integrator/Entities")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Entities")]

        public async Task<IActionResult> GetADSEntities()
        {


            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("GetADSEntityData", "ADSENTITY", "BUDGETINGENTITY"));
        }

        [HttpGet]
        [Route("integrator/EntityCodeGroups")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Entities")]

        public async Task<IActionResult> GetADSEntityCodeGroups()
        {


            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("EntityCodeGroups", "ADSENTITYCODEGROUP", "BUDGETINGENTITYCODEGROUP", "isGroup", "true"));
        }

        [HttpGet]
        [Route("integrator/EntityCodeGroupMembers")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Entities")]

        public async Task<IActionResult> GetADSEntityCodeGroupMembers()
        {


            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("EntityCodeGroupMembers", "ADSENTITYCODEGROUPMEMBER", "BUDGETINGENTITYCODEGROUPMEMBER", "relationshipType", "Group"));
        }

        [HttpGet]
        [Route("integrator/Departments")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GetADSDepartments()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("Departments", "ADSDEPARTMENT", "BUDGETINGDEPARTMENT"));

        }

        [HttpGet]
        [Route("integrator/DepartmentMasters")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GetADSDepartmentMasters()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("DepartmentMaster", "ADSDEPARTMENTMASTER", "BUDGETINGDEPARTMENTMASTER", "isMaster", "true"));

        }

        [HttpGet]
        [Route("integrator/DepartmentHierarchies")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GETADSDepartmentHierarchies()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("DepartmentHierarchy", "ADSDEPARTMENTHIERARCHY", "BUDGETINGDEPARTMENTHIERARCHY", "isHierarchy", "true"));

        }

        [HttpGet]
        [Route("integrator/DepartmentCodeGroups")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GETADSDepartmentCodeGroups()
        {
            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("DepartmentCodeGroup", "ADSDEPARTMENTCODEGROUP", "BUDGETINGDEPARTMENTCODEGROUP", "isCodeGroup", "true"));
        }

        [HttpGet]
        [Route("integrator/DepartmentCodeGroupMembers")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GETADSDepartmentCodeGroupMembers()
        {
            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("DepartmentCodeGroupMember", "ADSDEPARTMENTCODEGROUPMEMBER", "BUDGETINGDEPARTMENTCODEGROUPMEMBER", "relationshipType", "Group"));
        }

        [HttpGet]
        [Route("integrator/DepartmentNodes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Departments")]

        public async Task<IActionResult> GETADSDepartmentNodes()
        {
            var rng = new ADSData(_httpClientFactory, Configuration);
            return Ok(await rng.ADSImportData("DepartmentNode", "ADSDEPARTMENTNODE", "BUDGETINGDEPARTMENTNODE", "relationshipType", "Hierarchy"));
        }

        [HttpGet]
        [Route("integrator/StatisticsCodes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        public async Task<IActionResult> GetADSStatisticsCodes()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

          //  return Ok(await rng.GetADSStatisticsCodeData());
            return Ok(await rng.ADSImportData("GetADSStatisticsCodeData", "ADSSTATISTICSCODE", "BUDGETINGSTATISTICSCODE", "isStatsCode", "true"));

        }
        [HttpGet]
        [Route("integrator/StatisticsCodesMaster")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        public async Task<IActionResult> GetADSStatisticsCodesMaster()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            //return Ok(await rng.GetADSStatisticsCodeData());
            return Ok(await rng.ADSImportData("GetADSStatisticsCodesMaster", "ADSSTATISTICSCODESMASTER", "BUDGETINGSTATISTICSCODESMASTER", "isMaster", "true"));


        }
        [HttpGet]
        [Route("integrator/StatisticsCodesGroups")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        public async Task<IActionResult> GetADSStatisticsCodesGroups()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

           // return Ok(await rng.GetADSStatisticsCodeData());
            return Ok(await rng.ADSImportData("GetADSStatisticsCodesGroups", "ADSSTATISTICSCODESGROUPS", "BUDGETINGSTATISTICSCODESGROUPS", "isGroup", "true"));


        }
        [HttpGet]
        [Route("integrator/StatisticsCodesGroupMembers")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        public async Task<IActionResult> GetADSStatisticsCodesGroupMembers()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetADSStatisticsCodeData());
            return Ok(await rng.ADSImportData("GetADSStatisticsCodesGroupMembers", "ADSSTATISTICSCODESGROUPMEMBERS", "BUDGETINGSTATISTICSCODESGROUPMEMBERS", "isGroupMember", "true"));


        }

        [HttpGet]
        [Route("integrator/ChargeCodes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Charge Codes")]

        public async Task<IActionResult> GetADSChargeCodes()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("ChargeCode", "ADSCHARGECODE", "BUDGETINGCHARGECODE"));


        }

        [HttpGet]
        [Route("integrator/ChargeCodeMaster")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Charge Codes")]

        public async Task<IActionResult> GetADSChargeCodeMaster()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("ChargeCodeMaster", "ADSCHARGECODEMASTER", "BUDGETINGCHARGECODEMASTER", "isMaster", "true"));

        }

        //[HttpGet]
        //[Route("integrator/StatisticsCodesData")]
        //[ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        //public async Task<IActionResult> GetADSStatisticsCodesData()
        //{

        //    var rng = new ADSData(_httpClientFactory, Configuration);

        //    return Ok(await rng.GetADSStatisticsCodesData());

        //}
        #region StatisticsActivityData


        [HttpGet]
        [Route("integrator/StatisticsActivityData")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Statistics")]

        public async Task<IActionResult> GetStatisticsActivityData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            //return Ok(await rng.GetStatisticsActivityData());
            
            return Ok(await rng.ADSImportData("GetStatisticsActivityData", "ADSSTATISTICSACTIVITY", "BUDGETINGSTATISTICSACTIVITY", "DataScenario", "ST"));

        }
        #endregion
        #region GLData


        [HttpGet]
        [Route("integrator/GLAccounts")]
        [ApiExplorerSettings(GroupName = "ADS Integrator GL")]

        public async Task<IActionResult> GetGLAccountData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.GetGLAccountData());

        }
          [HttpGet]
        [Route("integrator/GLAccountsMaster")]
        [ApiExplorerSettings(GroupName = "ADS Integrator GL")]

        public async Task<IActionResult> GetGLAccountMasterData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("GetGLAccountMasterData", "ADSGLACCOUNTSMASTER", "BUDGETINGGLACCOUNTSMASTER", "isMaster", "true"));

        }
         [HttpGet]
        [Route("integrator/GLAccountsHierarchy")]
        [ApiExplorerSettings(GroupName = "ADS Integrator GL")]

        public async Task<IActionResult> GetGLAccountsHierarchyData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("GetGLAccountsHierarchyData", "ADSGLACCOUNTSHIERARCHY", "BUDGETINGGLACCOUNTSHIERARCHY", "isHierarchy", "true"));

        }
          [HttpGet]
        [Route("integrator/GLAccountsNodes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator GL")]

        public async Task<IActionResult> GetGLAccountsNodesData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("GetGLAccountsNodesData", "ADSGLACCOUNTSNODES", "BUDGETINGGLACCOUNTSNODES", "isNode", "true"));

        }

        [HttpGet]
        [Route("integrator/ADSGLActivityData")]
        [ApiExplorerSettings(GroupName = "ADS Integrator GL")]

        public async Task<IActionResult> GetADSGLActivityData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("GetADSGLActivityData", "ADSDATAGLDATA", "BUDGETINGDATAGLDATA", "DataScenario", "GL"));


        }
        #endregion
        /* payTypes Controllers*/

        #region PayTypes



        [HttpGet]


        [Route("integrator/PayTypes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator PayType")]

        public async Task<IActionResult> GetPayTypesData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetPayTypesData( ));
            return Ok(await rng.ADSImportData("GetPayTypesData", "ADSPAYTYPES", "BUDGETINGPAYTYPES"));

        }


        [HttpGet]
        [Route("integrator/PayTypesCodeGroups")]
        [ApiExplorerSettings(GroupName = "ADS Integrator PayType")]

        public async Task<IActionResult> GetPayTypesCodeGroupsData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetPayTypesData( ));
            return Ok(await rng.GetPayTypesCodeGroupData());

        }

        [HttpGet]
        [Route("integrator/PayTypesMaster")]
        [ApiExplorerSettings(GroupName = "ADS Integrator PayType")]

        public async Task<IActionResult> GetPayTypesMasterData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetPayTypesData( ));
            return Ok(await rng.ADSImportData("PayTypesMaster", "ADSPAYTYPESMASTER", "BUDGETINGPAYTYPESMASTER", "isMaster", "true"));

        }


        [HttpGet]
        [Route("integrator/PayTypesCodeGroupMembers")]
        [ApiExplorerSettings(GroupName = "ADS Integrator PayType")]

        public async Task<IActionResult> GetPayTypesCodeGroupMembersData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetPayTypesData( ));
            return Ok(await rng.ADSImportData("PayTypesCodeGroupMembers", "ADSPAYTYPESCODEGROUPSMEMBERS", "BUDGETINGPAYTYPESCODEGROUPSMEMBERS", "isMemberData", "true"));

        }


        [HttpGet]
        [Route("integrator/Types/PayTypes")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Types")]

        public async Task<IActionResult> TypesPayTypes()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetPayTypesData( ));
            return Ok(await rng.ADSImportData("TypesPayTypes", "ADSTYPESPAYTYPES", "BUDGETINGTYPESPAYTYPES", "ITEMTYPEKEYWORD", "PAYTYPETYPE"));

        }
        #endregion
        /* Job Codes Started*/

        #region JObCodes



        [HttpGet]
        [Route("integrator/JOBCODES")]
        [ApiExplorerSettings(GroupName = "ADS Integrator JOB CODES")]

        public async Task<IActionResult> GetJOBCODEsData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("GetJOBCODEsData", "ADSJOBCODES", "BUDGETINGJOBCODES"));

        }


        [HttpGet]
        [Route("integrator/JOBCODEsCodeGroups")]
        [ApiExplorerSettings(GroupName = "ADS Integrator JOB CODES")]

        public async Task<IActionResult> GetJOBCODEsCodeGroupsData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            return Ok(await rng.ADSImportData("JOBCODEsCodeGroups", "ADSJOBCODESCODEGROUPS", "BUDGETINGJOBCODESGROUPS", "isGroup", "true"));


        }

        [HttpGet]
        [Route("integrator/JOBCODEsMaster")]
        [ApiExplorerSettings(GroupName = "ADS Integrator JOB CODES")]

        public async Task<IActionResult> GetJOBCODEsMasterData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("JOBCODEsMaster", "ADSJOBCODESMASTER", "BUDGETINGJOBCODESMASTER", "isMaster", "true"));

        }


        [HttpGet]
        [Route("integrator/JOBCODEsCodeGroupMembers")]
        [ApiExplorerSettings(GroupName = "ADS Integrator JOB CODES")]

        public async Task<IActionResult> GetJOBCODEsCodeGroupMembersData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("JOBCODEsCodeGroupMembers", "ADSJOBCODESGROUPSMEMBERS", "BUDGETINGJOBCODESGROUPSMEMBERS", "isMemberData", "true"));

        }
        #endregion

        //[HttpGet]
        //[Route("integrator/Types/JOBCODEs")]
        //public async Task<IActionResult> TypesJOBCODEs()
        //{

        //    var rng = new ADSData(_httpClientFactory, Configuration);

        //    // return Ok(await rng.GetJOBCODEsData( ));
        //    return Ok(await rng.ADSImportData("TypesJOBCODEs", "ADSTYPESJOBCODES", "BUDGETINGTYPESJOBCODES", "ITEMTYPEKEYWORD", "JOBCODETYPE"));

        //}

        #region DataScenarios


        /* Data Scenarios*/


        [HttpGet]
        [Route("integrator/DataScenariosStaffing")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Data Scenarios")]

        public async Task<IActionResult> DataScenariosStaffing()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("DataScenariosStaffing", "ADSDATASCENARIOTYPESTAFFING", "BUDGETINGDATASCENARIOTYPESTAFFING", "DataScenarioType", "SF"));

        }
        [HttpGet]
        [Route("integrator/DataScenariosGL")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Data Scenarios")]

        public async Task<IActionResult> DataScenariosGL()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("DataScenariosGL", "ADSDATASCENARIOTYPEGL", "BUDGETINGDATASCENARIOTYPEGL", "DataScenarioType", "GL"));

        }
        [HttpGet]
        [Route("integrator/DataScenariosStats")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Data Scenarios")]

        public async Task<IActionResult> DataScenariosStats()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("DataScenariosStats", "ADSDATASCENARIOTYPESTATS", "BUDGETINGDATASCENARIOTYPESTATS", "DataScenarioType", "ST"));

        }

        #endregion


        #region StaffingData
        [HttpGet]
        [Route("integrator/StaffingDataPayType")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Staffing")]

        public async Task<IActionResult> StaffingDataPayType()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("StaffingDataPayType", "ADSDATASTAFFINGDATAPAYTYPE", "BUDGETINGDATASTAFFINGDATAPAYTYPE", "StaffingDataType", "PAYTYPE"));

        }
        [HttpGet]
        [Route("integrator/StaffingDataJobCode")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Staffing")]

        public async Task<IActionResult> StaffingDataJobCode()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("StaffingDataJobCode", "ADSDATASTAFFINGDATAJOBCODE", "BUDGETINGDATASTAFFINGDATAJOBCODE", "StaffingDataType", "JOBCODE"));

        }

        [HttpGet]
        [Route("integrator/StaffingData")]
        [ApiExplorerSettings(GroupName = "ADS Integrator Staffing")]

        public async Task<IActionResult> StaffingData()
        {

            var rng = new ADSData(_httpClientFactory, Configuration);

            // return Ok(await rng.GetJOBCODEsData( ));
            return Ok(await rng.ADSImportData("StaffingData", "ADSDATASTAFFINGDATA", "BUDGETINGDATASTAFFINGDATA"));

        }

        #endregion   
    }
}
