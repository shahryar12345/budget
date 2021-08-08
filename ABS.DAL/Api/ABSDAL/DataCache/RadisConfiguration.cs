namespace ABSDAL.DataCache
{
    internal class RedisConfiguration
    {


        public bool UseRedis { get; set; }
        public string ServerAddress { get; set; }
        public int port { get; set; }
        public string InstanceName { get; set; }

        public string connectionString
        {
            get
            {
                return ServerAddress + ":" + port;
            }
        }


    }
}