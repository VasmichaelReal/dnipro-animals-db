namespace HelpAnimal.Api.Models;

public class Application
{
    public int Id { get; set; }
    public int AnimalId { get; set; }
    public required string ApplicantName { get; set; }
    public required string ApplicantPhone { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "New"; // New, Pending, Approved, Rejected
}