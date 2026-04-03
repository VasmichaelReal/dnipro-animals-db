using HelpAnimal.Api.Models;
using HelpAnimal.Api.Services;
namespace HelpAnimal.Api.Models;

public class AnimalService : IAnimalService
{
    private readonly List<Animal> _animals = new()
    {
        new Animal { Id = 1, Name = "Пес Патрон", Status = "Шукає Родину" },
        new Animal { Id = 2, Name = "Потужнопес", Status = "Шукає Родину" }
    };

    public List<Animal> GetAll() => _animals;
    
    public Animal? GetById(int id) => _animals.FirstOrDefault(a => a.Id == id);
    
    public void Add(Animal animal) 
    {
        animal.Id = _animals.Count > 0 ? _animals.Max(a => a.Id) + 1 : 1;
        _animals.Add(animal);
    }

    public void Delete(int id)
{
    var animal = _animals.FirstOrDefault(a => a.Id == id);
    if (animal != null)
    {
        _animals.Remove(animal);
    }
}
}