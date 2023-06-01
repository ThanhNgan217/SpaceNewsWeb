using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using News.api.Data;
using News.api.Entities;
using News.api.ViewModels;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace News.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GroupMembersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/group-members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupMember>>> GetMembersofGroups(
            int? groupId = null)
        {
            var query = _context.GroupMembers.Include(s => s.Members).AsQueryable();

            if (_context.GroupMembers == null)
            {
                return NotFound();
            }
            if (groupId != null)
            {
                query = query.Where(s => s.GroupID == groupId);
            }
            var result = await query.ToListAsync();
            return result;
        }

        // GET: api/group-members/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupMember>> GetGroup(int id)
        {
            if (_context.GroupMembers == null)
            {
                return NotFound();
            }
            var group = await _context.GroupMembers.FindAsync(id)
;

            if (group == null)
            {
                return NotFound();
            }

            return group;
        }
    }
}