namespace HelpAnimal.Api.Models;

public class Volunteer
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }

    public string Username { get; set; } = "";
}