using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next,ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                await HandleExceptionAsync(context, e, _logger);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;
            switch (exception)
            {
                case RestException re:
                    logger.LogError(exception,"REST ERROR");
                    errors = re.Errors;
                    context.Response.StatusCode = (int) re.Code;
                    break;
                
                case { } e:
                    logger.LogError(exception,"SERVER ERROR");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "ERROR" : e.Message;
                    context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";
            if (errors != null)
            {
                var result = JsonSerializer.Serialize(new {errors});
                await context.Response.WriteAsync(result);
            }
        }
    }
}