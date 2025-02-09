using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuctionsController(AuctionDbContext dbContext, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAuctions(string date)
    {

        var query = _dbContext.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

        if(!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).AddSeconds(-1).ToUniversalTime()) > 0);
        }


        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _dbContext.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        return Ok(_mapper.Map<AuctionDto>(auction));
    }

    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
    {
        var auction = _mapper.Map<Auction>(createAuctionDto);
        
        auction.Seller = User.Identity?.Name ?? "Unknown user";
        
        _dbContext.Auctions.Add(auction);
        
        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));
        
        var result = await _dbContext.SaveChangesAsync() > 0;
        
        if(!result) return BadRequest("Could not save changes to DB");

        return CreatedAtAction(nameof(GetAuctionById), new {id = auction.Id}, newAuction);
    }

    [Authorize]
    [HttpPut("{id}")] // api/auctions/{id}
    public async Task<ActionResult<AuctionDto>> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _dbContext.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        if (auction.Seller != User.Identity?.Name) return Forbid();

        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

        await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));


        var result = await _dbContext.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to DB");

        return Ok(_mapper.Map<AuctionDto>(auction));
    }

    [Authorize]
    [HttpDelete("{id}")] // api/auctions/{id}
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _dbContext.Auctions.FindAsync(id);
        if (auction == null) return NotFound();

        if (auction.Seller != User.Identity?.Name) return Forbid();

        _dbContext.Auctions.Remove(auction);

        await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });


        var result = await _dbContext.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to DB");

        return Ok();
    }

}

