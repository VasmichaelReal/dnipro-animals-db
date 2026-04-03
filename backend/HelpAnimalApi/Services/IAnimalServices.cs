using HelpAnimal.Api.Models;

namespace HelpAnimal.Api.Services;

public interface IAnimalService
{
    List<Animal> GetAll();
    Animal? GetById(int id);
    void Add(Animal animal);
    void Delete(int id);
}
