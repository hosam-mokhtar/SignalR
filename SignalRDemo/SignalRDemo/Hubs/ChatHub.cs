using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Context;
using SignalRDemo.Models;

namespace SignalRDemo.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ChatDbContext context, ILogger<ChatHub> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Send(string userName, string message)
        {
            await Clients.Others.SendAsync("ReciveMessage", userName, message);

            var msg = new Message
            {
                UserName = userName,
                Text = message
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();
        }
    }
}
