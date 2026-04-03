using Microsoft.EntityFrameworkCore;
using HelpAnimal.Api.Models;

namespace HelpAnimal.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Animal> Animals => Set<Animal>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Volunteer> Volunteers => Set<Volunteer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Animal>().ToTable("animals");
        modelBuilder.Entity<Application>().ToTable("applications");
        modelBuilder.Entity<Volunteer>().ToTable("volunteers");

        modelBuilder.Entity<Animal>(entity =>
        {
            // Вказуємо, що властивість Id в коді відповідає колонці id в базі
            entity.Property(e => e.Id).HasColumnName("id"); 
            
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.PhotoUrl).HasColumnName("photo_url");
            entity.Property(e => e.SterilizationStatus).HasColumnName("is_sterilized");
        });

        modelBuilder.Entity<Application>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id"); // Те саме для заявок
            entity.Property(e => e.AnimalId).HasColumnName("animal_id");
            entity.Property(e => e.ApplicantName).HasColumnName("applicant_name");
            entity.Property(e => e.ApplicantPhone).HasColumnName("applicant_phone");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Status).HasColumnName("status");
        });
    }
}