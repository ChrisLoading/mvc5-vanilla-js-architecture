using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Mvc5.App_Start;

namespace Mvc5
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            // 先註冊 Web API，再註冊 MVC 路由，避免路由衝突
            GlobalConfiguration.Configure(WebApiConfig.Register);

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // 註冊完 Web API 路由後，註冊 DI container
            DependencyConfig.Register();
        }
    }
}
