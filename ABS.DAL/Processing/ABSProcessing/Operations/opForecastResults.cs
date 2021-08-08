using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace ABSProcessing.Operations
{
    public class opForecastResults
    {


        public ForecastResults _ForcastResults { get; set; }


        public DimensionRow targetDimensionRow 
        { 
            get
            { 
                if (_ForcastResults != null)
                {
                    return _ForcastResults.targetDimensionRow;
                } 
                else
                {
                    return null;
                }
            }
            set
            {
                this._ForcastResults.targetDimensionRow = value;
            
            } 
        
        }

        public JObject result { get { 
            
            if (_ForcastResults != null )
                {
                    JObject x = new JObject();
                    x =  JObject.Parse( _ForcastResults.result.ToString());
                    return x;
                }
            else
                {
                    return null;
                }
            } 
            
            set {
                this._ForcastResults.result = value.ToString(Newtonsoft.Json.Formatting.None);
            } 
        
        }


    }
}
