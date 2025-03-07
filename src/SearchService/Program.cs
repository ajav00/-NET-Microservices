using System.Net;
using MongoDB.Driver;
using MongoDB.Entities;
using Polly;
using Polly.Extensions.Http;
using SearchService.Data;
using SearchService.Models;
using SearchService.Services;
using MassTransit;
using SearchService.Consumers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddHttpClient<AuctionSvcHttpClient>().AddPolicyHandler(GetPolicy());
builder.Services.AddMassTransit(x => {

    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

    x.UsingRabbitMq((ctx, cfg) => {

        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>{
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ReceiveEndpoint("search-auction-created", e => {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionCreatedConsumer>(ctx);
        });

        cfg.ConfigureEndpoints(ctx);
    });
});

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(async () => {
    try
    {
        await DbInitializer.InitDB(app);    
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
    }
});

app.Run();


static IAsyncPolicy<HttpResponseMessage> GetPolicy() 
=> HttpPolicyExtensions
.HandleTransientHttpError()
.OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
.WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));