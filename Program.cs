using HelpAnimal.Api.Models;
using Microsoft.OpenApi;
using HelpAnimal.Api.Endpoints;
using HelpAnimal.Api.Services;
using HelpAnimal.Api.Auth;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddSingleton<IAnimalService, AnimalService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapPetEndpoints();

app.MapPost("/login", (LoginRequest request) =>
{
    // Тимчасова перевірка (логін: admin, пароль: password123)
    if (request.Username == "admin" && request.Password == "password123")
    {
        // Повертаємо фейковий токен (у реальному житті тут був би JWT)
        return Results.Ok(new { Token = "super-secret-admin-token" });
    }

    return Results.Unauthorized(); // 401 якщо дані невірні
});
app.Run();