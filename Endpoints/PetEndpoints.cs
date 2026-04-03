using HelpAnimal.Api.Models;
using HelpAnimal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace PetEndpoints;

[ApiController]
[Route("api/[controller]")]
public class AnimalsController : ControllerBase
{
    private readonly IAnimalService _animalService;

    public AnimalsController(IAnimalService animalService)
    {
        _animalService = animalService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_animalService.GetAll());

    [HttpPost]
    public IActionResult Post(Animal animal)
    {
        _animalService.Add(animal);
        return Ok(animal);
    }
}