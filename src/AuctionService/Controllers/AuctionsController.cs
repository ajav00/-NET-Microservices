using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _dbContext;
    private readonly IMapper _mapper;

    public AuctionsController(AuctionDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAuctions()
    {
        var auctions = await _dbContext.Auctions
            .Include(x => x.Item)
            .OrderBy(x => x.Item.Make)
            .ToListAsync();

        return Ok(_mapper.Map<List<AuctionDto>>(auctions));
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

    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
    {
        var auction = _mapper.Map<Auction>(createAuctionDto);
        //TODO: add current user as seller
        auction.Seller = "test";
        
        _dbContext.Auctions.Add(auction);
        var result = await _dbContext.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to DB");

        return CreatedAtAction(nameof(GetAuctionById), new {id = auction.Id}, _mapper.Map<AuctionDto>(auction));
    }

    [HttpPut("{id}")] // api/auctions/{id}
    public async Task<ActionResult<AuctionDto>> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _dbContext.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null) return NotFound();

        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;


        var result = await _dbContext.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to DB");

        return Ok(_mapper.Map<AuctionDto>(auction));
    }

    [HttpDelete("{id}")] // api/auctions/{id}
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _dbContext.Auctions.FindAsync(id);
        if (auction == null) return NotFound();

        _dbContext.Auctions.Remove(auction);

        var result = await _dbContext.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to DB");

        return Ok();
    }

}

