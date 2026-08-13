using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIAgentController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public AIAgentController(IConfiguration configuration)
    {
        _configuration = configuration;
        _httpClient = new HttpClient();
    }

    [HttpPost("suggest")]
    public async Task<ActionResult<AISuggestionResponse>> SuggestContent([FromBody] AISuggestionRequest request)
    {
        var apiKey = _configuration["AI:GeminiKey"];
        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
        {

            await Task.Delay(1500);
            var suggestedTitle = "Advanced: " + (request.RawContent.Length > 20 ? request.RawContent.Substring(0, 20) + "..." : request.RawContent);
            var suggestedDescription = $"This is an AI-generated summary for your input: '{request.RawContent}'. This course will cover everything you need to master this topic, providing hands-on exercises and expert insights.";
            return Ok(new AISuggestionResponse { SuggestedTitle = suggestedTitle, SuggestedDescription = suggestedDescription });
        }

        var prompt = $"Based on the following syllabus/notes, generate a concise Course Title and a 2-3 sentence engaging Course Description. Format the response exactly like this:\nTitle: [Generated Title]\nDescription: [Generated Description]\n\nSyllabus:\n{request.RawContent}";

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={apiKey}", jsonContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorDetails = await response.Content.ReadAsStringAsync();
            return BadRequest($"Failed to get response from Gemini API: {errorDetails}");
        }

        var jsonString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(jsonString);
        var text = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? "";

        var lines = text.Split('\n');
        var title = lines.FirstOrDefault(l => l.StartsWith("Title: "))?.Replace("Title: ", "").Trim() ?? "Generated Title";
        var desc = lines.FirstOrDefault(l => l.StartsWith("Description: "))?.Replace("Description: ", "").Trim() ?? "Generated Description";

        return Ok(new AISuggestionResponse
        {
            SuggestedTitle = title,
            SuggestedDescription = desc
        });
    }
}

public class AISuggestionRequest
{
    public string RawContent { get; set; } = string.Empty;
}

public class AISuggestionResponse
{
    public string SuggestedTitle { get; set; } = string.Empty;
    public string SuggestedDescription { get; set; } = string.Empty;
}
