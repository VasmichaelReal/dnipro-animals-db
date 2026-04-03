using HelpAnimal.Api.Models;
using HelpAnimal.Api.Services;
using Microsoft.AspNetCore.Mvc;
    
namespace HelpAnimal.Api.Endpoints;
    
    
 public static class PetEndpointsMapping
{

    const string GetPetEndpointName = "GetGame";
    
    
    public static void MapPetEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/animals");

//GET /animals
group.MapGet("/", (IAnimalService animalService) => 
{
    var animals = animalService.GetAll();
    return Results.Ok(animals);
});

//GET /games/1
group.MapGet("/{id}", (int id, IAnimalService animalService) =>
{
    var animal = animalService.GetById(id);
    return animal is null ? Results.NotFound() : Results.Ok(animal);
});

//POST /games
group.MapPost("/", (HttpContext context, Animal animal, IAnimalService animalService) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();

    if (authHeader != "super-secret-admin-token")
    {
        return Results.Json(new { message = "Доступ заборонено! Ви не волонтер." }, statusCode: 403);
    }
    animalService.Add(animal);
    return Results.Created($"/animals/{animal.Id}", animal);
});

//PUT /games/1
group.MapPut("/{id}", (HttpContext context, int id, Animal updatedAnimal, IAnimalService animalService) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (authHeader != "super-secret-admin-token")
    {
        return Results.Unauthorized();
    }

    var existingAnimal = animalService.GetById(id);
    if (existingAnimal is null) return Results.NotFound();

    existingAnimal.Name = updatedAnimal.Name;
    existingAnimal.Status = updatedAnimal.Status;
    existingAnimal.Description = updatedAnimal.Description;
    existingAnimal.Age = updatedAnimal.Age;

    return Results.NoContent();
});

//DELETE /games/1
group.MapDelete("/{id}", (int id, IAnimalService animalService) =>
{
    var animal = animalService.GetById(id);
    if (animal is null) return Results.NotFound();

    // Нам треба додати метод Delete у сервіс (зробимо це нижче)
    animalService.Delete(id);

    return Results.NoContent();
});
    }
}