using System;
using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;
public class AuctionDeleteConsumer : IConsumer<AuctionDeleted>
{
    private readonly IMapper _mapper;

    public AuctionDeleteConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
      Console.WriteLine("--> Consuming auction deleted: ");


      var result = await DB.DeleteAsync<Item>(context.Message.Id);
      if(!result.IsAcknowledged) throw new MessageException(typeof(AuctionDeleted), "Problem updating item");

    }
}