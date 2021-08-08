﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ABSDAL.Services
{
    public class CompressionHelper
    {

        public static string CompressString(string Data)
        {

            byte[] buffer = Encoding.UTF8.GetBytes(Data);
            var memoryStream = new MemoryStream();
            using (var gZipStream = new GZipStream(memoryStream, CompressionMode.Compress, true))
            {
                gZipStream.Write(buffer, 0, buffer.Length);
            }

            memoryStream.Position = 0;

            var compressedData = new byte[memoryStream.Length];
            memoryStream.Read(compressedData, 0, compressedData.Length);

            var gZipBuffer = new byte[compressedData.Length + 4];
            Buffer.BlockCopy(compressedData, 0, gZipBuffer, 4, compressedData.Length);
            Buffer.BlockCopy(BitConverter.GetBytes(buffer.Length), 0, gZipBuffer, 0, 4);
            return Convert.ToBase64String(gZipBuffer);
        }
        public static string DeCompressString(string Data)
        {

            byte[] gZipBuffer = Convert.FromBase64String(Data);
            using (var memoryStream = new MemoryStream())
            {
                int dataLength = BitConverter.ToInt32(gZipBuffer, 0);
                memoryStream.Write(gZipBuffer, 4, gZipBuffer.Length - 4);

                var buffer = new byte[dataLength];

                memoryStream.Position = 0;
                using (var gZipStream = new GZipStream(memoryStream, CompressionMode.Decompress))
                {
                    gZipStream.Read(buffer, 0, buffer.Length);
                }

                return Encoding.UTF8.GetString(buffer);
            }
        }

        public static string GetUncompressedData(JsonElement xData)
        {
            try
            {
                string decompressedData = "";
                Services.CompressedRequest Compressedvalues = JsonConvert.DeserializeObject<Services.CompressedRequest>(xData.ToString());

                if (Compressedvalues.isCompressed)
                {
                    var uncompresseddata = Services.CompressionHelper.DeCompressString(Compressedvalues.compressedData);
                    decompressedData = uncompresseddata;
                }
                return decompressedData;
                
            }
            catch (Exception)
            {

                return xData.ToString();
            }
           
        }
    }


    public class CompressedRequest
    {
        public string compressedData { get; set; }
        public bool isCompressed { get; set; }

    }




}