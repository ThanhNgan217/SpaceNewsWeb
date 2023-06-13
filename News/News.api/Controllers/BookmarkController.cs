using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using News.api.Data;
using News.api.Entities;
using Microsoft.AspNetCore.Authorization;
using News.api.ViewModels;

namespace News.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;



        public BookmarkController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/readhistory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bookmark>>> GetBookmark()
        {
            if (_context.Bookmark == null)
            {
                return NotFound();
            }
            return await _context.Bookmark.ToListAsync();
        }

        [HttpGet("{UserID}")]
        public async Task<ActionResult<Bookmark>> GetHistory(string UserID)
        {
            if (_context.Bookmark == null)
            {
                return NotFound();
            }


            var data = await _context.Bookmark.FindAsync(UserID);

            if (data == null)
            {
                return NotFound();
            }

            return data;
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<Bookmark>> AddBookmark(BookmarkCreateModel model)
        {
            if (_context.Bookmark == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Bookmark'  is null.");
            }


            var data = _mapper.Map<Bookmark>(model);
            _context.Bookmark.Add(data);
            await _context.SaveChangesAsync();

            CreatedAtAction("GetBookmark", new { UserID = data.UserID }, data);
            return data;
        }

        [HttpPut("{UserID}")]
        //[Authorize]
        public async Task<IActionResult> PutHistories(string UserID, BookmarkUpdate model)
        {
            if (UserID != model.UserID)
            {
                return BadRequest();
            }

            var data = _mapper.Map<Bookmark>(model);
            _context.Entry(data).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

            }

            return NoContent();
        }

    }
}
