using Microsoft.EntityFrameworkCore;
using SignalRDemo.Models;

namespace SignalRDemo.Context
{
    public class ChatDbContext(DbContextOptions<ChatDbContext> options) : DbContext(options)
    {
        //public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        //{
        //}
        public DbSet<Message> Messages { get; set; }
    }
}
