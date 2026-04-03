using HelpAnimal.Api.Models;
using HelpAnimal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HelpAnimal.Api.Endpoints;

public static class PetEndpointsMapping
{
    public static void MapPetEndpoints(this WebApplication app)
    {
        // --- ГРУПА ТВАРИН (/animals) ---
        var animalGroup = app.MapGroup("/animals");

        // GET /animals - Отримуємо лише тих, хто "шукає родину"
        animalGroup.MapGet("/", (IAnimalService animalService) => 
        {
            var animals = animalService.GetAll()
                .Where(a => a.Status == "шукає родину"); 
            return Results.Ok(animals);
        });

        // GET /animals/1 - Отримати конкретну тварину за ID
        animalGroup.MapGet("/{id}", (int id, IAnimalService animalService) =>
        {
            var animal = animalService.GetById(id);
            return animal is null ? Results.NotFound() : Results.Ok(animal);
        });

        // POST /animals - Додавання нової тварини
        animalGroup.MapPost("/", (HttpContext context, Animal animal, IAnimalService animalService) =>
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (authHeader != "super-secret-admin-token")
            {
                return Results.Json(new { message = "Доступ заборонено!" }, statusCode: 403);
            }

            if (string.IsNullOrWhiteSpace(animal.SterilizationStatus)) 
            {
                animal.SterilizationStatus = "not available";
            }

            animalService.Add(animal);
            return Results.Created($"/animals/{animal.Id}", animal);
        });

        // PUT /animals/1 - Оновлення даних про тварину
        animalGroup.MapPut("/{id}", (HttpContext context, int id, Animal updatedAnimal, IAnimalService animalService) =>
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
            existingAnimal.SterilizationStatus = updatedAnimal.SterilizationStatus;

            return Results.NoContent();
        });

        // DELETE /animals/1 - Видалення тварини
        animalGroup.MapDelete("/{id}", (int id, IAnimalService animalService) =>
        {
            var animal = animalService.GetById(id);
            if (animal is null) return Results.NotFound();

            animalService.Delete(id);
            return Results.NoContent();
        });

        // --- ГРУПА ЗАЯВОК (/applications) ---
        var appGroup = app.MapGroup("/applications");

        // POST /applications - Прийом заявки
        appGroup.MapPost("/", (Application application) => 
        {
            if (string.IsNullOrEmpty(application.ApplicantName) || 
                string.IsNullOrEmpty(application.ApplicantPhone) || 
                application.AnimalId <= 0)
            {
                return Results.BadRequest("Будь ласка, вкажіть ПІБ, телефон та ID тварини.");
            }

            application.Id = new Random().Next(1, 1000);
            application.CreatedAt = DateTime.UtcNow;
            application.Status = "New";

            return Results.Created($"/applications/{application.Id}", application);
        });
    }
}