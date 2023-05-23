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
    public class GroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GroupsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //POST : api/posts/add_group
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Group>> CreateGroup([FromBody] GroupCreateModel model)
        {
            var data = _mapper.Map<Group>(model);

            _context.Groups.Add(data);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGroups), new { Id = data.Id }, data);
        }

        //GET : Api/posts/get_groups
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }
            return await _context.Groups.ToListAsync();
        }


        //////////////////////////////////////////////////////////////////////////////////////
        // GET: api/posts/get_groups/5
        //[HttpGet("{Id}")]
        //public async Task<ActionResult<Group>> GetGroup(int Id)
        //{
            //var gr = await _context.Groups.FindAsync(Id);

            //if (gr == null)
            //{
                //return NotFound();
            //}

           // return gr;
        //}
    }
}
