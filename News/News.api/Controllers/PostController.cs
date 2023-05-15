using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using News.api.Data;
using News.api.Entities;
using News.api.ViewModels;

namespace News.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PostsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts(
            int? topicId = null,
            string keyword = "", 
            int pageIndex = 0, 
            int pageSize = 10)
        {
            var query = _context.Posts.Include(s => s.Topic).Include(s => s.Group).AsQueryable();

            if (topicId != null)
            {
                query = query.Where(s => s.TopicID == topicId);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(s => s.Content.Contains(keyword)
                || (s.Topic != null && s.Topic.Name.Contains(keyword)) || (s.Title.Contains(keyword))
                );

            var result =  await query
                .Skip(pageIndex * pageSize)
                .Take(pageSize).ToListAsync();
            return result;
        }

        // GET: api/posts/5
        [HttpGet("{Id}")]
        public async Task<ActionResult<Post>> GetPost(int Id)
        {
            var post = await _context.Posts.FindAsync(Id);

            if (post == null)
            {
                return NotFound();
            }

            return post;
        }

        // POST: api/posts
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Post>> CreatePost([FromBody]PostCreateModel model)
        {
            var post = _mapper.Map<Post>(model);

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { Id = post.Id }, post);
        }

        // PUT: api/posts/5
        [HttpPut("{Id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int Id, PostUpdateModel model)
        {
            //if (Id != model.Id)
            //{
              //  return BadRequest();
            //}

            var post = _mapper.Map<Post>(model);
            _context.Entry(post).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/posts/5
        [HttpDelete("{Id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int Id)
        {
            var post = await _context.Posts.FindAsync(Id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int Id)
        {
            return _context.Posts.Any(p => p.Id == Id);
        }
    }
}