using Autofac;
using Autofac.Integration.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using Mvc5.Repositories;
using Mvc5.Services;
using System.Web.Http;

namespace Mvc5.App_Start
{
    public static class DependencyConfig
    {
        public static void Register()
        {
            var builder = new ContainerBuilder();

            // 註冊 Web API controllers（讓 Autofac 能解析 ApiController）
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // 註冊各層：Repository / Service
            // InstancePerRequest 會在每個 HTTP 請求建立作用域，適合 EF DbContext 等
            builder.RegisterType<PrRepository>().As<IPrRepository>().InstancePerRequest();
            builder.RegisterType<PrService>().As<IPrService>().InstancePerRequest();

            // 若有其他 service/repo，依樣註冊
            // builder.RegisterType<AnotherService>().As<IAnotherService>().InstancePerRequest();
            // ......

            var container = builder.Build();

            // 把 Autofac 設為 Web API 的 DependencyResolver
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}