namespace HelpAnimal.Api.Models;

public class Animal
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Age { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "Шукає родину";
    public string PhotoUrl { get; set; } = "";
}