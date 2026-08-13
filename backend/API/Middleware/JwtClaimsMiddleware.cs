namespace API.Middleware;

public class JwtClaimsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtClaimsMiddleware> _logger;

    public JwtClaimsMiddleware(RequestDelegate next, ILogger<JwtClaimsMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {

        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userId = context.User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = context.User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value;

            _logger.LogInformation("Authenticated Request from UserId: {UserId}, Role: {Role}", userId, role);

        }
        else
        {
            _logger.LogWarning("Unauthenticated request to {Path}", context.Request.Path);
        }

        await _next(context);
    }
}
