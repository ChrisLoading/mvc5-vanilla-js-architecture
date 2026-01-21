using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Mvc5.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // 1) 啟用屬性路由（[RoutePrefix]/[Route]）
            config.MapHttpAttributeRoutes();

            // 2) 傳統路由 (備用)
            config.Routes.MapHttpRoute(
                    name: "DefaultApi", 
                    routeTemplate: "api/{controller}/{id}", 
                    defaults: new { id = RouteParameter.Optional }
                );

            // JSON 為預設（optional）
            var json = config.Formatters.JsonFormatter;

            // 重要：將 JSON 輸出改為 camelCase（符合前端期待格式）
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // 將 DateTime 轉為 UTC 格式
            json.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
        }
    }
}