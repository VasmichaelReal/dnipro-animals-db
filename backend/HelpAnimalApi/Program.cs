using HelpAnimal.Api.Models;
using Microsoft.OpenApi;
using HelpAnimal.Api.Endpoints;
using HelpAnimal.Api.Services;
using HelpAnimal.Api.Auth;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

// 1. Отримуємо рядок підключення з appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Налаштовуємо контекст бази даних (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Реєструємо сервіс як Scoped (це замість вашого AddSingleton)
builder.Services.AddScoped<IAnimalService, AnimalService>();

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

// Перед var app = builder.Build();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Після var app = builder.Build();
app.UseCors();