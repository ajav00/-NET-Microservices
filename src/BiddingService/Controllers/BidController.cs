using System;
using System.Threading.Tasks;
using BiddingService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidController : ControllerBase
{

  [Authorize]
  [HttpPost]
  public async Task<ActionResult> PlaceBid(string auctionId, int amount)
  {
    var auction = await DB.Find<Auction>().OneAsync(auctionId);
    if (auction == null) return NotFound("Auction not found");

    if (auction.Seller == User.Identity?.Name) return BadRequest("Cannot bid on your own auction");

    var bid = new Bid
    {
      Amount = amount,
      AuctionId = auctionId,
      Bidder = User.Identity?.Name
    };

    if (auction.AuctionEnd < DateTime.UtcNow)
    {
      bid.BidStatus = BidStatus.Finished;
    }
    else
    {
      var highBid = await DB.Find<Bid>()
        .Match(b => b.AuctionId == auctionId)
        .Sort(b => b.Descending(x => x.Amount))
        .ExecuteFirstAsync();

      if (highBid != null && amount > highBid.Amount || highBid == null)
      {
        bid.BidStatus = amount > auction.ReservePrice
          ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
      }

      if (highBid != null && amount <= highBid.Amount)
      {
        bid.BidStatus = BidStatus.TooLow;
      }

    }


    await DB.SaveAsync(bid);
    return Ok(bid);
  }

  [HttpGet("{auctionId}")]
  public async Task<ActionResult<List<Bid>>> GetBidsForAuction(string auctionId)
  {
    return await DB.Find<Bid>().Match(b => b.AuctionId == auctionId)
      .Sort(b => b.Descending(x => x.BidTime)).ExecuteAsync();
  }

}
