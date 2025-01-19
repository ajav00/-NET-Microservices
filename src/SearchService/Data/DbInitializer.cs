using System;
using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{
  public static async Task InitDB(WebApplication app)
  {
    await DB.InitAsync("SearchDB", MongoClientSettings
    .FromConnectionString(app.Configuration.GetConnectionString("MongoDBConnection")));

    await DB.Index<Item>()
        .Key(x => x.Make, KeyType.Text)
        .Key(x => x.Model, KeyType.Text)
        .Key(x => x.Color, KeyType.Text)
        .CreateAsync();

    var count = await DB.CountAsync<Item>();
    // if (count == 0)
    // {
    //   Console.WriteLine("No items found. Seeding data...");
    //   var itemsData = await File.ReadAllTextAsync("Data/auctions.json");
    //   var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true }; 
    //   var items = JsonSerializer.Deserialize<List<Item>>(itemsData, options);
    //   await DB.SaveAsync(items);
    // }

    using var scope = app.Services.CreateScope();
    var auctionSvcHttpClient = scope.ServiceProvider.GetRequiredService<AuctionSvcHttpClient>();
    var items = await auctionSvcHttpClient.GetItemsForSearchDb();
    Console.WriteLine($"Seeding {items.Count} items...");
    await DB.SaveAsync(items);


  }
}
