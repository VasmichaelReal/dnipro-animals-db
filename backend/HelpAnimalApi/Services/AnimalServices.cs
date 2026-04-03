using HelpAnimal.Api.Models;
using HelpAnimal.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace HelpAnimal.Api.Models;

public class AnimalService : IAnimalService
{
    private readonly AppDbContext _context;

    public AnimalService(AppDbContext context)
    {
        _context = context;
    }

    // Тепер беремо дані прямо з Supabase
    public List<Animal> GetAll() => _context.Animals.AsNoTracking().ToList();
    
    public Animal? GetById(int id) => _context.Animals.Find(id);
    
    public void Add(Animal animal) 
    {
        _context.Animals.Add(animal);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var animal = _context.Animals.Find(id);
        if (animal != null)
        {
            _context.Animals.Remove(animal);
            _context.SaveChanges();
        }
    }
}